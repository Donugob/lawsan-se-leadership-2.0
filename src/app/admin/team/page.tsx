"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, Shield, ShieldAlert, Loader2, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    role: "ADMIN"
  });

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const res = await fetch("/api/admin/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setShowInviteModal(false);
        setInviteData({ email: "", name: "", role: "ADMIN" });
      } else {
        toast.error(data.error || "Failed to send invitation");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-900">Team Management</h1>
          <p className="text-sm text-forest-500">Manage administrative access and roles</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-forest-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-forest-800 transition-all shadow-xl shadow-forest-900/10 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Invite Admin
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-forest-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-forest-50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input 
              type="text"
              placeholder="Search team members..."
              className="w-full bg-forest-50/50 border border-forest-50 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/5 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-forest-50/30">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-forest-400">Admin</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-forest-400">Role</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-forest-400">Date Added</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-forest-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-forest-400 text-sm italic">
                    No other admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-forest-50/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-900 font-bold">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-forest-900">{admin.name}</p>
                          <p className="text-xs text-forest-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        admin.role === "SUPER_ADMIN" 
                          ? "bg-gold-50 text-gold-700 ring-1 ring-gold-500/20" 
                          : "bg-forest-50 text-forest-700 ring-1 ring-forest-500/20"
                      }`}>
                        {admin.role === "SUPER_ADMIN" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {admin.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-forest-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      {admin.role !== "SUPER_ADMIN" && (
                        <button className="p-2 text-forest-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-forest-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-heading font-bold text-forest-900 mb-2">Invite New Admin</h2>
            <p className="text-sm text-forest-500 mb-8">Send a secure setup link to a team member.</p>

            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-forest-400 ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-forest-50/50 border border-forest-50 rounded-2xl py-4 px-5 text-forest-900 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-forest-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input 
                    type="email"
                    required
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    placeholder="colleague@lawsanse.org"
                    className="w-full bg-forest-50/50 border border-forest-50 rounded-2xl py-4 pl-12 pr-5 text-forest-900 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-forest-400 hover:bg-forest-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 bg-forest-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-forest-800 transition-all shadow-xl shadow-forest-900/10 active:scale-95 disabled:opacity-50"
                >
                  {inviteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
