import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

async function adminFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(path, {
        ...options,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any).error || `Erreur ${res.status}`);
    return data;
}

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [tab, setTab]     = useState<"stats" | "users">("stats");
    const [page, setPage]   = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (isLoading) return;
        if (!user) { navigate("/login"); return; }
        if ((user as any).role !== "admin") { navigate("/"); return; }
        loadStats();
        loadUsers(1);
    }, [user, isLoading]);

    const loadStats = async () => {
        try { setStats(await adminFetch("/api/admin/stats")); } catch (e: any) { toast(e.message, "error"); }
    };

    const loadUsers = async (p: number) => {
        try {
            const data: any = await adminFetch(`/api/admin/users?page=${p}&limit=15`);
            setUsers(data.users); setTotal(data.total); setPage(p);
        } catch (e: any) { toast(e.message, "error"); }
    };

    const toggleRole = async (u: any) => {
        const newRole = u.role === "admin" ? "user" : "admin";
        try {
            await adminFetch(`/api/admin/users/${u._id}/role`, { method: "PATCH", body: JSON.stringify({ role: newRole }) });
            toast(`${u.username} → ${newRole}`);
            loadUsers(page);
        } catch (e: any) { toast(e.message, "error"); }
    };

    const deleteUser = async (u: any) => {
        if (!confirm(`Supprimer ${u.username} et toutes ses données ?`)) return;
        try {
            await adminFetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
            toast(`${u.username} supprimé`);
            loadUsers(page);
            loadStats();
        } catch (e: any) { toast(e.message, "error"); }
    };

    if (!user || (user as any).role !== "admin") return null;

    const totalPages = Math.ceil(total / 15);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            <div className="page-content large-container">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "var(--gold)" }}>
                        ⚙ Back-office
                    </h1>
                    <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 20, padding: "0.2rem 0.75rem", fontSize: "0.75rem" }}>
                        ADMIN
                    </span>
                </div>

                {/* Onglets */}
                <div style={s.tabs}>
                    {(["stats", "users"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
                            {t === "stats" ? "📊 Statistiques" : "👥 Utilisateurs"}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                {tab === "stats" && stats && (
                    <div>
                        <div style={s.statsGrid}>
                            {[
                                { label: "Utilisateurs", value: stats.totalUsers, icon: "👥" },
                                { label: "Watchlists", value: stats.totalWatchlist, icon: "📋" },
                                { label: "Notes", value: stats.totalRatings, icon: "⭐" },
                                { label: "Consultations", value: stats.totalHistory, icon: "👁️" },
                            ].map(st => (
                                <div key={st.label} style={s.statCard}>
                                    <span style={{ fontSize: "2rem" }}>{st.icon}</span>
                                    <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>{st.value}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{st.label}</span>
                                </div>
                            ))}
                        </div>

                        <h2 style={s.sectionTitle}>Inscriptions récentes</h2>
                        <div style={s.table}>
                            <div style={s.tableHead}>
                                <span>Utilisateur</span><span>Email</span><span>Rôle</span><span>Inscrit le</span>
                            </div>
                            {stats.recentUsers?.map((u: any) => (
                                <div key={u._id} style={s.tableRow}>
                                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{u.username}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email}</span>
                                    <span style={{ color: u.role === "admin" ? "var(--gold)" : "var(--text-muted)", fontSize: "0.8rem" }}>{u.role}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users */}
                {tab === "users" && (
                    <div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                            {total} utilisateurs — page {page}/{totalPages}
                        </p>
                        <div style={s.table}>
                            <div style={{ ...s.tableHead, gridTemplateColumns: "1fr 1fr 80px 100px 110px" }}>
                                <span>Utilisateur</span><span>Email</span><span>Rôle</span><span>Inscrit le</span><span>Actions</span>
                            </div>
                            {users.map(u => (
                                <div key={u._id} style={{ ...s.tableRow, gridTemplateColumns: "1fr 1fr 80px 100px 110px" }}>
                                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{u.username}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
                                    <span style={{ color: u.role === "admin" ? "var(--gold)" : "var(--text-muted)", fontSize: "0.8rem" }}>{u.role}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        <button onClick={() => toggleRole(u)} style={s.actionBtn} title={u.role === "admin" ? "Rétrograder" : "Promouvoir admin"}>
                                            {u.role === "admin" ? "👤" : "⭐"}
                                        </button>
                                        <button onClick={() => deleteUser(u)} style={{ ...s.actionBtn, borderColor: "var(--red)", color: "#e74c3c" }} title="Supprimer">
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div style={s.pagination}>
                                <button onClick={() => loadUsers(page - 1)} disabled={page <= 1} style={s.pageBtn}>← Préc.</button>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{page}/{totalPages}</span>
                                <button onClick={() => loadUsers(page + 1)} disabled={page >= totalPages} style={s.pageBtn}>Suiv. →</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    tabs: { display: "flex", marginBottom: "2rem", borderBottom: "1px solid var(--border)" },
    tab: { background: "none", color: "var(--text-muted)", padding: "0.8rem 1.5rem", fontSize: "0.875rem", borderBottom: "2px solid transparent", marginBottom: -1, cursor: "pointer" },
    tabActive: { color: "var(--gold)", borderBottomColor: "var(--gold)" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" },
    statCard: { background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" },
    sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "var(--gold)", marginBottom: "1rem" },
    table: { border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" },
    tableHead: { display: "grid", gridTemplateColumns: "1fr 1fr 80px 100px", background: "rgba(255,255,255,0.04)", padding: "0.75rem 1rem", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", gap: "1rem" },
    tableRow: { display: "grid", gridTemplateColumns: "1fr 1fr 80px 100px", padding: "0.8rem 1rem", borderTop: "1px solid var(--border)", gap: "1rem", alignItems: "center" },
    actionBtn: { background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", width: 30, height: 30, borderRadius: 4, cursor: "pointer", fontSize: "0.9rem" },
    pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" },
    pageBtn: { background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", color: "var(--gold)", padding: "0.5rem 1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem" },
};
