import db from "@repo/db/client"
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session.user.id) {
        return {
            amount: 0,
            locked: 0
        }
    }
    console.log(session.user.id)
    const balance = await db.balance.findFirst({
        where: { userId: Number(session.user.id) },
        select:{
            amount: true,
            locked: true
        }
    },
    )
    // const balance = await db.balance.upsert({
    //     where: { userId: Number(session.user.id) },
    //     update: {},
    //     create: {
    //         userId: Number(session.user.id),
    //         amount: 0,
    //         locked: 0,
    //     },
    //     select:{
    //         amount: true,
    //         locked: true
    //     }
    // },
    // )
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await db.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    
    // txns.filter(t=> t.status === 'Success')
    return txns.map(t => ({
        id: t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    })).sort((a,b)=> a.time < b.time ? 1 : -1)
}

export default async function () {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Bank Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}