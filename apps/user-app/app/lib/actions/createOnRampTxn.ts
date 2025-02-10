"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client"
import axios from "axios";

export async function createOnRampTransaction(amount: number, provider: string){
    const session = await getServerSession(authOptions)
    console.log(session)
    const current_date = new Date()
    const userId = session.user.id;
    try {
        // console.log({
        //     amount,
        //     userId,
        //     startTime : current_date
        // })
        console.log("Bank URL:", process.env.NEXT_PUBLIC_BANK_URL);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BANK_URL}/api/token`,{
            userId,
            startTime : current_date,
            amount
        },{
            headers:{
                'Content-Type':'application/json',
            }
        })
        const token = res.data.token
        console.log(token  + "yo")
        if(!userId){
            return {
                message: "User not logged in"
            }
        }
        await db.onRampTransaction.create({
            data:{
                status:"Processing",
                amount: amount,
                userId: Number(userId),
                startTime: current_date,
                token: token,
                provider
            }
        })
    
        return token
    } catch (e) {
        console.error("Error occured" + e)
        return ""
    }
    
}