const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendContactEmail = async ({ name, email, subject, message }) => {
  // Email to YOU (notification)
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `📩 New Contact: ${subject}`,
    html: `
      <div style="font-family: monospace; background: #050B14; color: #E8F4FD; padding: 32px; border-radius: 8px; max-width: 600px;">
        <div style="border-bottom: 1px solid rgba(0,217,255,0.3); padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #00D9FF; margin: 0;">📩 New Portfolio Contact</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #4A6480; padding: 8px 0; width: 80px;">Name</td>
            <td style="color: #E8F4FD; padding: 8px 0;"><strong>${name}</strong></td>
          </tr>
          <tr>
            <td style="color: #4A6480; padding: 8px 0;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: #00D9FF;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #4A6480; padding: 8px 0;">Subject</td>
            <td style="color: #E8F4FD; padding: 8px 0;">${subject}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: rgba(0,217,255,0.05); border-left: 3px solid #00D9FF; border-radius: 4px;">
          <p style="color: #4A6480; margin: 0 0 8px 0; font-size: 12px;">MESSAGE</p>
          <p style="color: #E8F4FD; margin: 0; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</p>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(0,217,255,0.1);">
          <a href="mailto:${email}?subject=Re: ${subject}"
            style="display: inline-block; background: #00D9FF; color: #050B14; padding: 10px 24px;
            text-decoration: none; font-weight: bold; border-radius: 4px;">
            Reply to ${name}
          </a>
        </div>

        <p style="color: #4A6480; font-size: 11px; margin-top: 24px;">
          Sent from your portfolio contact form
        </p>
      </div>
    `,
  })

  // Auto-reply to SENDER
  await transporter.sendMail({
    from: `"Charith Anupama" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `
      <div style="font-family: monospace; background: #050B14; color: #E8F4FD; padding: 32px; border-radius: 8px; max-width: 600px;">
        <div style="border-bottom: 1px solid rgba(0,217,255,0.3); padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #00D9FF; margin: 0;">Hey ${name}! 👋</h2>
        </div>

        <p style="color: #A8C4D8; line-height: 1.8;">
          Thanks for reaching out through my portfolio. I've received your message and will get back to you as soon as possible — usually within 24 hours.
        </p>

        <div style="margin: 24px 0; padding: 16px; background: rgba(0,217,255,0.05); border-left: 3px solid #00D9FF; border-radius: 4px;">
          <p style="color: #4A6480; margin: 0 0 8px 0; font-size: 12px;">YOUR MESSAGE</p>
          <p style="color: #E8F4FD; margin: 0; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</p>
        </div>

        <p style="color: #A8C4D8; line-height: 1.8;">
          In the meantime, feel free to check out my work on
          <a href="https://github.com/CharithAnupama58" style="color: #00D9FF;">GitHub</a> or connect on
          <a href="https://www.linkedin.com/in/charith-anupama20" style="color: #00D9FF;">LinkedIn</a>.
        </p>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(0,217,255,0.1);">
          <p style="color: #E8F4FD; margin: 0;">Best regards,</p>
          <p style="color: #00D9FF; margin: 4px 0 0 0; font-size: 18px; font-weight: bold;">Charith Anupama</p>
          <p style="color: #4A6480; margin: 4px 0 0 0; font-size: 12px;">Software Engineer · Sri Lanka 🇱🇰</p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendContactEmail }