"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  X,
  UserCheck,
  Clock,
  Edit2,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface AdminUserItem {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<AdminUserItem | null>(null);
  const [editModalUser, setEditModalUser] = useState<AdminUserItem | null>(null);

  // Create form
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password reset form
  const [newPassword, setNewPassword] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Edit user form
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("admin");
  const [editSubmitting, setEditSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [authRes, usersRes] = await Promise.all([
        fetch("/api/admin/auth"),
        fetch("/api/admin/users"),
      ]);

      if (authRes.ok) {
        const authData = await authRes.json();
        setCurrentUserId(authData.user?.userId || null);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } else {
        const err = await usersRes.json();
        showToast(err.error || "Foydalanuvchilarni yuklab bo'lmadi", "error");
      }
    } catch {
      showToast("Tizim bilan aloqada xatolik", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!username.trim() || !name.trim() || !password) {
      showToast("Barcha maydonlarni to'ldiring", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Parol kamida 6 ta belgidan iborat bo'lsin", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, role, password }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Yangi administrator muvaffaqiyatli qo'shildi", "success");
        setCreateModalOpen(false);
        setUsername("");
        setName("");
        setPassword("");
        setRole("admin");
        loadData();
      } else {
        showToast(data.error || "Qo'shishda xatolik", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (resetSubmitting || !passwordModalUser) return;

    if (newPassword.length < 6) {
      showToast("Yangi parol kamida 6 ta belgidan iborat bo'lsin", "error");
      return;
    }

    setResetSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: passwordModalUser.id,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`${passwordModalUser.username} paroli muvaffaqiyatli yangilandi`, "success");
        setPasswordModalUser(null);
        setNewPassword("");
      } else {
        showToast(data.error || "Parolni o'zgartirishda xatolik", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    } finally {
      setResetSubmitting(false);
    }
  }

  async function handleEditUser(e: FormEvent) {
    e.preventDefault();
    if (editSubmitting || !editModalUser) return;

    setEditSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModalUser.id,
          name: editName,
          role: editRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Foydalanuvchi ma'lumotlari yangilandi", "success");
        setEditModalUser(null);
        loadData();
      } else {
        showToast(data.error || "Yangilashda xatolik", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDelete(user: AdminUserItem) {
    if (user.id === currentUserId) {
      showToast("O'z hisobingizni o'chira olmaysiz", "error");
      return;
    }

    const confirmed = confirm(
      `Haqiqatan ham "${user.name}" (@${user.username}) hisobini o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Foydalanuvchi o'chirildi", "success");
        loadData();
      } else {
        showToast(data.error || "O'chirishda xatolik", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    }
  }

  function openEdit(user: AdminUserItem) {
    setEditModalUser(user);
    setEditName(user.name);
    setEditRole(user.role);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/20">
        <div>
          <div className="flex items-center gap-2.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="size-4" />
            <span>Foydalanuvchilar va Xavfsizlik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administratorlar Boshqaruvi
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Tizimga kirish huquqlariga ega bo&apos;lgan barcha xodimlarni boshqaring. Super Admin to&apos;liq boshqaruvga, oddiy Admin (menejer) esa faqat So&apos;rovlar (Leads) bo&apos;limiga kirish huquqiga ega.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="size-4" />
          <span>Yangi Admin Qo&apos;shish</span>
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#0a1630] to-[#070e1c] border border-blue-800/30">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Shield className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Super Admin</h4>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Cheksiz huquq
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                CMS modullari (Xizmatlar, Tariflar, Hamkorlar, Portfolio, Jamoa, Sozlamalar), barcha so&apos;rovlar va boshqa administratorlarni qo&apos;shish/tahrirlash huquqi.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#0a1630] to-[#070e1c] border border-blue-800/30">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
              <UserCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Admin (Menejer)</h4>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Cheklangan huquq
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Faqat kelib tushgan so&apos;rovlar (Leads) bo&apos;limini ko&apos;rish, statuslarini o&apos;zgartirish va eslatma qo&apos;shish huquqi. Sayt sozlamalariga kirish bloklangan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-[#0a1326]/70 border border-blue-900/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="px-6 py-4 border-b border-blue-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="size-4.5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Ro&apos;yxatdan o&apos;tgan administratorlar</h3>
          </div>
          <span className="text-xs font-semibold text-blue-300/80 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-lg">
            Jami: {users.length} ta
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Yuklanmoqda...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Hech qanday foydalanuvchi topilmadi
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {users.map((u) => {
              const isCurrentUser = u.id === currentUserId;
              const isSuper = u.role === "super_admin";

              return (
                <div
                  key={u.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-950/20 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`size-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0 border ${
                        isSuper
                          ? "bg-gradient-to-br from-purple-600/30 to-blue-600/20 border-purple-500/40 text-purple-200"
                          : "bg-blue-600/20 border-blue-500/30 text-sky-200"
                      }`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-base">{u.name}</span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
                          @{u.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Siz
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                            isSuper
                              ? "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                              : "bg-sky-950/60 text-sky-300 border border-sky-800/40"
                          }`}
                        >
                          {isSuper ? (
                            <>
                              <Shield className="size-3 text-purple-400" />
                              Super Admin
                            </>
                          ) : (
                            <>
                              <UserCheck className="size-3 text-sky-400" />
                              Admin (Menejer)
                            </>
                          )}
                        </span>

                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="size-3" />
                          {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-blue-900/30 border border-transparent hover:border-blue-700/40 transition-all text-xs font-medium inline-flex items-center gap-1.5"
                      title="Tahrirlash"
                    >
                      <Edit2 className="size-3.5" />
                      <span className="hidden lg:inline">Tahrirlash</span>
                    </button>

                    <button
                      onClick={() => setPasswordModalUser(u)}
                      className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all text-xs font-medium inline-flex items-center gap-1.5"
                      title="Parolni tiklash"
                    >
                      <KeyRound className="size-3.5" />
                      <span className="hidden lg:inline">Parol</span>
                    </button>

                    {!isCurrentUser && (
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all text-xs font-medium inline-flex items-center gap-1.5"
                        title="O'chirish"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="hidden lg:inline">O&apos;chirish</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-blue-900/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sky-400 flex items-center justify-center">
                  <UserPlus className="size-4.5" />
                </div>
                <h3 className="font-bold text-white text-lg">Yangi Admin Qo&apos;shish</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-blue-900/30"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ism va Familiya / Lavozim *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Aliyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Login (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: sardor_manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Faqat lotin harflari va raqamlar
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tizimdagi Roli *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      role === "admin"
                        ? "bg-blue-950/60 border-blue-500 text-white shadow-lg shadow-blue-950/40"
                        : "bg-[#070e1c] border-blue-900/40 text-slate-400 hover:border-blue-700/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-sky-400 flex items-center justify-between">
                      <span>Admin (Menejer)</span>
                      {role === "admin" && <CheckCircle2 className="size-4 text-sky-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Faqat So&apos;rovlar (Leads)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("super_admin")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      role === "super_admin"
                        ? "bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-950/40"
                        : "bg-[#070e1c] border-blue-900/40 text-slate-400 hover:border-purple-700/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-purple-400 flex items-center justify-between">
                      <span>Super Admin</span>
                      {role === "super_admin" && <CheckCircle2 className="size-4 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">To&apos;liq boshqaruv</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Boshlang&apos;ich Parol *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 ta belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium hover:bg-blue-950/40 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {submitting ? "Qo'shilmoqda..." : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-blue-900/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <KeyRound className="size-4.5" />
                </div>
                <h3 className="font-bold text-white text-lg">Parolni O&apos;zgartirish</h3>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-blue-900/30"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-xs text-slate-300">
                Foydalanuvchi: <strong className="text-white">{passwordModalUser.name}</strong> (@{passwordModalUser.username})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Yangi Parol *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 ta belgi"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium hover:bg-blue-950/40 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  {resetSubmitting ? "Saqlanmoqda..." : "Parolni Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-blue-900/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sky-400 flex items-center justify-center">
                  <Edit2 className="size-4.5" />
                </div>
                <h3 className="font-bold text-white text-lg">Ma&apos;lumotlarni Tahrirlash</h3>
              </div>
              <button
                onClick={() => setEditModalUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-blue-900/30"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ism va Familiya / Lavozim *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tizimdagi Roli *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditRole("admin")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      editRole === "admin"
                        ? "bg-blue-950/60 border-blue-500 text-white shadow-lg shadow-blue-950/40"
                        : "bg-[#070e1c] border-blue-900/40 text-slate-400 hover:border-blue-700/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-sky-400 flex items-center justify-between">
                      <span>Admin (Menejer)</span>
                      {editRole === "admin" && <CheckCircle2 className="size-4 text-sky-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Faqat Leads</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRole("super_admin")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      editRole === "super_admin"
                        ? "bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-950/40"
                        : "bg-[#070e1c] border-blue-900/40 text-slate-400 hover:border-purple-700/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-purple-400 flex items-center justify-between">
                      <span>Super Admin</span>
                      {editRole === "super_admin" && <CheckCircle2 className="size-4 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">To&apos;liq boshqaruv</p>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium hover:bg-blue-950/40 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {editSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
