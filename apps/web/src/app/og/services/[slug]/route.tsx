import { ImageResponse } from "next/og";
import { SERVICES_CATALOG } from "@/lib/services-data";

export const runtime = "edge";

const COLORS = {
  bg: "#FFFFFF",
  primary: "#173B57",
  accent: "#C59A35",
  text: "#213d53",
  textMuted: "#6F8291",
  surface: "#F6F8FA",
  border: "#D6E0E8",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: COLORS.bg,
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: `${COLORS.primary}1A`,
              border: `1px solid ${COLORS.primary}33`,
              color: COLORS.primary,
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: COLORS.text,
                letterSpacing: "-0.02em",
              }}
            >
              HSSS Sanctuary
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
              }}
            >
              {service.category}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              fontWeight: 700,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
            }}
          >
            {service.duration} · {service.priceDisplay}
          </div>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 700,
              color: COLORS.text,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            {service.title}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: COLORS.textMuted,
              lineHeight: 1.4,
              maxWidth: "1000px",
            }}
          >
            {service.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "60px",
            paddingTop: "32px",
            borderTop: `1px solid ${COLORS.border}`,
            fontSize: "16px",
            color: COLORS.textMuted,
          }}
        >
          <span style={{ fontWeight: 700, color: COLORS.text }}>
            Anonymous.
          </span>
          <span>·</span>
          <span>Camera-free.</span>
          <span>·</span>
          <span>Voice-masked.</span>
          <span style={{ marginLeft: "auto", color: COLORS.primary, fontWeight: 600 }}>
            hips.foundation/services/{service.slug}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
