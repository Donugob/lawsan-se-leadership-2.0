"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReconcileButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReconcile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/reconcile", {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to reconcile");
        return;
      }
      
      alert(`Reconciliation complete! Checked ${data.checked} pending delegates. Successfully reconciled ${data.reconciled} payments.`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred during reconciliation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleReconcile}
      disabled={isLoading}
      className="flex items-center gap-2 bg-gold-500 border border-gold-600 px-4 py-2.5 rounded-xl text-forest-950 font-bold hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? "Syncing..." : "Sync Pending"}
    </button>
  );
}
