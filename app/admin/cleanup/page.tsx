"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCleanupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCleanup = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cleanup-deleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: password }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-white hover:text-gray-300"
        >
          ← Back to Admin
        </button>

        <h1 className="text-white text-3xl font-bold mb-6">
          Cleanup Deleted Users
        </h1>

        <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-6">
          <p className="text-[#8E8E93] mb-4">
            This will permanently delete all users marked as "deleted" from the database.
          </p>

          <div className="mb-4">
            <label className="text-white block mb-2">Admin Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2C2C2E] text-white rounded-lg"
              placeholder="Enter admin password"
            />
          </div>

          <button
            onClick={handleCleanup}
            disabled={loading || !password}
            className="w-full py-3 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            {loading ? 'Cleaning up...' : 'Delete All "Deleted" Users'}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-2xl ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h2 className="text-white font-bold mb-2">Result:</h2>
            <pre className="text-white text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
