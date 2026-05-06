import nodemailer from 'nodemailer';

export const sendOrderEmail = async (userEmail, orderDetails, status) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

   
    const itemsHtml = orderDetails.orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"SkyStore 🚀" <noreply@skystore.com>',
        to: userEmail,
        subject: `Order Update: ${status}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #2c3e50; text-align: center;">Order Status: ${status}</h2>
                <p>Hello,</p>
                <p>Your order <strong>#${orderDetails._id}</strong> status has been updated to: <strong>${status}</strong>.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="text-align: left; padding: 10px;">Product</th>
                            <th style="text-align: left; padding: 10px;">Qty</th>
                            <th style="text-align: left; padding: 10px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right;">
                    <h3>Total Paid: $${orderDetails.totalPrice}</h3>
                </div>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">
                    Thank you for shopping with SkyStore! <br> Assiut, Egypt.
                </p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};