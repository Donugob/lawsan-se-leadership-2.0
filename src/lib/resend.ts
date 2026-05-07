import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail({ email, firstName, regId, pdfBuffer }: { 
  email: string, 
  firstName: string, 
  regId: string,
  pdfBuffer: Buffer
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Leadership Conference <no-reply@lawsanse.org>',
      to: [email],
      subject: 'Your Registration is Confirmed! 🎟️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F7F4; padding: 40px; border-radius: 20px;">
          <h1 style="color: #081d0f; font-size: 24px;">Congratulations, ${firstName}!</h1>
          <p style="color: #4fa56d; font-size: 16px; line-height: 1.6;">
            Your registration for the <strong>Leadership Conference 2.0</strong> has been successfully confirmed.
          </p>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 15px; border: 1px solid #e7f0eb; margin: 30px 0;">
            <p style="margin: 0; color: #75b88c; font-size: 12px; text-transform: uppercase;">Your Registration ID</p>
            <p style="margin: 5px 0 0; color: #081d0f; font-size: 20px; font-weight: bold;">#${regId}</p>
          </div>
          <p style="color: #4fa56d; font-size: 14px;">
            Your digital ticket is attached to this email. Please keep it safe as it will be required for check-in at the venue.
          </p>
          <hr style="border: none; border-top: 1px solid #e7f0eb; margin: 30px 0;" />
          <p style="color: #75b88c; font-size: 12px; text-align: center;">
            LAWSAN South East Zone &copy; 2026
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Ticket-${regId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email sending failed:', err);
    return { success: false, error: err };
  }
}
