"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Search,
  RefreshCw,
  Edit,
  Ban,
  CheckCircle,
  LayoutDashboard,
  Settings,
  Activity,
  FileText,
  Mail,
  Shield,
  BarChart3,
  Menu,
  X,
  PlusCircle,
  LogOut,
  Trash2
} from "lucide-react";

interface User {
  walletId: string;
  email: string;
  balance: number;
  withdrawalRestricted: boolean;
  restrictionReason: string;
  createdAt: string;
  lastActivity: string;
  totalTransactions: number;
  status: 'active' | 'restricted' | 'suspended';
}

type View = 'dashboard' | 'users' | 'transactions' | 'reports' | 'settings';

export default function AdminPanel() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    restrictedUsers: 0,
    totalBalance: 0,
  });

  // Check auth on mount
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.walletId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        
        // Calculate stats
        const totalBalance = data.reduce((sum: number, user: User) => sum + user.balance, 0);
        const activeUsers = data.filter((u: User) => u.status === 'active').length;
        const restrictedUsers = data.filter((u: User) => u.withdrawalRestricted).length;
        
        setStats({
          totalUsers: data.length,
          activeUsers,
          restrictedUsers,
          totalBalance,
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        await loadUsers();
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (walletId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?walletId=${walletId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadUsers();
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleDeposit = async (walletId: string, amount: number, note: string) => {
    try {
      const response = await fetch('/api/admin/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId, amount, note }),
      });

      if (response.ok) {
        await loadUsers();
        setShowDepositModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error depositing funds:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users' as View, icon: Users, label: 'User Management' },
    { id: 'transactions' as View, icon: Activity, label: 'Transactions' },
    { id: 'reports' as View, icon: BarChart3, label: 'Reports & Analytics' },
    { id: 'settings' as View, icon: Settings, label: 'Admin Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#0F1018] overflow-hidden">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'w-64 lg:w-20'}
        bg-[#1C1C1E] border-r border-white/10 transition-all duration-300 flex flex-col
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className={sidebarOpen ? '' : 'lg:hidden'}>
            <h1 className="text-white text-[18px] font-bold">Trust Vault Admin</h1>
            <p className="text-[#8E8E93] text-[11px]">Control Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-[#8E8E93]" /> : <Menu className="w-5 h-5 text-[#8E8E93]" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false); // Close on mobile after selecting
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#4938F5] text-white'
                    : 'text-[#8E8E93] hover:bg-white/5 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                <span className={`text-[15px] font-medium ${sidebarOpen ? '' : 'lg:hidden'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Admin Info */}
        <div className={`p-4 border-t border-white/10 ${sidebarOpen ? '' : 'lg:hidden'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#4938F5] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-[13px] font-medium">Admin User</p>
              <p className="text-[#8E8E93] text-[11px]">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#FF453A]/20 hover:bg-[#FF453A]/30 text-[#FF453A] text-[13px] font-medium rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-[#1C1C1E] border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-white text-[18px] lg:text-[20px] font-semibold">
                {menuItems.find(m => m.id === currentView)?.label}
              </h2>
              <p className="text-[#8E8E93] text-[11px] lg:text-[13px]">
                {currentView === 'dashboard' && `${stats.totalUsers} total users`}
                {currentView === 'users' && `Manage ${stats.totalUsers} users`}
                {currentView === 'transactions' && 'View all transactions'}
                {currentView === 'reports' && 'Analytics and insights'}
                {currentView === 'settings' && 'Configure admin settings'}
              </p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#4938F5] text-white text-[12px] lg:text-[13px] font-medium rounded-xl hover:bg-[#5D4EFF] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {currentView === 'dashboard' && (
            <DashboardView stats={stats} users={users} />
          )}
          
          {currentView === 'users' && (
            <UsersView
              users={filteredUsers}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onManageUser={(user: User, action: string) => {
                setSelectedUser(user);
                if (action === 'deposit') {
                  setShowDepositModal(true);
                } else {
                  setShowEditModal(true);
                }
              }}
              onDeleteUser={handleDeleteUser}
            />
          )}
          
          {currentView === 'transactions' && (
            <TransactionsView />
          )}
          
          {currentView === 'reports' && (
            <ReportsView stats={stats} />
          )}
          
          {currentView === 'settings' && (
            <SettingsView />
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedUser && (
        <DepositModal
          user={selectedUser}
          onClose={() => {
            setShowDepositModal(false);
            setSelectedUser(null);
          }}
          onDeposit={handleDeposit}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({ stats, users }: { stats: any; users: User[] }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="#4938F5"
        />
        <StatCard
          icon={CheckCircle}
          label="Active Users"
          value={stats.activeUsers}
          color="#34C759"
        />
        <StatCard
          icon={AlertTriangle}
          label="Restricted"
          value={stats.restrictedUsers}
          color="#FF9500"
        />
        <StatCard
          icon={DollarSign}
          label="Total Balance"
          value={`$${stats.totalBalance.toLocaleString()}`}
          color="#5AC8FA"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
        <h3 className="text-white text-[17px] font-semibold mb-4">Recent Users</h3>
        <div className="space-y-3">
          {users.slice(0, 5).map((user) => (
            <div key={user.walletId} className="flex items-center justify-between p-3 bg-[#0F1018] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4938F5]/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#4938F5]" />
                </div>
                <div>
                  <p className="text-white text-[15px] font-medium">{user.email}</p>
                  <p className="text-[#8E8E93] text-[13px]">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[13px] font-medium ${
                user.status === 'active' ? 'bg-[#34C759]/20 text-[#34C759]' : 'bg-[#FF9500]/20 text-[#FF9500]'
              }`}>
                {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Users View Component
function UsersView({ users, loading, searchQuery, setSearchQuery, onManageUser, onDeleteUser }: any) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
        <input
          type="text"
          placeholder="Search by email or wallet ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-[#1C1C1E] border border-white/10 rounded-xl text-white text-[15px] placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
        />
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">User</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">Balance</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">Transactions</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">Last Activity</th>
                <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8E8E93]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8E8E93]">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user: User) => (
                  <tr key={user.walletId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-[15px] font-medium">{user.email}</p>
                        <p className="text-[#8E8E93] text-[13px] font-mono">{user.walletId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-[15px] font-semibold">
                        ${user.balance.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-[15px]">{user.totalTransactions}</p>
                    </td>
                    <td className="px-6 py-4">
                      {user.withdrawalRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FF9500]/20 border border-[#FF9500]/30 text-[#FF9500] text-[13px] font-medium rounded-lg">
                          <Ban className="w-3.5 h-3.5" />
                          Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#34C759]/20 border border-[#34C759]/30 text-[#34C759] text-[13px] font-medium rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#8E8E93] text-[13px]">
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onManageUser(user, 'deposit')}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#34C759] text-white text-[13px] font-medium rounded-lg hover:bg-[#30B350] transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Fund
                        </button>
                        <button
                          onClick={() => onManageUser(user, 'edit')}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4938F5] text-white text-[13px] font-medium rounded-lg hover:bg-[#5D4EFF] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Manage
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.walletId)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF453A] text-white text-[13px] font-medium rounded-lg hover:bg-[#FF3B30] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 text-center text-[#8E8E93]">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6 text-center text-[#8E8E93]">
            No users found
          </div>
        ) : (
          users.map((user: User) => (
            <div key={user.walletId} className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-white text-[15px] font-medium mb-1">{user.email}</p>
                  <p className="text-[#8E8E93] text-[11px] font-mono">{user.walletId}</p>
                </div>
                {user.withdrawalRestricted ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF9500]/20 border border-[#FF9500]/30 text-[#FF9500] text-[11px] font-medium rounded-lg">
                    <Ban className="w-3 h-3" />
                    Restricted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#34C759]/20 border border-[#34C759]/30 text-[#34C759] text-[11px] font-medium rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[#8E8E93] text-[11px] mb-1">Balance</p>
                  <p className="text-white text-[15px] font-semibold">${user.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#8E8E93] text-[11px] mb-1">Transactions</p>
                  <p className="text-white text-[15px]">{user.totalTransactions}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onManageUser(user, 'deposit')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#34C759] text-white text-[12px] font-medium rounded-lg hover:bg-[#30B350] transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Fund
                </button>
                <button
                  onClick={() => onManageUser(user, 'edit')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4938F5] text-white text-[12px] font-medium rounded-lg hover:bg-[#5D4EFF] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteUser(user.walletId)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF453A] text-white text-[12px] font-medium rounded-lg hover:bg-[#FF3B30] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Transactions View Component
function TransactionsView() {
  return (
    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
      <h3 className="text-white text-[17px] font-semibold mb-4">Transaction History</h3>
      <p className="text-[#8E8E93] text-[15px]">
        Transaction monitoring coming soon. This will display all deposits, withdrawals, and trades.
      </p>
    </div>
  );
}

// Reports View Component
function ReportsView({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-[17px] font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-[#8E8E93]">
            Chart visualization coming soon
          </div>
        </div>
        <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-[17px] font-semibold mb-4">Balance Distribution</h3>
          <div className="h-64 flex items-center justify-center text-[#8E8E93]">
            Chart visualization coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
        <h3 className="text-white text-[17px] font-semibold mb-4">Admin Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[#8E8E93] text-[13px] font-medium mb-2">Email Notifications</label>
            <p className="text-white text-[15px]">Configure email settings for transaction notifications</p>
          </div>
          <div>
            <label className="block text-[#8E8E93] text-[13px] font-medium mb-2">Security Settings</label>
            <p className="text-white text-[15px]">Manage admin authentication and 2FA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <p className="text-[#8E8E93] text-[13px] font-medium uppercase tracking-wide">{label}</p>
      <p className="text-white text-[28px] font-bold mt-1">{value}</p>
    </div>
  );
}

// Edit User Modal Component (keep existing)
function EditUserModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (user: User) => void }) {
  const [editedUser, setEditedUser] = useState<User>(user);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-[22px] font-bold text-white">Manage User</h2>
          <p className="text-[15px] text-[#8E8E93] mt-1">{user.email}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Balance */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
              Balance (USD)
            </label>
            <input
              type="number"
              value={editedUser.balance}
              onChange={(e) => setEditedUser({ ...editedUser, balance: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[17px] focus:outline-none focus:border-[#4938F5] transition-colors"
            />
          </div>

          {/* Withdrawal Restriction */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-white text-[15px] font-medium">Restrict Withdrawals</p>
                <p className="text-[#8E8E93] text-[13px] mt-0.5">Prevent user from withdrawing funds</p>
              </div>
              <div
                className={`w-[51px] h-[31px] rounded-full transition-colors ${
                  editedUser.withdrawalRestricted ? 'bg-[#FF453A]' : 'bg-[#48484A]'
                }`}
                onClick={() => setEditedUser({ ...editedUser, withdrawalRestricted: !editedUser.withdrawalRestricted })}
              >
                <div
                  className={`w-[27px] h-[27px] bg-white rounded-full shadow-lg transition-transform duration-200 mt-[2px] ${
                    editedUser.withdrawalRestricted ? 'ml-[22px]' : 'ml-[2px]'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Restriction Reason */}
          {editedUser.withdrawalRestricted && (
            <div>
              <label className="block text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
                Restriction Reason
              </label>
              <textarea
                value={editedUser.restrictionReason}
                onChange={(e) => setEditedUser({ ...editedUser, restrictionReason: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[15px] resize-none focus:outline-none focus:border-[#4938F5] transition-colors"
                placeholder="Enter reason for restriction..."
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
              Account Status
            </label>
            <select
              value={editedUser.status}
              onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value as User['status'] })}
              className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[15px] focus:outline-none focus:border-[#4938F5] transition-colors"
            >
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#0F1018] text-white text-[15px] font-medium rounded-xl hover:bg-[#2C2C2E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedUser)}
            className="flex-1 px-4 py-3 bg-[#4938F5] text-white text-[15px] font-medium rounded-xl hover:bg-[#5D4EFF] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Deposit Modal Component
function DepositModal({ 
  user, 
  onClose, 
  onDeposit 
}: { 
  user: User; 
  onClose: () => void; 
  onDeposit: (walletId: string, amount: number, note: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    await onDeposit(user.walletId, parseFloat(amount), note);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-[22px] font-bold text-white">Fund User Balance</h2>
          <p className="text-[15px] text-[#8E8E93] mt-1">{user.email}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="p-4 bg-[#0F1018] border border-white/10 rounded-xl">
            <p className="text-[#8E8E93] text-[13px] mb-1">Current Balance</p>
            <p className="text-white text-[28px] font-bold">${user.balance.toLocaleString()}</p>
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
              Deposit Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[20px] font-semibold focus:outline-none focus:border-[#34C759] transition-colors"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-3 py-2 bg-[#0F1018] border border-white/10 text-white text-[13px] font-medium rounded-lg hover:border-[#34C759] transition-colors"
              >
                ${quickAmount}
              </button>
            ))}
          </div>

          {/* Note */}
          <div>
            <label className="block text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Welcome bonus, Refund, etc."
              className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[15px] placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
            />
          </div>

          {/* Preview New Balance */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-[#34C759]/10 border border-[#34C759]/30 rounded-xl">
              <p className="text-[#8E8E93] text-[13px] mb-1">New Balance After Deposit</p>
              <p className="text-[#34C759] text-[24px] font-bold">
                ${(user.balance + parseFloat(amount)).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#0F1018] text-white text-[15px] font-medium rounded-xl hover:bg-[#2C2C2E] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-3 bg-[#34C759] text-white text-[15px] font-semibold rounded-xl hover:bg-[#30B350] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Deposit Funds'}
          </button>
        </div>
      </div>
    </div>
  );
}
