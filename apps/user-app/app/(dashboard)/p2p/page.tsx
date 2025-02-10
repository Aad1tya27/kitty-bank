import { P2PTransferComponent } from "../../../components/P2PTransfer"
import { P2PTransactionComponent } from "../../../components/P2PTransactions"
import db from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"

async function getP2Ptransactions(userId: string){
    const transactions1 = await db.p2PTransaction.findMany({
        where:{
            senderId: Number(userId)
        },
        select:{
            "amount": true,
            "senderId": true,
            "recipentId": true,
            "startTime": true,
            "id": true
        }
    })
    const transactions2 = await db.p2PTransaction.findMany({
        where:{
            recipentId: Number(userId)
        },
        select:{
            "amount": true,
            "senderId": true,
            "recipentId": true,
            "startTime": true,
            "id": true
        }
    })
    const allTrans = transactions1.concat(transactions2).sort((a,b) => (a.startTime < b.startTime) ? 1 : -1)
    return allTrans
}

export default async function () {
    const session = await getServerSession(authOptions)
    const transactions = await getP2Ptransactions(session.user.id)
    // console.log(transactions, "yo")
    // return <div className="flex justify-center items-center  w-full h-[90vh]">
    //     <div className="w-[400px] gap-4  h-[450px] rounded-lg justify-center items-center flex flex-col bg-[#f2f2f2] p-5 border border-black border-opacity-50">
    //         <P2PTransactionComponent/>
    //     </div>
    // </div>
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <P2PTransferComponent />
            </div>
            <div>
                <P2PTransactionComponent transactions={transactions} userId={session.user.id} />
            </div>
        </div>
    </div>
}