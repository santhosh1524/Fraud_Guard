import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";
import {
  useTransactions,
  useCreateTransaction,
} from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";

const statusStyles: Record<string, string> = {
  normal: "bg-success/10 text-success border-success/20",
  fraud: "bg-fraud/10 text-fraud border-fraud/20",
  anomaly: "bg-anomaly/10 text-anomaly border-anomaly/20",
  pending: "bg-muted text-muted-foreground border-border",
};

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  const { data: transactions, isLoading, refetch } = useTransactions();
  const createTransaction = useCreateTransaction();
  const { isAdmin } = useAuth();

  /* -------------------------
     ADD SAMPLE TRANSACTION
  ------------------------- */
  const handleAddSampleTransaction = () => {
    const sampleLocations = [
      "New York, US",
      "London, UK",
      "Tokyo, JP",
      "Paris, FR",
      "Unknown",
    ];
    const sampleDevices = ["Mobile", "Desktop", "Tablet"];
    const sampleMerchants = [
      "Amazon",
      "Walmart",
      "Target",
      "Best Buy",
      "Unknown Merchant",
    ];

    createTransaction.mutate({
      transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      amount: Math.floor(Math.random() * 10000) + 50,
      merchant:
        sampleMerchants[Math.floor(Math.random() * sampleMerchants.length)],
      location:
        sampleLocations[Math.floor(Math.random() * sampleLocations.length)],
      device_type:
        sampleDevices[Math.floor(Math.random() * sampleDevices.length)],
      fraud_status: "pending",
    });
  };

  /* -------------------------
     SAFE FILTER LOGIC
  ------------------------- */
  const filteredTransactions = (transactions || []).filter((txn) => {
    const transactionId = String(txn.transaction_id ?? "");
    const merchant = String(txn.merchant ?? "");
    const fraudStatus = String(txn.fraud_status ?? "pending");

    const matchesSearch =
      transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || fraudStatus === statusFilter;

    const matchesAmount =
      amountFilter === "all" ||
      (amountFilter === "low" && txn.amount < 500) ||
      (amountFilter === "medium" &&
        txn.amount >= 500 &&
        txn.amount < 5000) ||
      (amountFilter === "high" && txn.amount >= 5000);

    return matchesSearch && matchesStatus && matchesAmount;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-16">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Transaction Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            View and analyze all transactions with fraud detection status
          </p>
        </div>

        <div className="flex gap-3">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSampleTransaction}
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Sample
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button variant="accent" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-card p-4 rounded-xl border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Transaction ID or Merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="low">&lt; $500</SelectItem>
                <SelectItem value="medium">$500 - $5,000</SelectItem>
                <SelectItem value="high">&gt; $5,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-4 px-4 text-left text-sm text-muted-foreground">
                    Transaction ID
                  </th>
                  <th className="py-4 px-4 text-left text-sm text-muted-foreground">
                    Merchant
                  </th>
                  <th className="py-4 px-4 text-left text-sm text-muted-foreground">
                    Amount
                  </th>
                  <th className="py-4 px-4 text-left text-sm text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="py-4 px-4 text-left text-sm text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((txn) => {
                  const fraudStatus = String(
                    txn.fraud_status ?? "pending"
                  );

                  return (
                    <tr
                      key={txn.id}
                      className="border-t border-border hover:bg-muted/30"
                    >
                      <td className="py-4 px-4 font-mono text-sm">
                        {txn.transaction_id || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {txn.merchant || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium">
                        ${Number(txn.amount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {new Date(txn.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            statusStyles[fraudStatus] ||
                            statusStyles.pending
                          }
                        >
                          {fraudStatus.charAt(0).toUpperCase() +
                            fraudStatus.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
