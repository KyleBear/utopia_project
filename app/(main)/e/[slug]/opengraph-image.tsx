import { ImageResponse } from "next/og";
import { getExpertBySlug } from "@/lib/data/experts";

export const runtime = "edge";
export const alt = "전문가 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const expert = await getExpertBySlug(params.slug);
  const name = expert?.nickname ?? params.slug;
  const bio = expert?.bio ?? "Utopia 전문가";
  const initial = name.charAt(0).toUpperCase();
  const tags = expert?.expertise?.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1030 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 브랜드 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "auto" }}>
          <div style={{ color: "#a78bfa", fontSize: "20px", fontWeight: 700 }}>✦ Utopia</div>
        </div>

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "32px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: "#f1f5f9" }}>{name}</span>
              <span style={{ fontSize: "22px", color: "#a78bfa" }}>✓</span>
            </div>
            <span style={{ fontSize: "20px", color: "#94a3b8" }}>전문가 · @{params.slug}</span>
          </div>
        </div>

        {/* 소개 */}
        {bio && (
          <div
            style={{
              fontSize: "22px",
              color: "#cbd5e1",
              lineHeight: 1.6,
              marginBottom: "28px",
              maxWidth: "900px",
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            {bio.length > 100 ? bio.slice(0, 100) + "…" : bio}
          </div>
        )}

        {/* 태그 */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 18px",
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(167, 139, 250, 0.3)",
                  borderRadius: "100px",
                  color: "#a78bfa",
                  fontSize: "18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    size
  );
}
