import { Resend } from 'resend';

export async function sendInquiryEmail({ name, email, organization, purpose, message }) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Portfolio Bot <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO,
    subject: `[Portfolio] New ${purpose} inquiry from ${name}`,
    text: [
      `Name:         ${name}`,
      `Email:        ${email}`,
      `Organization: ${organization || '—'}`,
      `Purpose:      ${purpose}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#F5A623;border-bottom:2px solid #F5A623;padding-bottom:8px">
          New Portfolio Inquiry
        </h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr style="background:#f9f9f9">
            <td style="padding:10px 14px;color:#888;width:130px">Name</td>
            <td style="padding:10px 14px"><strong>${name}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#888">Email</td>
            <td style="padding:10px 14px"><a href="mailto:${email}" style="color:#F5A623">${email}</a></td>
          </tr>
          <tr style="background:#f9f9f9">
            <td style="padding:10px 14px;color:#888">Organization</td>
            <td style="padding:10px 14px">${organization || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#888">Purpose</td>
            <td style="padding:10px 14px">${purpose}</td>
          </tr>
        </table>
        <h3 style="margin-top:24px;color:#333">Message</h3>
        <p style="white-space:pre-wrap;background:#f9f9f9;padding:14px;border-left:3px solid #F5A623;font-size:14px;line-height:1.6">${message}</p>
        <p style="font-size:11px;color:#aaa;margin-top:24px">Sent from mohit-portfolio contact form</p>
      </div>
    `,
  });
}
