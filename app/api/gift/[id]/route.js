import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { prisma } from "../../../libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const id = req.url.split("/").pop();

  const gift = await prisma.gift.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  return NextResponse.json(gift)
}

export async function DELETE(req, res) {
    const giftId = req.url.split("/").pop();
  
    const deleteGift = await prisma.gift.delete({
        where: {
          id: parseInt(giftId),
        },
      })
      console.log("delete gift", deleteGift)
  
    return NextResponse.json(deleteGift)
}

export async function PUT(req, res) {
    const giftId = req.url.split("/").pop();
    const {name, description, img, participantId} = await req.json()

    const updateGift = await prisma.gift.update({
        where: {
          id: parseInt(giftId),
        },
        data:{
            name: name,
            description:description,
            img:img,
            participantId:participantId
        }
      })
      console.log("update gift", updateGift)
  
    return NextResponse.json(updateGift)
}

