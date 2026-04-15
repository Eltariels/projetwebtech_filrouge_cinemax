export function SkeletonCard() {
    return (
        <div style={{
            width: "100%",
            aspectRatio: "2/3",
            borderRadius: 4,
            background: "var(--skeleton-bg)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s ease-in-out infinite",
        }} />
    );
}

export function SkeletonRow({ count = 5 }: { count?: number }) {
    return (
        <div style={{ marginBottom: "2rem" }}>
            {/* Titre squelette */}
            <div style={{
                width: 180, height: 18, borderRadius: 4, marginBottom: "0.75rem",
                background: "var(--skeleton-bg)", backgroundSize: "200% 100%",
                animation: "shimmer 1.6s ease-in-out infinite",
            }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} style={{ flex: `0 0 calc(${100 / count}% - 0.5rem)` }}>
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        </div>
    );
}
