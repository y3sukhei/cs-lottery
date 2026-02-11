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

        const validTickets = ticketList.filter(ticket => {
            // Check if ticket has at least one identifier
            return ticket.ticketId || ticket.phone_no || ticket.sub_id;
        });

        if (validTickets.length === 0) {
            return NextResponse.json(
                { error: "No valid tickets found in batch" }, 
                { status: 400 }
            );
        }
        console.log("nothing returns as of today")

        if (validTickets.length < ticketList.length) {
            console.warn(`Warning: ${ticketList.length - validTickets.length} invalid tickets filtered out`);
        }

        // Use a transaction for better reliability
        const result = await prisma.$transaction(async (tx) => {
            const created = await tx.participant.createMany({
                data: validTickets,
                skipDuplicates: true,
            });
            return created;
        });

        console.log("Batch upload successful:", {
            requested: ticketList.length,
            valid: validTickets.length,
            created: result.count
        });

        return NextResponse.json({
            success: true,
            requested: ticketList.length,
            valid: validTickets.length,
            created: result.count,
            skipped: validTickets.length - result.count
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