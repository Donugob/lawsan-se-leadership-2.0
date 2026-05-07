import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail({ email, firstName, regId, pdfBuffer }: { 
  email: string, 
  firstName: string, 
  regId: string,
  pdfBuffer: Buffer
}) {
  try {
    const fromDomain = process.env.RESEND_FROM_DOMAIN || 'lawsanse.org';
    const { data, error } = await resend.emails.send({
      from: `Leadership Conference <no-reply@${fromDomain}>`,
      to: [email],
      subject: 'Your Registration is Confirmed! 🎟️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: 'Outfit', sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px rgba(8, 29, 15, 0.05); border: 1px solid #e7f0eb;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color: #081d0f; padding: 60px 40px; border-bottom: 6px solid #d4ba54;">
                      <div style="color: #d4ba54; font-size: 10px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 12px;">Official Admission</div>
                      <h1 style="color: #ffffff; font-family: 'Playfair Display', serif; font-size: 32px; margin: 0; letter-spacing: -1px;">Leadership Conference 2.0</h1>
                      <div style="color: #9bcbac; font-size: 11px; margin-top: 8px; letter-spacing: 1px;">Emerging Lawyers, Emerging Realities</div>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 60px 50px;">
                      <h2 style="color: #081d0f; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 16px;">Congratulations, ${firstName}!</h2>
                      <p style="color: #4fa56d; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
                        Your registration has been successfully confirmed. We are thrilled to have you join us for this transformative experience.
                      </p>
                      
                      <!-- Registration ID Card -->
                      <div style="background-color: #fbf8ed; border: 1px dashed #d4ba54; border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 40px;">
                        <div style="color: #d4ba54; font-size: 9px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Registration ID</div>
                        <div style="color: #081d0f; font-size: 42px; font-weight: bold; letter-spacing: 2px;">#${regId}</div>
                      </div>
                      
                      <p style="color: #75b88c; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                        Your digital ticket is attached to this email. Please ensure you have it available (printed or on your phone) for check-in at the venue.
                      </p>
                      
                      <!-- Event Meta -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                        <tr>
                          <td style="padding-right: 20px;">
                            <div style="color: #d4ba54; font-size: 9px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Date</div>
                            <div style="color: #081d0f; font-size: 14px; font-weight: bold;">6th June, 2026</div>
                          </td>
                          <td>
                            <div style="color: #d4ba54; font-size: 9px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Venue</div>
                            <div style="color: #081d0f; font-size: 14px; font-weight: bold;">G.O.U, Enugu</div>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="border-top: 1px solid #e7f0eb; padding-top: 30px; text-align: center;">
                        <p style="color: #081d0f; font-size: 12px; font-weight: bold; margin: 0;">LAWSAN South East Zone</p>
                        <p style="color: #b1b1b1; font-size: 10px; margin-top: 4px;">Powered by the Leadership Committee</p>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 30px; text-align: center; color: #b1b1b1; font-size: 11px;">
                      You received this email because you registered for the Lawsan SE Leadership Conference.
                      <br/>
                      © 2026 Lawsan SE. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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

export async function sendAdminInvitationEmail({ email, name, setupUrl }: {
  email: string,
  name: string,
  setupUrl: string
}) {
  try {
    const fromDomain = process.env.RESEND_FROM_DOMAIN || 'lawsanse.org';
    const { data, error } = await resend.emails.send({
      from: `Leadership Security <no-reply@${fromDomain}>`,
      to: [email],
      subject: 'Invite: Join the Admin Panel 🛡️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #081d0f; padding: 60px; border-radius: 40px; color: #ffffff;">
          <h1 style="color: #d4ba54; font-size: 28px; margin-bottom: 24px;">Admin Invitation</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #9bcbac; margin-bottom: 32px;">
            Hello ${name},<br/><br/>
            You have been invited to join the administration team for the <strong>Lawsan SE Leadership Conference 2.0</strong>.
          </p>
          <a href="${setupUrl}" style="display: inline-block; background-color: #d4ba54; color: #081d0f; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(212, 186, 84, 0.2);">
            Complete Your Setup
          </a>
          <p style="margin-top: 40px; font-size: 12px; color: #4fa56d;">
            This link will expire in 7 days. If you were not expecting this invite, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #18582f; margin: 40px 0;" />
          <p style="font-size: 10px; color: #75b88c; text-align: center;">
            LAWSAN South East Zone Security Operations
          </p>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
