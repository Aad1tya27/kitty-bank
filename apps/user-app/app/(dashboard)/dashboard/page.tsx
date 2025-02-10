import db from "@repo/db/client"
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation'

async function getName(){
    const session = await getServerSession(authOptions)
    if (!(session) || !session.user || !session.user.id) {
        redirect("/api/auth/signin")
    }
    const user = await db.user.findFirst({
        where:{
            id: Number(session.user.id)
        },
        select:{
            "number": true,
        }
    })
    
    return user
}

export default async function() {
    const user = await getName();
    return <div className="w-full h-screen flex justify-center items-center text-4xl flex-col gap-5">
        <div>Welcome to Kitty Bank</div>
        <div className="text-2xl">Your Phone Number: {user?.number}</div>
    </div>
}