import { Card } from "@repo/ui/card"


export const P2PTransactionComponent = ({
    transactions,
    userId
}: {
    transactions: {
        id: number;
        amount: number;
        startTime: Date;
        recipentId: number;
        senderId: number;
    }[],
    userId: string
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2 flex flex-col gap-2 max-h-[60vh] overflow-auto ">
            {transactions.map(t => <div key={t.id} className={`flex p-1 px-2 rounded-sm justify-between`}>
                <div>
                    <div className="text-sm">
                        {
                            Number(userId) === t.recipentId ?
                                "Received INR"
                                :
                                "Sent INR"
                        }
                    </div>

                    <div className="text-slate-600 text-xs">
                        {t.startTime.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                {
                            Number(userId) === t.recipentId ?
                                "+"
                                :
                                "-"
                        } Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}