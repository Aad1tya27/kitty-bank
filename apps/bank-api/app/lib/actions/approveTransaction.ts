"use server";
import db from "@repo/db/client";
import axios from "axios";

export async function approveTransaction(
  token: string
) {
  try {
    const entry = await db.bankTransaction.update({
      where: {
        token,
        status: "Processing",
      },
      data: {
        status: "Success",
      },
      select: {
        token: true,
        userId: true,
        amount: true,
      },
    });

    if (entry && process.env.NEXT_PUBLIC_WEBHOOK_URL) {
        await axios.post(`${process.env.NEXT_PUBLIC_WEBHOOK_URL}/webhook`,{
            token,
            amount: entry.amount,
            password: process.env.BANK_PASSWORD,
            userId: entry.userId
        },{
            headers:{
                'Content-Type':"application/json"
            }
        })
        return {
            message: "Successful",
        };
    } else {
      return {
        message: "Failure",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      message: "Failure",
    };
  }
}
