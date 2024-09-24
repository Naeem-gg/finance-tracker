import { sql } from "drizzle-orm";
import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  email: text("email").notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').notNull().primaryKey(),
  date: text('date').notNull(),
  amount: real('amount').notNull(),
  account: text('account').notNull(),
  note: text('note').notNull(),
  type: text('type').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});