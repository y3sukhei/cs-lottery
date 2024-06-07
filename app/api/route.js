import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import {NextResponse} from 'next/server'
import { prisma } from "../libs/prisma";
// Let's initialize it as null initially, and we will assign the actual database instance later.
let db = null;

// Define the GET request handler function
export async function GET(req, res) {
  // Check if the database instance has been initialized
  // if (!db) {
  //   // If the database instance is not initialized, open the database connection
  //   db = await open({
  //     filename: "./collection.db", // Specify the database file path
  //     driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
  //   });
  // }
  const gifts = await prisma.gift.findMany({ orderBy: [
    {
      id: 'asc',
    },
  ],})
  // Perform a database query to retrieve all items from the "items" table
  // const items = await db.all("SELECT * FROM items");

  // Return the items as a JSON response with status 200
  return NextResponse.json(gifts)
}

export async function POST(req) {
  const {name, description, img} = await req.json()

  const newTask = await prisma.gift.create({
    data: {
      name, 
      description, 
      img
    }
  })
return NextResponse.json(newTask);
}
export async function DELETE(req) {
  const deleteGift = await prisma.gift.deleteMany({});
  return NextResponse.json(deleteGift);
}