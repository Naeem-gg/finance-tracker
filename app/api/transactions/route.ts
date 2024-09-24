import { db } from "@/drizzle/db";
import { transactions } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";

const TransactionSchema = z.object({
  date: z.string(),
  amount: z.number().min(0.1).max(100000),
  account: z.string(),
  note: z.string(),
  type: z.enum(["Income", "Expenses"]),
});

export const GET = async (req: NextRequest) => {
  try {
    const allTransactions = await db.select().from(transactions).all();
    return NextResponse.json(allTransactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = TransactionSchema.parse(body);

    const transactionWithId = {
      ...validatedData,
      id: nanoid(),
    };

    await db.insert(transactions).values(transactionWithId).execute();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
};