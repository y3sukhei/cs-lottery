import { NextResponse } from 'next/server'
import { prisma } from "../../../libs/prisma";

export async function POST(req) {
    const { ticketList } = await req.json()

    const newParticipant = await prisma.participant.createManyAndReturn({
        data: ticketList,
        skipDuplicates: true,
    })

    return NextResponse.json(newParticipant);
}