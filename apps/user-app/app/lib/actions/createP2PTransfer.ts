"use server"
import db from "@repo/db/client"
import { P2PMessage } from "../enums"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function createP2PTransfer(number: string, amount: number){
    try {
        const session = await getServerSession(authOptions)
        const recp = await db.user.findFirst({
            where:{
                number: number,
            },
            select:{
                id: true,
            }
        })
        console.log(session.user.id, recp?.id)
        if(!recp){
            return {
                message: P2PMessage.NotFound,
            }
        }
        if(recp.id === Number(session.user.id)){
            return {
                message: P2PMessage.SameUser,
            }
        }
        const curr_user = await db.balance.findFirst({
            where:{
                userId: Number(session.user.id)
            }
        })
        
        if(curr_user && curr_user.amount  < amount){
            return {
                message: P2PMessage.LowBalance,
            }
        }

        await db.$transaction(async(tx)=>{
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(session.user.id)} FOR UPDATE`;

            await tx.balance.updateMany({
                where:{
                    userId: Number(session.user.id)
                },
                data:{
                    amount: {
                        decrement: amount
                    }
                }
            })

            await tx.balance.updateMany({
                where:{
                    userId: recp.id
                },
                data:{
                    amount:{
                        increment: amount
                    }
                }
            })

            await tx.p2PTransaction.create({
                data:{
                    senderId: Number(session.user.id),
                    recipentId: recp.id,
                    startTime: new Date(),
                    amount,
                }
            })
        })
        

        return {
            message: P2PMessage.Success,
        }
    } catch (e) {
        console.log(e)
        return {
            message:  P2PMessage.Failure,
        }
    }
}