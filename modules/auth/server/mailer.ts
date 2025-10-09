import nodemailer, { type Transporter } from "nodemailer";

import { config } from "@/lib/config";

type SendOtpOptions = {
  email: string;
  code: string;
  expiresAt: Date;
};

const transporter: Transporter = nodemailer.createTransport({
  host: config.env.SMTP_HOST,
  port: config.env.SMTP_PORT,
  secure: config.env.SMTP_SECURE,
  auth: {
    user: config.env.SMTP_USER,
    pass: config.env.SMTP_PASSWORD,
  },
});

const FROM = config.env.SMTP_FROM ?? `DeltaManager <${config.env.SMTP_USER}>`;

export async function sendOtpEmail({ email, code, expiresAt }: SendOtpOptions) {
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
      <title>Código de acceso DeltaManager</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0f172a;
          color: #e2e8f0;
          font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
        }
        .container {
          max-width: 480px;
          margin: 0 auto;
          padding: 32px 24px;
          background: linear-gradient(145deg, rgba(30,64,175,0.9), rgba(88,28,135,0.95));
          border-radius: 20px;
          box-shadow: 0 12px 35px rgba(30,64,175,0.35);
        }
        .code {
          font-size: 32px;
          letter-spacing: 10px;
          font-weight: 700;
          text-align: center;
          margin: 32px 0;
          background: rgba(15,23,42,0.35);
          border-radius: 16px;
          padding: 16px 0;
        }
        p {
          line-height: 1.6;
        }
        .footer {
          margin-top: 24px;
          font-size: 12px;
          color: rgba(226,232,240,0.65);
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Hola,</p>
        <p>Tu código de acceso a <strong>DeltaManager</strong> es:</p>
        <div class="code">${code}</div>
        <p>
          El código es válido durante los próximos <strong>5 minutos</strong> (hasta las <strong>${expiresLabel}</strong>).
        </p>
        <p>
          Si no solicitaste este acceso, puedes ignorar este correo. Nadie podrá acceder sin el código.
        </p>
        <div class="footer">
          DeltaManager · Plataforma contable SaaS
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



