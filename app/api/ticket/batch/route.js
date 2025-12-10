import { NextResponse } from 'next/server'
import { prisma } from "../../../libs/prisma";

export async function POST(req) {
    const { ticketList } = await req.json()

    const result = await prisma.participant.createMany({
        data: ticketList,
        skipDuplicates: true,
    })

    return NextResponse.json(result);
}