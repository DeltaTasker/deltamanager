const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLastOtp() {
  try {
    const otp = await prisma.authOtp.findFirst({
      where: { email: 'mdavalosn@gmail.com' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (otp) {
      console.log('Código OTP:', otp.code);
      console.log('Expira:', otp.expiresAt);
    } else {
      console.log('No se encontró OTP para este correo');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getLastOtp();

