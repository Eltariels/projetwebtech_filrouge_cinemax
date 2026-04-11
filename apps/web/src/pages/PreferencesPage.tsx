import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useResponsive } from "../hooks/useResponsive";

const STEPS = [
    {
        id: "decades", title: "Quelle époque te fait vibrer ?", subtitle: "Choisis une ou plusieurs décennies", multi: true,
        options: [
            { value: "50s-60s", label: "50s – 60s", icon: "🎞️" }, { value: "70s", label: "70s", icon: "🕺" },
            { value: "80s",     label: "80s",        icon: "📼" }, { value: "90s", label: "90s", icon: "💿" },
            { value: "2000s",   label: "2000s",      icon: "📀" }, { value: "2010s", label: "2010s", icon: "📱" },
            { value: "2020s",   label: "2020s",      icon: "🚀" },
        ],
    },
    {
        id: "ambiance", title: "Quelle ambiance recherches-tu ?", subtitle: "Plusieurs choix possibles", multi: true,
        options: [
            { value: "feel-good", label: "Feel-good",       icon: "☀️" }, { value: "dark",      label: "Sombre & intense", icon: "🌑" },
            { value: "epic",      label: "Épique",           icon: "⚔️" }, { value: "intimate",  label: "Intimiste",        icon: "🕯️" },
            { value: "comedy",    label: "Comédie",          icon: "😂" }, { value: "thrilling", label: "Frissons",          icon: "😱" },
            { value: "romantic",  label: "Romantique",       icon: "❤️" },
        ],
    },
    {
        id: "rhythm", title: "Ton rythme idéal ?", subtitle: "Un seul choix", multi: false,
        options: [
            { value: "slow",     label: "Lent & contemplatif", icon: "🌊", desc: "Tu savoures chaque plan" },
            { value: "balanced", label: "Équilibré",            icon: "⚖️", desc: "Un peu des deux" },
            { value: "fast",     label: "Action non-stop",      icon: "⚡", desc: "Tu veux du rythme" },
        ],
    },
    {
        id: "origins", title: "Tes cinémas préférés ?", subtitle: "Plusieurs choix possibles", multi: true,
        options: [
            { value: "hollywood", label: "Hollywood",        icon: "🎬" }, { value: "french",   label: "Cinéma français", icon: "🥖" },
            { value: "european",  label: "Européen",         icon: "🏰" }, { value: "asian",    label: "Asiatique",       icon: "🏯" },
            { value: "latin",     label: "Amérique latine",  icon: "🌴" }, { value: "world",    label: "Monde entier",    icon: "🌍" },
        ],
    },
    {
        id: "genres", title: "Tes genres incontournables ?", subtitle: "Sélectionne au moins deux genres", multi: true,
        options: [
            { value: 28,    label: "Action",       icon: "💥" }, { value: 12,    label: "Aventure",    icon: "🗺️" },
            { value: 16,    label: "Animation",    icon: "✨" }, { value: 35,    label: "Comédie",     icon: "🎭" },
            { value: 80,    label: "Crime",        icon: "🔫" }, { value: 99,    label: "Documentaire",icon: "🎥" },
            { value: 18,    label: "Drame",        icon: "🎪" }, { value: 10751, label: "Famille",     icon: "👨‍👩‍👧" },
            { value: 14,    label: "Fantastique",  icon: "🧙" }, { value: 36,    label: "Histoire",    icon: "📜" },
            { value: 27,    label: "Horreur",      icon: "👻" }, { value: 10749, label: "Romance",     icon: "💑" },
            { value: 878,   label: "Sci-Fi",       icon: "🛸" }, { value: 53,    label: "Thriller",    icon: "🔪" },
            { value: 10752, label: "Guerre",       icon: "🪖" },
        ],
    },
];

export default function PreferencesPage() {
    const navigate = useNavigate();
    const { isMobile, isTablet } = useResponsive();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({ decades: [], ambiance: [], rhythm: "", origins: [], genres: [] });
    const [saving, setSaving] = useState(false);

    const current  = STEPS[step];
    const progress = (step / STEPS.length) * 100;

    const toggle = (value: any) => {
        const key = current.id;
        if (!current.multi) { setAnswers(a => ({ ...a, [key]: value })); return; }
        setAnswers(a => {
            const arr: any[] = a[key] || [];
            return { ...a, [key]: arr.includes(value) ? arr.filter((v: any) => v !== value) : [...arr, value] };
        });
    };

    const isSelected = (value: any) => {
        const val = answers[current.id];
        return current.multi ? (val || []).includes(value) : val === value;
    };

    const canNext = () => {
        const val = answers[current.id];
        return current.multi ? (val || []).length > 0 : !!val;
    };

    const next = () => { if (step < STEPS.length - 1) { setStep(s => s + 1); return; } finish(); };
    const finish = async () => {
        setSaving(true);
        try { await api.savePreferences(answers); } catch {}
        navigate("/profile");
    };
    const skip = () => navigate("/");

    // Colonnes de la grille selon écran et étape
    const isRhythmStep = current.id === "rhythm";
    const cols = isRhythmStep ? 1
        : isMobile ? 2
        : isTablet ? 3
        : 4;

    return (
        <div style={s.page}>
            <div style={s.bg} />

            {/* Header */}
            <div style={{ ...s.header, padding: isMobile ? "1rem" : "1.5rem 2rem" }}>
                <span style={{ ...s.logo, fontSize: isMobile ? "1.1rem" : "1.5rem" }}>CINEMAX</span>
                <button onClick={skip} style={s.skipBtn}>Passer →</button>
            </div>

            {/* Progress */}
            <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>

            {/* Card */}
            <div style={{ ...s.card, padding: isMobile ? "1.5rem 1rem" : "3rem 2rem", maxWidth: isMobile ? "100%" : 760 }}>
                <p style={s.stepCount}>{step + 1} / {STEPS.length}</p>
                <h1 style={{ ...s.title, fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.8rem)" : "clamp(1.75rem, 3vw, 2.5rem)" }}>
                    {current.title}
                </h1>
                <p style={s.subtitle}>{current.subtitle}</p>

                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? "0.5rem" : "0.75rem", marginBottom: "2rem" }}>
                    {current.options.map((opt) => (
                        <button
                            key={String(opt.value)}
                            onClick={() => toggle(opt.value)}
                            style={{ ...s.optBtn, ...(isSelected(opt.value) ? s.optBtnActive : {}), padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.25rem" }}
                        >
                            <span style={{ ...s.optIcon, fontSize: isMobile ? "1.25rem" : "1.5rem" }}>{opt.icon}</span>
                            <span style={{ ...s.optLabel, fontSize: isMobile ? "0.8rem" : "0.9rem" }}>{opt.label}</span>
                            {"desc" in opt && !isMobile && <span style={s.optDesc}>{(opt as any).desc}</span>}
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    {step > 0 && <button onClick={() => setStep(s => s - 1)} style={s.backBtn}>← Retour</button>}
                    <button onClick={next} disabled={!canNext() || saving} style={{ ...s.nextBtn, opacity: canNext() ? 1 : 0.4, padding: isMobile ? "0.75rem 1.5rem" : "0.875rem 2.5rem" }}>
                        {saving ? "Sauvegarde..." : step === STEPS.length - 1 ? "Terminer ✓" : "Suivant →"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflowX: "hidden" },
    bg: { position: "fixed", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 60%, #0a0a0a 100%)", zIndex: -1 },
    header: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: { fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)", letterSpacing: "0.3em", fontWeight: 300 },
    skipBtn: { background: "none", color: "var(--text-muted)", fontSize: "0.85rem", padding: "0.4rem 0.75rem", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer" },
    progressBar: { width: "100%", height: 2, background: "var(--border)" },
    progressFill: { height: "100%", background: "linear-gradient(90deg, var(--gold-dark), var(--gold))", transition: "width 0.4s ease" },
    card: { width: "100%", paddingTop: "2rem" },
    stepCount: { color: "var(--gold)", fontSize: "0.72rem", letterSpacing: "0.3em", marginBottom: "0.5rem", textTransform: "uppercase" },
    title: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: "0.4rem", color: "var(--text)" },
    subtitle: { color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" },
    optBtn: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: "pointer", transition: "all 0.15s", textAlign: "center" },
    optBtnActive: { background: "rgba(201,168,76,0.12)", border: "1px solid var(--gold)", boxShadow: "0 0 0 1px var(--gold-dark)" },
    optIcon: { lineHeight: 1 },
    optLabel: { color: "var(--text)", fontWeight: 500 },
    optDesc: { color: "var(--text-muted)", fontSize: "0.72rem", marginTop: "0.1rem" },
    backBtn: { background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.75rem 1.25rem", borderRadius: 4, cursor: "pointer", fontSize: "0.9rem" },
    nextBtn: { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 700, borderRadius: 4, fontSize: "0.95rem", cursor: "pointer", border: "none", letterSpacing: "0.03em", transition: "opacity 0.2s" },
};
