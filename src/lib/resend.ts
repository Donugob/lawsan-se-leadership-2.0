import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail({ email, firstName, regId, pdfBuffer }: {
  email: string,
  firstName: string,
  regId: string,
  pdfBuffer: Buffer
}) {
  try {
    const fromDomain = process.env.RESEND_FROM_DOMAIN || 'lawsan-se.com.ng';
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
                            <div style="color: #081d0f; font-size: 14px; font-weight: bold;">4th June, 2026</div>
                          </td>
                          <td>
                            <div style="color: #d4ba54; font-size: 9px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Venue</div>
                            <div style="color: #081d0f; font-size: 14px; font-weight: bold;">G.O.U, Enugu</div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- WhatsApp Group Invitation -->
                      <div style="background-color: #fbf8ed; border: 1px solid #c1decb; border-radius: 20px; padding: 28px; text-align: center; margin-bottom: 40px;">
                        <h3 style="color: #081d0f; font-family: 'Playfair Display', serif; font-size: 18px; margin: 0; margin-bottom: 8px;">Join the Delegate Community</h3>
                        <p style="color: #21753e; font-size: 12px; line-height: 1.5; margin: 0; margin-bottom: 20px;">
                          Connect with fellow emerging lawyers, receive real-time conference updates, and participate in exclusive networking before the event.
                        </p>
                        <a href="https://chat.whatsapp.com/HNV6XqgqXedH2iEIUNGVsC?mode=gi_t" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 28px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                          Join Official WhatsApp Group
                        </a>
                      </div>
                      
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
    const fromDomain = process.env.RESEND_FROM_DOMAIN || 'lawsan-se.com.ng';
    const { data, error } = await resend.emails.send({
      from: `Leadership Security <no-reply@${fromDomain}>`,
      to: [email],
      subject: 'Invite: Join the Admin Panel 🛡️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #06160b; font-family: 'Outfit', sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 60px 20px;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #081d0f; border-radius: 40px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 40px 80px rgba(0,0,0,0.5);">
                  <tr>
                    <td style="padding: 60px 40px; text-align: center;">
                      <div style="width: 64px; height: 64px; background-color: #d4ba54; border-radius: 20px; display: inline-block; margin-bottom: 30px;">
                        <img src="https://i.postimg.cc/kg9csQNq/logo2.png" alt="🛡️" style="width: 32px; height: 32px; margin-top: 16px;" />
                      </div>
                      <h1 style="color: #d4ba54; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; margin-bottom: 12px;">Admin Invitation</h1>
                      <p style="color: #9bcbac; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
                        Hello ${name},<br/><br/>
                        You have been granted administrative access to the <strong>Leadership Conference 2.0</strong> portal.
                      </p>
                      
                      <a href="${setupUrl}" style="display: inline-block; background-color: #d4ba54; color: #081d0f; padding: 20px 40px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 40px; box-shadow: 0 10px 20px rgba(212, 186, 84, 0.2);">
                        Secure Your Access
                      </a>
                      
                      <div style="padding: 20px; background-color: rgba(255, 255, 255, 0.03); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="color: #4fa56d; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Security Protocol</p>
                        <p style="color: #75b88c; font-size: 12px; margin-top: 8px;">
                          This link will expire in 7 days. Ensure you use a strong, unique password for your administration account.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 40px; text-align: center;">
                      <p style="color: #18582f; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; font-weight: bold;">Lawsan SE Security Operations</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
