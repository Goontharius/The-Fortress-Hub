import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  deleteReceipt,
  fetchReceipts,
  postReceipt,
  updateReceipt,
} from "./api/receipts";

const apiBase = "/api";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Supplies");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editReceiptId, setEditReceiptId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchReceipts(apiBase)
      .then(setReceipts)
      .catch(() => setStatus("Unable to load receipts."))
      .finally(() => setLoading(false));
  }, []);

  const amountValue = useMemo(() => parseFloat(amount), [amount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!vendor || !amount || !date) {
      setStatus("Vendor, amount, and date are required.");
      return;
    }

    try {
      if (editReceiptId) {
        const updated = await updateReceipt(apiBase, editReceiptId, {
          vendor,
          amount: amountValue,
          date,
          category,
          notes,
        });

        setReceipts((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        setStatus("Receipt updated successfully.");
      } else {
        const receipt = await postReceipt(apiBase, {
          vendor,
          amount: amountValue,
          date,
          category,
          notes,
        });

        setReceipts((current) => [receipt, ...current]);
        setStatus("Receipt saved successfully.");
      }

      setVendor("");
      setAmount("");
      setDate("");
      setCategory("Supplies");
      setNotes("");
      setEditReceiptId(null);
    } catch (error) {
      setStatus(
        editReceiptId ? "Unable to update receipt." : "Unable to save receipt.",
      );
    }
  };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>The Fortress Hub</h1>
      <p>Local receipt dashboard connected to the backend API.</p>

      <section style={{ marginTop: "1.5rem", maxWidth: 640 }}>
        <h2>{editReceiptId ? "Edit Receipt" : "New Receipt"}</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "0.75rem" }}
        >
          <input
            placeholder="Vendor"
            value={vendor}
            onChange={(event) => setVendor(event.target.value)}
          />
          <input
            placeholder="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <input
            placeholder="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
          />
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit">
              {editReceiptId ? "Update Receipt" : "Save Receipt"}
            </button>
            {editReceiptId ? (
              <button
                type="button"
                onClick={() => {
                  setVendor("");
                  setAmount("");
                  setDate("");
                  setCategory("Supplies");
                  setNotes("");
                  setEditReceiptId(null);
                  setStatus(null);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {status ? <p>{status}</p> : null}
      </section>

      <section style={{ marginTop: "2rem", maxWidth: 760 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Receipts</h2>
          <input
            placeholder="Search receipts"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              width: 220,
            }}
          />
        </div>
        {loading ? (
          <p>Loading receipts...</p>
        ) : receipts.length === 0 ? (
          <p>No receipts found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ccc",
                    padding: "0.5rem",
                  }}
                >
                  Vendor
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #ccc",
                    padding: "0.5rem",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ccc",
                    padding: "0.5rem",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ccc",
                    padding: "0.5rem",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #ccc",
                    padding: "0.5rem",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts
                .filter((receipt) =>
                  [
                    receipt.vendor,
                    receipt.category,
                    receipt.notes,
                    receipt.date,
                  ]
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((receipt) => (
                  <tr key={receipt.id}>
                    <td style={{ padding: "0.5rem 0" }}>{receipt.vendor}</td>
                    <td style={{ padding: "0.5rem 0", textAlign: "right" }}>
                      ${receipt.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: "0.5rem 0" }}>{receipt.date}</td>
                    <td style={{ padding: "0.5rem 0" }}>{receipt.category}</td>
                    <td style={{ padding: "0.5rem 0", textAlign: "center" }}>
                      <button
                        onClick={() => {
                          setEditReceiptId(receipt.id);
                          setVendor(receipt.vendor);
                          setAmount(receipt.amount.toString());
                          setDate(receipt.date);
                          setCategory(receipt.category);
                          setNotes(receipt.notes || "");
                          setStatus(null);
                        }}
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.4rem 0.75rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await deleteReceipt(apiBase, receipt.id);
                            setReceipts((current) =>
                              current.filter((item) => item.id !== receipt.id),
                            );
                            setStatus("Receipt deleted successfully.");
                          } catch {
                            setStatus("Unable to delete receipt.");
                          }
                        }}
                        style={{ padding: "0.4rem 0.75rem" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default App;
