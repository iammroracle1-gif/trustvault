"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store admin session
        localStorage.setItem('admin_session', data.token);
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1018] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4938F5] to-[#7D7AFF] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-white text-[28px] font-bold tracking-tight">Trust Vault Admin</h1>
          <p className="text-[#8E8E93] text-[15px] mt-2">Sign in to access control panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[#8E8E93] text-[13px] font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[15px] placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#8E8E93] text-[13px] font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-[#0F1018] border border-white/10 rounded-xl text-white text-[15px] placeholder-[#8E8E93] focus:outline-none focus:border-[#4938F5] transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#8E8E93]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#8E8E93]" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-[#FF453A] flex-shrink-0" />
                <p className="text-[#FF453A] text-[13px]">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4938F5] text-white text-[15px] font-semibold rounded-xl hover:bg-[#5D4EFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back to App */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-[#4938F5] text-[13px] font-medium hover:underline"
          >
            Back to Trust Vault App
          </button>
        </div>
      </div>
    </div>
  );
}
