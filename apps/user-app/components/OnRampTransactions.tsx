import { Card } from "@repo/ui/card"
import { OnRampStatus } from "@repo/db/client"

type statusType ={
    Success: string,
    Failure: string,
    Processing: string
}

const cardColor: statusType = {
    Success: "bg-green-100",
    Failure: "bg-red-100",
    Processing: "bg-yellow-100"
}

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        id: number,
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: OnRampStatus,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2 flex flex-col gap-2 max-h-[50vh] overflow-auto">
            {transactions.map(t => <div key={t.id} className={`flex p-1 px-2 rounded-sm justify-between ${cardColor[t.status]}`}>
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}