// src/lib/email.ts

export async function sendOTPEmail(
  toEmail: string,
  otp: string,
  userName?: string
): Promise<boolean> {
  try {
    // Support both variable names
    const apiKey = process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("❌ No Resend API key found. Set AUTH_RESEND_KEY or RESEND_API_KEY in .env.local");
      return false;
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Danho Lomuso <onboarding@resend.dev>";

    // In development, always use onboarding@resend.dev (no domain verification needed)
    const safeFrom =
      process.env.NODE_ENV === "development"
        ? "Danho Lomuso <onboarding@resend.dev>"
        : fromEmail;

    console.log(`📨 Sending OTP email to ${toEmail} via ${safeFrom}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: safeFrom,
        to: [toEmail],
        subject: "Your Danho Lomuso Verification Code",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FFFDF9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFDF9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:24px;border:1px solid #EDE3DC;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0D4429;padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;">🌱 Danho Lomuso</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0D4429;">
                ${userName ? `Mhoroi, ${userName.split(" ")[0]}!` : "Mhoroi!"}
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">
                Here is your verification code to sign in to Danho Lomuso.
                This code expires in <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#F5EFEB;border-radius:16px;padding:28px 20px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
                      Your Verification Code
                    </p>
                    <p style="margin:0;font-size:48px;font-weight:800;color:#0D4429;letter-spacing:14px;font-family:monospace;">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 8px;font-size:13px;color:#9CA3AF;line-height:1.6;">
                If you did not request this code, you can safely ignore this email.
                Never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #EDE3DC;text-align:center;">
              <p style="margin:0;font-size:12px;color:#D1C5BC;">
                © 2025 Danho Lomuso · Built for Zimbabwe's Youth
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`❌ Resend API error ${res.status}:`, errBody);
      return false;
    }

    console.log(`✅ OTP email sent successfully to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Email send exception:", err);
    return false;
  }
}