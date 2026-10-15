"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DatabaseManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'x-admin-key': 'admin123' }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (walletId: string) => {
    if (!deletePassword) {
      alert('Please enter admin password');
      return;
    }

    if (!confirm('Permanently delete this user? This cannot be undone!')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123'
        },
        body: JSON.stringify({ 
          wallet_id: walletId,
          adminPassword: deletePassword 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('User permanently deleted!');
        setDeletePassword("");
        setSelectedUser(null);
        fetchUsers(); // Refresh list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error: any) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const cleanupDeletedUsers = () => {
    router.push('/admin/cleanup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1018] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.status === 'active');
  const deletedUsers = users.filter(u => u.status === 'deleted');
  const restrictedUsers = users.filter(u => u.status === 'restricted' || u.status === 'suspended');

  return (
    <div className="min-h-screen bg-[#0F1018] p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-white hover:text-gray-300"
        >
          ← Back to Admin
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl font-bold">Database Management</h1>
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-[#8E8E93] text-sm">Total Users</p>
            <p className="text-white text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-[#8E8E93] text-sm">Active</p>
            <p className="text-green-500 text-2xl font-bold">{activeUsers.length}</p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-[#8E8E93] text-sm">Deleted</p>
            <p className="text-red-500 text-2xl font-bold">{deletedUsers.length}</p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-[#8E8E93] text-sm">Restricted</p>
            <p className="text-yellow-500 text-2xl font-bold">{restrictedUsers.length}</p>
          </div>
        </div>

        {/* Cleanup Button */}
        {deletedUsers.length > 0 && (
          <div className="bg-[#FF453A]/10 border-2 border-[#FF453A]/50 rounded-xl p-4 mb-6">
            <p className="text-white mb-3">
              ⚠️ You have {deletedUsers.length} user(s) marked as deleted. These should be permanently removed.
            </p>
            <button
              onClick={cleanupDeletedUsers}
              className="px-6 py-2 bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 font-semibold"
            >
              Clean Up Deleted Users
            </button>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-bold">All Users</h2>
          
          {users.map((user) => (
            <div 
              key={user.wallet_id}
              className={`bg-[#1C1C1E] rounded-xl p-6 ${
                user.status === 'deleted' ? 'opacity-50 border-2 border-red-500/30' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-white font-semibold text-lg">{user.email}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'deleted' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#8E8E93] text-sm mb-1">Wallet ID: {user.wallet_id}</p>
                  <p className="text-[#8E8E93] text-sm mb-1">Address: {user.wallet_address}</p>
                  <p className="text-white text-sm">Balance: ${Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                
                {user.status === 'deleted' && (
                  <div className="ml-4">
                    {selectedUser === user.wallet_id ? (
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Admin password"
                          className="px-3 py-2 bg-[#2C2C2E] text-white rounded-lg text-sm"
                        />
                        <button
                          onClick={() => handleDeleteUser(user.wallet_id)}
                          className="px-4 py-2 bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 text-sm font-semibold"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(null);
                            setDeletePassword("");
                          }}
                          className="px-4 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3C3C3E] text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(user.wallet_id)}
                        className="px-4 py-2 bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 text-sm font-semibold"
                      >
                        🗑️ Permanently Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
