"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { approveTransaction } from "@/app/lib/actions/approveTransaction";
import Image from "next/image";

const bgColorTypes = {
  HDFC: "#0e3355",
  AXIS: "#761a2d"
}

export default function SuspenseComponent() {
  const urlParams = useSearchParams()
  const provider = useMemo(() => urlParams.get("provider"), [urlParams]);
  const [bgcolor, setBgColor] = useState<string>("black")

  useEffect(() => {
    if (provider === "HDFC") setBgColor(bgColorTypes.HDFC);
    else if (provider === "AXIS") setBgColor(bgColorTypes.AXIS);
  }, [provider])

  useEffect(() => {
    async function initiateApproveTransaction() {
      try {
        if (urlParams.get("token")) {
          const res = await approveTransaction(urlParams.get("token") || "")
          if (res.message === "Failure") {
            throw new Error("Failure: Payment Failed");
          }
        } else {
          throw new Error("Forbidden: You don't have permission to access this resource.");
        }
        window.location.href = `${process.env.NEXT_PUBLIC_WALLET_URL}/transfer`
      } catch (e) {
        console.error(e)
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_WALLET_URL}/transfer`
        }, 2000);
      }
    }
    setTimeout(() => {
      initiateApproveTransaction()
    }, 3000);
  }, [])
  return (
    <main className={"flex justify-center items-center  h-screen bg-black"} style={{backgroundColor: bgcolor}}>
      <div className="w-[400px] h-[300px] bg-white rounded-2xl flex flex-col justify-center gap-10 items-center">
        <div className="">
          <h1 className="text-3xl font-bold text-center">{provider} Bank</h1>
          <h1 className="text-3xl font-bold">Net Banking Platform</h1>
        </div>
        {/* <Image src={"../public/Hourglass.gif"} alt="my gif" height={500} width={500} /> */}
        <div className="justify-center flex flex-col items-center gap-5">
          <Image width={"60"} height={"60"} src="/loading.gif" alt="" />
          <h2 className="text-lg">Please wait while we process your Request</h2>
        </div>
      </div>
    </main>
  );
}
