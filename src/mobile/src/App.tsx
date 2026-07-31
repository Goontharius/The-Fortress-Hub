import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";

const apiBase = Constants.expoConfig?.extra?.apiBase ?? "http://localhost:4000";
const apiToken =
  Constants.expoConfig?.extra?.apiToken ?? "fortress-hub-api-token";

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

const authHeaders = {
  Authorization: `Bearer ${apiToken}`,
};

async function fetchReceipts(): Promise<Receipt[]> {
  const response = await fetch(`${apiBase}/receipts`, {
    headers: authHeaders,
  });
  if (!response.ok) {
    throw new Error("Unable to load receipts");
  }
  return response.json();
}

async function postReceipt(
  payload: Omit<Receipt, "id" | "createdAt" | "updatedAt">,
): Promise<Receipt> {
  const response = await fetch(`${apiBase}/receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to save receipt");
  }
  return response.json();
}

async function updateReceipt(
  id: string,
  payload: Partial<Omit<Receipt, "id" | "createdAt" | "updatedAt">>,
): Promise<Receipt> {
  const response = await fetch(`${apiBase}/receipts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to update receipt");
  }
  return response.json();
}

async function deleteReceipt(id: string): Promise<void> {
  const response = await fetch(`${apiBase}/receipts/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!response.ok) {
    throw new Error("Unable to delete receipt");
  }
}

export default function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Supplies");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const amountValue = useMemo(() => parseFloat(amount) || 0, [amount]);

  async function loadReceipts() {
    setLoading(true);
    try {
      const data = await fetchReceipts();
      setReceipts(data);
    } catch (error) {
      Alert.alert("Load error", String(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!vendor || !amount || !date) {
      Alert.alert("Validation", "Vendor, amount, and date are required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        vendor,
        amount: amountValue,
        currency: "USD",
        date,
        category,
        notes: notes || undefined,
      };

      const saved = selectedId
        ? await updateReceipt(selectedId, payload)
        : await postReceipt(
            payload as Omit<Receipt, "id" | "createdAt" | "updatedAt">,
          );

      setReceipts((list) => {
        if (selectedId) {
          return list.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...list];
      });

      setVendor("");
      setAmount("");
      setDate("");
      setCategory("Supplies");
      setNotes("");
      setSelectedId(null);
    } catch (error) {
      Alert.alert("Save error", String(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteReceipt(id);
      setReceipts((list) => list.filter((receipt) => receipt.id !== id));
    } catch (error) {
      Alert.alert("Delete error", String(error));
    }
  }

  function startEdit(receipt: Receipt) {
    setSelectedId(receipt.id);
    setVendor(receipt.vendor);
    setAmount(receipt.amount.toString());
    setDate(receipt.date);
    setCategory(receipt.category);
    setNotes(receipt.notes ?? "");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>The Fortress Hub Mobile</Text>
        <Text style={styles.subtitle}>
          Secure receipt tracking with backend persistence.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {selectedId ? "Edit Receipt" : "New Receipt"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Vendor"
            value={vendor}
            onChangeText={setVendor}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <View style={styles.buttonRow}>
            <Button
              title={selectedId ? "Update" : "Save"}
              onPress={handleSave}
              disabled={saving}
            />
            {selectedId ? (
              <Button
                title="Cancel"
                onPress={() => setSelectedId(null)}
                color="#888"
              />
            ) : null}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Receipts</Text>
            <Button title="Refresh" onPress={loadReceipts} />
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={receipts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <View style={styles.listItemText}>
                    <Text style={styles.itemVendor}>{item.vendor}</Text>
                    <Text style={styles.itemMeta}>
                      {item.date} • {item.category}
                    </Text>
                    <Text>${item.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.listButtons}>
                    <TouchableOpacity
                      onPress={() => startEdit(item)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No receipts available.</Text>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7fb",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 86,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    flex: 1,
    marginRight: 12,
  },
  itemVendor: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemMeta: {
    color: "#666",
    marginBottom: 4,
  },
  listButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#1f8ef1",
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyText: {
    padding: 12,
    color: "#666",
  },
});
