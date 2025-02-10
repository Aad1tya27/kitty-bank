"use client"
import { Card } from "@repo/ui/card"
import { useState } from "react"
import { createP2PTransfer } from "../app/lib/actions/createP2PTransfer"
import { P2PMessage } from "../app/lib/enums"

export const P2PTransferComponent = () => {
    const [number, setNumber] = useState("")
    const [amount, setAmount] = useState(0)
    const [errorActive, setErrorActive] = useState(false)
    const [errorVal, setErrorVal] = useState("")
    const [success, setSuccess] = useState(false)

    const submitHandler = async () => {
        if(!(amount > 0)) {
            setErrorActive(true)
            setErrorVal("Nice try")
            setTimeout(() => {
                setErrorActive(false)
                setErrorVal("")
            }, 2000);
            return
        }

        const res = await createP2PTransfer(number, amount * 100)
        if (res.message === P2PMessage.Failure) {
            setErrorActive(true)
            setErrorVal("Transfer Failed")
            setTimeout(() => {
                setErrorActive(false)
                setErrorVal("")
            }, 2000);
        } else if (res.message === P2PMessage.NotFound) {
            setErrorActive(true)
            setErrorVal("Recipent Not Found")
            setTimeout(() => {
                setErrorActive(false)
                setErrorVal("")
            }, 2000);
        } else if (res.message === P2PMessage.LowBalance) {
            setErrorActive(true)
            setErrorVal("Your account doesn't have sufficient funds.")
            setTimeout(() => {
                setErrorActive(false)
                setErrorVal("")
            }, 2000);
        } else if (res.message === P2PMessage.SameUser) {
            setErrorActive(true)
            setErrorVal("Self transfer is not possible")
            setTimeout(() => {
                setErrorActive(false)
                setErrorVal("")
            }, 2000);
        } else if (res.message === P2PMessage.Success) {
            setSuccess(true)
            setAmount(0)
            setNumber("")
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }

    }

    return <>
        <Card title="Transfer Money">
            <div className="inputs w-full flex justify-center flex-col items-center">
                <div className="pt-2 w-[90%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="amount">Number</label>
                    <input type="text" onChange={(e) => setNumber(e.target.value)} name="user-number" id="user-number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Number" value={number} />
                </div>

                <div className="pt-2 w-[90%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="amount">Amount</label>
                    <input type="number" onChange={(e) => setAmount(Number(e.target.value))} name="amount" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Amount" value={amount} />
                </div>
            </div>
            <div className="flex justify-center flex-col items-center">

                <button onClick={submitHandler} type="submit" className=" text-white bg-gray-800 p-3 m-3 px-4 rounded-lg">Submit</button>
                {errorActive && <div className="text-red-500 m-2">{errorVal}</div>}
                {success && <div className="text-green-500 m-2">Transferred Successfully</div>}
            </div>
        </Card>
    </>
}