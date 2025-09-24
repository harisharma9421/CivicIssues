const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransporter({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }
    }

    async sendEmail(to, subject, text, html = null) {
        if (!this.transporter) {
            console.log('Email service not configured. Skipping email send.');
            return { success: false, message: 'Email service not configured' };
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
                html: html || text
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(user) {
        const subject = 'Welcome to CivicConnect!';
        const text = `Hello ${user.name},\n\nWelcome to CivicConnect! We're excited to have you join our community of active citizens.\n\nYou can start by:\n- Reporting issues in your district\n- Upvoting important issues\n- Contributing to your community\n\nBest regards,\nThe CivicConnect Team`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Welcome to CivicConnect!</h2>
                <p>Hello ${user.name},</p>
                <p>Welcome to CivicConnect! We're excited to have you join our community of active citizens.</p>
                <h3>You can start by:</h3>
                <ul>
                    <li>Reporting issues in your district</li>
                    <li>Upvoting important issues</li>
                    <li>Contributing to your community</li>
                </ul>
                <p>Best regards,<br>The CivicConnect Team</p>
            </div>
        `;

        return await this.sendEmail(user.email, subject, text, html);
    }

    async sendIssueResolvedEmail(user, issue) {
        const subject = 'Your Issue Has Been Resolved!';
        const text = `Hello ${user.name},\n\nGreat news! Your issue "${issue.title}" has been resolved.\n\nThank you for helping make your community better!\n\nBest regards,\nThe CivicConnect Team`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #27ae60;">Issue Resolved!</h2>
                <p>Hello ${user.name},</p>
                <p>Great news! Your issue <strong>"${issue.title}"</strong> has been resolved.</p>
                <p>Thank you for helping make your community better!</p>
                <p>Best regards,<br>The CivicConnect Team</p>
            </div>
        `;

        return await this.sendEmail(user.email, subject, text, html);
    }

    async sendPointsEarnedEmail(user, points, reason) {
        const subject = `You Earned ${points} Points!`;
        const text = `Hello ${user.name},\n\nCongratulations! You've earned ${points} points for ${reason}.\n\nKeep up the great work contributing to your community!\n\nBest regards,\nThe CivicConnect Team`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f39c12;">Points Earned!</h2>
                <p>Hello ${user.name},</p>
                <p>Congratulations! You've earned <strong>${points} points</strong> for ${reason}.</p>
                <p>Keep up the great work contributing to your community!</p>
                <p>Best regards,<br>The CivicConnect Team</p>
            </div>
        `;

        return await this.sendEmail(user.email, subject, text, html);
    }

    async sendSOSAlert(districtAdmin, sosContact, issue) {
        const subject = `Emergency Alert: ${sosContact.type.toUpperCase()} Required`;
        const text = `Emergency Alert!\n\nA citizen has reported an issue that may require ${sosContact.type} assistance:\n\nIssue: ${issue.title}\nDescription: ${issue.description}\nLocation: ${issue.location.address || 'See coordinates in app'}\n\nPlease contact the SOS service immediately:\nName: ${sosContact.name}\nPhone: ${sosContact.phoneNumber}\n\nThis is an automated alert from CivicConnect.`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e74c3c;">Emergency Alert!</h2>
                <p>A citizen has reported an issue that may require <strong>${sosContact.type}</strong> assistance:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3>Issue Details:</h3>
                    <p><strong>Title:</strong> ${issue.title}</p>
                    <p><strong>Description:</strong> ${issue.description}</p>
                    <p><strong>Location:</strong> ${issue.location.address || 'See coordinates in app'}</p>
                </div>
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3>SOS Contact Information:</h3>
                    <p><strong>Service:</strong> ${sosContact.name}</p>
                    <p><strong>Phone:</strong> ${sosContact.phoneNumber}</p>
                </div>
                <p style="color: #6c757d; font-size: 12px;">This is an automated alert from CivicConnect.</p>
            </div>
        `;

        return await this.sendEmail(districtAdmin.email, subject, text, html);
    }
}

module.exports = new EmailService();
