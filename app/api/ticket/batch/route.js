import { NextResponse } from 'next/server'
import { prisma } from '@/app/libs/prisma';

export async function POST(req) {
    try {
        const { ticketList } = await req.json();
        
        if (!ticketList || !Array.isArray(ticketList) || ticketList.length === 0) {
            return NextResponse.json(
                { error: "Invalid ticketList: must be a non-empty array" }, 
                { status: 400 }
            );
        }

        console.log("Received batch upload request:");
        console.log("- Ticket count:", ticketList.length);
        console.log("- First ticket:", ticketList[0]);

        const seen = new Set();
        const withinBatchDupes = [];
        const validTickets = [];

        for (const t of ticketList) {
            const raw = t.ticketId ?? t.phone_no ?? t.sub_id;
            if (raw === undefined || raw === null) continue;
            const ticketId = String(raw).trim();
            if (!ticketId) continue;
            if (seen.has(ticketId)) {
                withinBatchDupes.push(ticketId);
                continue;
            }
            seen.add(ticketId);
            validTickets.push({ ticketId });
        }

        if (validTickets.length === 0) {
            return NextResponse.json(
                { error: "No valid tickets found in batch" },
                { status: 400 }
            );
        }

        const existing = await prisma.participant.findMany({
            where: { ticketId: { in: validTickets.map(v => v.ticketId) } },
            select: { ticketId: true }
        });
        const existingSet = new Set(existing.map(e => e.ticketId));
        const existingDupes = [...existingSet];
        const toInsert = validTickets.filter(v => !existingSet.has(v.ticketId));

        let createdCount = 0;
        if (toInsert.length > 0) {
            const result = await prisma.participant.createMany({
                data: toInsert,
                skipDuplicates: true,
            });
            createdCount = result.count;
        }

        console.log("Batch upload successful:", {
            requested: ticketList.length,
            valid: validTickets.length,
            created: createdCount,
            withinBatchDupes: withinBatchDupes.length,
            existingDupes: existingDupes.length
        });

        return NextResponse.json({
            success: true,
            requested: ticketList.length,
            valid: validTickets.length,
            created: createdCount,
            skipped: validTickets.length - createdCount,
            withinBatchDupes,
            existingDupes
        });

    } catch (error) {
        console.error("Error in batch upload:", error);
        
        // More detailed error response
        return NextResponse.json({ 
            success: false,
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        }, { 
            status: 500 
        });
    }
}