import { ImageResponse } from "next/og";
import { PACKAGE_TIERS } from "@/lib/services-data";

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

export async function GET() {
  const lowestPrice = Math.min(...PACKAGE_TIERS.map((p) => p.price));

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
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
            }}
          >
            From ${lowestPrice} per session
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 700,
              color: COLORS.text,
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              maxWidth: "1100px",
            }}
          >
            Sanctuary{" "}
            <span style={{ color: COLORS.accent }}>Access</span>
          </div>
          <div
            style={{
              fontSize: "32px",
              color: COLORS.textMuted,
              lineHeight: 1.4,
              maxWidth: "1000px",
            }}
          >
            Secure your sessions in the Virtual Sanctuary. All packages include
            our Hard Anonymity Protocol and real-time voice masking.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
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
          <span>·</span>
          <span>Stripe-secured.</span>
          <span style={{ marginLeft: "auto", color: COLORS.primary, fontWeight: 600 }}>
            hips.foundation/services
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
