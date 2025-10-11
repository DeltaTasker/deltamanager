import { config } from "@/lib/config";

type SendOtpOptions = {
  email: string;
  code: string;
  expiresAt: Date;
};

const FROM = config.env.SMTP_FROM ?? `DeltaManager <${config.env.SMTP_USER}>`;

async function getMailer() {
  // Dynamic import to avoid Edge runtime issues
  const nodemailer = await import("nodemailer");
  return nodemailer.default.createTransport({
    host: config.env.SMTP_HOST,
    port: config.env.SMTP_PORT,
    secure: config.env.SMTP_SECURE,
    auth: {
      user: config.env.SMTP_USER,
      pass: config.env.SMTP_PASSWORD,
    },
  });
}

export async function sendOtpEmail({ email, code, expiresAt }: SendOtpOptions) {
  const transporter = await getMailer();
  const locale = config.env.LOCALE ?? "es-MX";
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const expiresLabel = dateFormatter.format(expiresAt);

  const plainText = [
    "Tu código de acceso a DeltaManager es:",
    "",
    code,
    "",
    "Este código expira en 5 minutos (" + expiresLabel + ").",
    "Si no solicitaste este acceso, ignora este correo.",
  ].join("\n");

  const html = `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>🔐 Código de Acceso - DeltaManager</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #e2e8f0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.02)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.02)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          opacity: 0.3;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #f1f5f9;
        }
        .code-container {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border: 2px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
        }
        .code-label {
          font-size: 14px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 12px;
          color: #3b82f6;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          margin: 0;
        }
        .expiry-info {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
        }
        .expiry-text {
          font-size: 16px;
          color: #fbbf24;
          text-align: center;
          margin: 0;
          font-weight: 500;
        }
        .security-notice {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
        }
        .security-text {
          font-size: 14px;
          color: #fca5a5;
          text-align: center;
          margin: 0;
          line-height: 1.5;
        }
        .footer {
          background: rgba(15, 23, 42, 0.8);
          padding: 30px;
          text-align: center;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }
        .footer-text {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        .highlight {
          color: #3b82f6;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 16px;
          }
          .header, .content, .footer {
            padding: 30px 20px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">DeltaManager</div>
          <div class="subtitle">Sistema Contable Profesional</div>
        </div>

        <div class="content">
          <p class="greeting">Hola,</p>

          <p>Has solicitado acceso a <strong class="highlight">DeltaManager</strong>, tu plataforma contable de confianza.</p>

          <div class="code-container">
            <div class="code-label">Tu código de acceso</div>
            <div class="code">${code}</div>
          </div>

          <div class="expiry-info">
            <p class="expiry-text">
              ⏰ Este código expira en <strong>5 minutos</strong> (hasta las <strong>${expiresLabel}</strong>)
            </p>
          </div>

          <div class="security-notice">
            <p class="security-text">
              🔒 Si no solicitaste este acceso, puedes ignorar este correo.<br>
              <strong>Nadie podrá acceder sin este código único.</strong>
            </p>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">
            DeltaManager · Plataforma Contable SaaS<br>
            <span class="highlight">Seguro. Confiable. Profesional.</span>
          </p>
        </div>
      </div>
    </body>
  </html>`;

  await transporter.sendMail({
    to: email,
    from: FROM,
    subject: "Tu código de acceso a DeltaManager",
    text: plainText,
    html,
  });
}



