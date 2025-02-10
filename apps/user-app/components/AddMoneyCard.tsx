"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTxn";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: process.env.NEXT_PUBLIC_BANK_URL + "?provider=HDFC"
}, {
    name: "Axis Bank",
    redirectUrl: process.env.NEXT_PUBLIC_BANK_URL + "?provider=AXIS"
}];

export const AddMoney = () => {
    const [amount, setAmount] = useState(0)
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl || "");
    return (
        <>
            <Card title="Add Money">
                <div className="w-full">
                    <div className="pt-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="amount">Amount</label>
                        <input value={amount} onChange={(e) => setAmount(Number(e.target.value))} type="number" name="amount" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Amount" />
                    </div>
                    <div className="py-4 text-left">
                        Bank
                    </div>
                    <Select onSelect={(value) => {
                        setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                    }} options={SUPPORTED_BANKS.map(x => ({
                        key: x.name,
                        value: x.name
                    }))} />
                    <div className="flex justify-center pt-4">
                        <Button onClick={async () => {
                            const token = await createOnRampTransaction(Math.floor(amount * 100), redirectUrl);
                            window.location.href = `${redirectUrl}&token=${token}` || "";
                        }}>
                            Add Money
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    )
}