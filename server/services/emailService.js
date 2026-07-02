import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "SerpoAI <noreply@serpoai.com>";

/**
 * Welcome email — sent on register
 */
export const sendWelcomeEmail = async ({ name, email }) => {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to SerpoAI 🚀",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
        <body style="margin:0;padding:0;background:#f7f6f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:40px 0;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                <!-- Header -->
                <tr><td style="background:#01696f;padding:32px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SerpoAI</h1>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">SEO Rank Intelligence</p>
                </td></tr>
                <!-- Body -->
                <tr><td style="padding:40px;">
                  <h2 style="margin:0 0 16px;color:#28251d;font-size:22px;font-weight:600;">Welcome aboard, ${name}! 👋</h2>
                  <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.7;">You're all set to start tracking your SEO rankings and analysing your website performance with AI-powered insights.</p>
                  <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">Here's what you can do right now:</p>
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                    <tr><td style="padding:12px 16px;background:#f7f6f2;border-radius:8px;margin-bottom:8px;">
                      <span style="color:#01696f;font-weight:600;font-size:14px;">📊 Analyse a URL</span>
                      <p style="margin:4px 0 0;color:#666;font-size:13px;">Get an instant AI SEO report with scores, issues and quick wins.</p>
                    </td></tr>
                    <tr><td style="padding:4px 0;"></td></tr>
                    <tr><td style="padding:12px 16px;background:#f7f6f2;border-radius:8px;">
                      <span style="color:#01696f;font-weight:600;font-size:14px;">🎯 Track Keywords</span>
                      <p style="margin:4px 0 0;color:#666;font-size:13px;">Add keywords and get daily or weekly rank updates straight to your inbox.</p>
                    </td></tr>
                  </table>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display:inline-block;background:#01696f;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">Get Started →</a>
                </td></tr>
                <!-- Footer -->
                <tr><td style="padding:24px 40px;border-top:1px solid #eee;">
                  <p style="margin:0;color:#aaa;font-size:12px;">You received this because you signed up for SerpoAI. Questions? Reply to this email.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log(`[Email] Welcome email sent to ${email}`);
  } catch (err) {
    console.error(`[Email] Failed to send welcome email:`, err.message);
  }
};

/**
 * SEO analysis complete email — sent after analyzeUrl
 */
export const sendAnalysisCompleteEmail = async ({ name, email, url, scores, aiReport }) => {
  try {
    const scoreBar = (score) => {
      const color = score >= 80 ? "#437a22" : score >= 50 ? "#d19900" : "#a12c7b";
      return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">${score}/100</span>`;
    };

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your SEO Analysis is Ready — ${new URL(url).hostname}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
        <body style="margin:0;padding:0;background:#f7f6f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:40px 0;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                <tr><td style="background:#01696f;padding:32px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">SerpoAI</h1>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Analysis Complete</p>
                </td></tr>
                <tr><td style="padding:40px;">
                  <h2 style="margin:0 0 8px;color:#28251d;font-size:20px;font-weight:600;">Your report is ready, ${name}</h2>
                  <p style="margin:0 0 24px;color:#888;font-size:13px;word-break:break-all;">${url}</p>

                  <!-- Scores -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
                    <tr style="background:#f7f6f2;">
                      <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Metric</td>
                      <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Score</td>
                    </tr>
                    <tr><td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;color:#28251d;">SEO</td><td style="padding:12px 16px;border-top:1px solid #eee;">${scoreBar(scores.seo)}</td></tr>
                    <tr><td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;color:#28251d;">Accessibility</td><td style="padding:12px 16px;border-top:1px solid #eee;">${scoreBar(scores.accessibility)}</td></tr>
                    <tr><td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;color:#28251d;">Performance</td><td style="padding:12px 16px;border-top:1px solid #eee;">${scoreBar(scores.performance)}</td></tr>
                    <tr><td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;color:#28251d;">Best Practices</td><td style="padding:12px 16px;border-top:1px solid #eee;">${scoreBar(scores.bestPractices)}</td></tr>
                  </table>

                  <!-- AI Report -->
                  <div style="background:#f7f6f2;border-radius:8px;padding:20px;margin-bottom:28px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#01696f;text-transform:uppercase;letter-spacing:0.5px;">AI Report Summary</p>
                    <p style="margin:0;font-size:14px;color:#444;line-height:1.7;white-space:pre-line;">${aiReport.slice(0, 600)}${aiReport.length > 600 ? "..." : ""}</p>
                  </div>

                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="display:inline-block;background:#01696f;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">View Full Report →</a>
                </td></tr>
                <tr><td style="padding:24px 40px;border-top:1px solid #eee;">
                  <p style="margin:0;color:#aaa;font-size:12px;">Sent by SerpoAI · <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color:#aaa;">serpoai.com</a></p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log(`[Email] Analysis complete email sent to ${email}`);
  } catch (err) {
    console.error(`[Email] Failed to send analysis email:`, err.message);
  }
};

/**
 * Rank report email — sent by daily/weekly cron
 */
export const sendRankReportEmail = async ({ name, email, trackers, frequency }) => {
  try {
    if (!trackers || trackers.length === 0) return;

    const rows = trackers
      .map((t) => {
        const latest = t.history?.[t.history.length - 1];
        const prev = t.history?.[t.history.length - 2];
        const pos = latest?.position ?? null;
        const prevPos = prev?.position ?? null;

        let trend = "";
        if (pos !== null && prevPos !== null) {
          if (pos < prevPos) trend = `<span style="color:#437a22;font-size:12px;">▲ +${prevPos - pos}</span>`;
          else if (pos > prevPos) trend = `<span style="color:#a12c7b;font-size:12px;">▼ -${pos - prevPos}</span>`;
          else trend = `<span style="color:#888;font-size:12px;">— same</span>`;
        }

        const posDisplay = pos !== null
          ? `<strong style="color:#01696f;">#${pos}</strong>`
          : `<span style="color:#aaa;">Not in top 30</span>`;

        return `
          <tr>
            <td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;color:#28251d;">${t.keyword}</td>
            <td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;">${posDisplay}</td>
            <td style="padding:12px 16px;border-top:1px solid #eee;font-size:14px;">${trend}</td>
          </tr>
        `;
      })
      .join("");

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your ${frequency === "daily" ? "Daily" : "Weekly"} Rank Report — SerpoAI`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
        <body style="margin:0;padding:0;background:#f7f6f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:40px 0;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                <tr><td style="background:#01696f;padding:32px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">SerpoAI</h1>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${frequency === "daily" ? "Daily" : "Weekly"} Rank Report</p>
                </td></tr>
                <tr><td style="padding:40px;">
                  <h2 style="margin:0 0 8px;color:#28251d;font-size:20px;font-weight:600;">Hey ${name}, here's your ${frequency} update</h2>
                  <p style="margin:0 0 28px;color:#888;font-size:14px;">Tracking ${trackers.length} keyword${trackers.length !== 1 ? "s" : ""} · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
                    <tr style="background:#f7f6f2;">
                      <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Keyword</td>
                      <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Position</td>
                      <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Change</td>
                    </tr>
                    ${rows}
                  </table>

                  <p style="margin:28px 0 24px;color:#555;font-size:14px;line-height:1.7;">Log in to see full history, competitor data, and AI-powered suggestions.</p>
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="display:inline-block;background:#01696f;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">View Dashboard →</a>
                </td></tr>
                <tr><td style="padding:24px 40px;border-top:1px solid #eee;">
                  <p style="margin:0;color:#aaa;font-size:12px;">You're receiving this because your schedule is set to <strong>${frequency}</strong>. <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/settings" style="color:#aaa;">Change preferences</a></p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log(`[Email] ${frequency} rank report sent to ${email} (${trackers.length} keywords)`);
  } catch (err) {
    console.error(`[Email] Failed to send rank report:`, err.message);
  }
};
