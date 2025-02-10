import db from "@repo/db/client"
import { NextResponse } from "next/server"
export async function POST(request: Request){
    const body = await request.json()
    // console.log("hi", (body))
    const token = Math.random().toString()
    await db.bankTransaction.create({
        data:{
            token,
            userId: Number(body.userId),
            startTime: body.startTime,
            status: 'Processing',
            amount: Number(body.amount),
        }
    })

    return NextResponse.json({
        token
    })
}