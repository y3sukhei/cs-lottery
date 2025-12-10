import { NextResponse } from 'next/server'
import { prisma } from "../../../libs/prisma";

export async function POST(req) {
    try {
        const { ticketList } = await req.json();
        console.log("Received ticketList:", ticketList?.length, ticketList?.[0]);

        const result = await prisma.participant.createMany({
            data: ticketList,
            skipDuplicates: true,
        });
        console.log("Batch upload response: ", result);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in batch upload:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}