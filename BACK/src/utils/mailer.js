const nodemailer = require('nodemailer');

async function sendRecoveryEmail(email, resetLink) {
  // Aqui você configura o transporte de e-mail
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de e-mail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    html: `<p>Para redefinir sua senha, clique no link abaixo:</p><a href="${resetLink}">Redefinir Senha</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de recuperação enviado para:', email); // Verificação do envio
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail');
  }
}

module.exports = { sendRecoveryEmail };
