import { Router } from "express";
import {
  createReceipt,
  deleteReceipt,
  getReceipt,
  listReceipts,
  updateReceipt,
} from "../store/receiptStore";
import { Receipt } from "../models/receipt";

const router = Router();

router.get("/", async (req, res) => {
  const receipts = await listReceipts();
  res.json(receipts);
});

router.get("/:id", async (req, res) => {
  const receipt = await getReceipt(req.params.id);
  if (!receipt) {
    return res.status(404).json({ error: "Receipt not found" });
  }
  res.json(receipt);
});

router.post("/", async (req, res) => {
  const payload = req.body as Partial<
    Omit<Receipt, "id" | "createdAt" | "updatedAt">
  >;
  if (
    !payload ||
    typeof payload.vendor !== "string" ||
    typeof payload.amount !== "number" ||
    typeof payload.date !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "vendor, amount, and date are required" });
  }

  const receipt = await createReceipt({
    vendor: payload.vendor,
    amount: payload.amount,
    currency: payload.currency || "USD",
    date: payload.date,
    category: payload.category || "Uncategorized",
    notes: payload.notes,
    source: payload.source,
  });

  res.status(201).json(receipt);
});

router.put("/:id", async (req, res) => {
  const updated = await updateReceipt(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Receipt not found" });
  }
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await deleteReceipt(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Receipt not found" });
  }
  res.status(204).send();
});

router.post("/upload", async (req, res) => {
  const payload = req.body as {
    filename?: string;
    vendor: string;
    amount: number;
    date: string;
    category?: string;
    notes?: string;
    sourceBase64?: string;
  };

  if (
    !payload ||
    typeof payload.vendor !== "string" ||
    typeof payload.amount !== "number" ||
    typeof payload.date !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "vendor, amount, and date are required" });
  }

  const receipt = await createReceipt({
    vendor: payload.vendor,
    amount: payload.amount,
    currency: "USD",
    date: payload.date,
    category: payload.category || "Uploaded Receipt",
    notes: payload.notes,
    source: {
      filename: payload.filename,
      uploadedAt: new Date().toISOString(),
    },
  });

  res.status(201).json({
    message: "Receipt uploaded successfully",
    receipt,
  });
});

export default router;
