import { sendOtpEmail } from "@/modules/auth/server/mailer";
import { addMinutes } from "date-fns";

async function testEmailSending() {
  console.log("🧪 Probando envío de email con configuración SMTP...\n");

  const testEmail = process.argv[2];
  
  if (!testEmail) {
    console.error("❌ Error: Debes proporcionar un email como argumento");
    console.log("\nUso: pnpm tsx scripts/test-email.ts tu-email@dominio.com\n");
    process.exit(1);
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testEmail)) {
    console.error(`❌ Error: "${testEmail}" no es un email válido\n`);
    process.exit(1);
  }

  console.log("📧 Email de destino:", testEmail);
  console.log("🔧 Configuración SMTP:");
  console.log("  - Host:", process.env.SMTP_HOST);
  console.log("  - Port:", process.env.SMTP_PORT);
  console.log("  - User:", process.env.SMTP_USER);
  console.log("  - From:", process.env.SMTP_FROM);
  console.log("");

  try {
    const code = "123456"; // Código de prueba
    const expiresAt = addMinutes(new Date(), 5);

    console.log("📤 Enviando email de prueba...");
    
    await sendOtpEmail({
      email: testEmail,
      code,
      expiresAt,
    });

    console.log("✅ Email enviado exitosamente!");
    console.log(`\n🎉 Revisa la bandeja de entrada (y spam) de: ${testEmail}`);
    console.log(`📋 Código de prueba enviado: ${code}`);
    console.log(`⏰ Expira en: ${expiresAt.toLocaleString("es-MX")}\n`);
  } catch (error) {
    console.error("❌ Error al enviar email:");
    console.error(error);
    console.log("\n💡 Posibles soluciones:");
    console.log("  1. Verifica que las credenciales SMTP sean correctas");
    console.log("  2. Revisa que el puerto 465 no esté bloqueado");
    console.log("  3. Confirma que SMTP_USER y SMTP_PASSWORD sean válidos");
    console.log("  4. Intenta con SMTP_PORT=587 y SMTP_SECURE=false\n");
    process.exit(1);
  }
}

testEmailSending();

