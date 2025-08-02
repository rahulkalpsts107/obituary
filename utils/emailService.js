const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const notifyAdmin = async (condolence, obituary) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Condolence Message for ${obituary.name}`,
    html: `
      <h3>New Condolence Message</h3>
      <p><strong>From:</strong> ${condolence.name} (${condolence.email})</p>
      <p><strong>Message:</strong></p>
      <p>${condolence.message}</p>
      <p><strong>Submitted:</strong> ${condolence.createdAt}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const confirmSubmission = async (condolence, obituary) => {
  const websiteUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: condolence.email,
    subject: `Thank you for your condolence message for ${obituary.name}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F7F5F1; border: 2px solid #D4C4A0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #8B7355; font-size: 24px; margin-bottom: 10px;">Thank You</h2>
          <div style="width: 60px; height: 3px; background-color: #C4A572; margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 8px; border: 1px solid #D4C4A0;">
          <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Dear ${condolence.name},
          </p>
          
          <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you from the bottom of our hearts for your heartfelt condolence message for <strong>${obituary.name}</strong>. 
            Your words of comfort and support mean so much to our family during this difficult time.
          </p>
          
          <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your message has been posted on the memorial website and will serve as a lasting tribute to ${obituary.name}'s memory.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${websiteUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B7355, #A0926B); color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; border: 2px solid #C4A572;">
              Visit Memorial Website
            </a>
          </div>
          
          <p style="color: #666666; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 25px; font-style: italic;">
            "In loving memory, forever in our hearts"
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #8B7355; font-size: 18px; font-weight: bold;">${obituary.name}</p>
          <p style="color: #666666; font-size: 14px;">
            ${new Date(obituary.dateOfBirth).toLocaleDateString()} - ${new Date(obituary.dateOfPassing).toLocaleDateString()}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #D4C4A0;">
          <p style="color: #A0926B; font-size: 12px;">
            With gratitude,<br>
            The Family
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { notifyAdmin, confirmSubmission };
