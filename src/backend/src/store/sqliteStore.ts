import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Receipt } from "../models/receipt";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function openDb(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (db) return db;

  db = await open({
    filename: "./data/receipts.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      vendor TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      sourceFilename TEXT,
      sourceUploadedAt TEXT
    )
  `);

  return db;
}

function mapRow(row: any): Receipt {
  return {
    id: row.id,
    vendor: row.vendor,
    amount: row.amount,
    currency: row.currency,
    date: row.date,
    category: row.category,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    source:
      row.sourceFilename || row.sourceUploadedAt
        ? {
            filename: row.sourceFilename ?? undefined,
            uploadedAt: row.sourceUploadedAt ?? undefined,
          }
        : undefined,
  };
}

export async function listReceipts(): Promise<Receipt[]> {
  const db = await openDb();
  const rows = await db.all(`SELECT * FROM receipts ORDER BY createdAt DESC`);
  return rows.map(mapRow);
}

export async function getReceipt(id: string): Promise<Receipt | undefined> {
  const db = await openDb();
  const row = await db.get(`SELECT * FROM receipts WHERE id = ?`, id);
  return row ? mapRow(row) : undefined;
}

export async function createReceipt(
  data: Omit<Receipt, "id" | "createdAt" | "updatedAt">,
): Promise<Receipt> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const now = new Date().toISOString();
  const receipt: Receipt = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const db = await openDb();
  await db.run(
    `INSERT INTO receipts (id, vendor, amount, currency, date, category, notes, createdAt, updatedAt, sourceFilename, sourceUploadedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    receipt.id,
    receipt.vendor,
    receipt.amount,
    receipt.currency,
    receipt.date,
    receipt.category,
    receipt.notes ?? null,
    receipt.createdAt,
    receipt.updatedAt,
    receipt.source?.filename ?? null,
    receipt.source?.uploadedAt ?? null,
  );

  return receipt;
}

export async function updateReceipt(
  id: string,
  data: Partial<Omit<Receipt, "id" | "createdAt" | "updatedAt">>,
): Promise<Receipt | undefined> {
  const existing = await getReceipt(id);
  if (!existing) {
    return undefined;
  }

  const updated: Receipt = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const db = await openDb();
  await db.run(
    `UPDATE receipts SET vendor = ?, amount = ?, currency = ?, date = ?, category = ?, notes = ?, updatedAt = ?, sourceFilename = ?, sourceUploadedAt = ? WHERE id = ?`,
    updated.vendor,
    updated.amount,
    updated.currency,
    updated.date,
    updated.category,
    updated.notes ?? null,
    updated.updatedAt,
    updated.source?.filename ?? null,
    updated.source?.uploadedAt ?? null,
    updated.id,
  );

  return updated;
}

export async function deleteReceipt(id: string): Promise<boolean> {
  const db = await openDb();
  const result = await db.run(`DELETE FROM receipts WHERE id = ?`, id);
  return (result.changes ?? 0) > 0;
}
