// server/config/mailer.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRankDropAlert = async ({ to, keyword, url, oldPosition, newPosition }) => {
  const drop = newPosition - oldPosition;

  await resend.emails.send({
    from: "SerpoAI Alerts <alerts@yourdomain.com>", // must be a verified domain in Resend
    to,
    subject: `⚠️ Rank Drop Alert: "${keyword}" dropped ${drop} positions`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:28px;border:1px solid #e5e7eb;border-radius:10px;">
        <h2 style="color:#dc2626;margin-top:0;">📉 Keyword Rank Drop Detected</h2>
        <p style="color:#374151;">Your tracked keyword has dropped significantly in search rankings.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr style="background:#f9fafb;">
            <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;color:#111827;">Keyword</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${keyword}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;color:#111827;">URL</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${url}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;color:#111827;">Previous Position</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">#${oldPosition}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;color:#111827;">New Position</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#dc2626;font-weight:700;">#${newPosition} (↓${drop})</td>
          </tr>
        </table>
        <a href="${process.env.CLIENT_URL}/rank-tracker"
           style="display:inline-block;margin-top:22px;padding:11px 22px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          View Rank Tracker →
        </a>
        <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
          You're receiving this because you have rank drop alerts enabled in SerpoAI.
        </p>
      </div>
    `,
  });
};