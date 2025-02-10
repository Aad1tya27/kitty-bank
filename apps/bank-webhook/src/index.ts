require("dotenv").config();
import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Healthy server",
  });
});

app.post("/webhook", async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: number;
    amount: number;
    password: string;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
    password: req.body.password,
  };
  console.log(process.env.BANK_PASSWORD);
  console.log(paymentInformation);
  if (paymentInformation.password !== process.env.BANK_PASSWORD) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    await db.$transaction(async (tx) => {
      const currStatus = await tx.onRampTransaction.findFirst({
        where: {
          token: paymentInformation.token,
        },
        select: {
          status: true,
        },
      });
      if (!currStatus) {
        throw new Error("Transaction Not Available");
      }
      //   console.log(currStatus.status);
      if (currStatus.status === "Processing") {
        await tx.balance.updateMany({
          where: {
            userId: paymentInformation.userId,
          },
          data: {
            amount: {
              increment: paymentInformation.amount,
            },
          },
        });
        await tx.onRampTransaction.updateMany({
          where: {
            token: paymentInformation.token,
          },
          data:{
            status: "Success"
          }
        });
      }
    });

    return res.status(200).json({
      message: "Captured",
    });
  } catch (e) {
    await db.onRampTransaction.updateMany({
      where: {
        token: paymentInformation.token,
      },
      data: {
        status: "Failure",
      },
    });
  }
  res.status(500).json({
    message: "Error while processing webhook",
  });
});

app.listen(3003);
