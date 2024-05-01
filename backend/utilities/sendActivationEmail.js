// sendActivationEmail.js
const sendMail = require("./sendMail");

const activationEmailTemplate = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img+div {
            display: none;
        }

        @media (max-width:520px) {

            .desktop_hide table.icons-inner,
            .social_block.desktop_hide .social-table {
                display: inline-block !important;
            }

            .icons-inner {
                text-align: center;
            }

            .icons-inner td {
                margin: 0 auto;
            }

            .image_block div.fullWidth {
                max-width: 100% !important;
            }

            .mobile_hide {
                display: none;
            }

            .row-content {
                width: 100% !important;
            }

            .stack .column {
                width: 100%;
                display: block;
            }

            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }
        }
    </style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
        <tbody>
            <tr>
                <td>
                    <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                        role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4ecdc4;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content stack" align="center" border="0" cellpadding="0"
                                        cellspacing="0" role="presentation"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #4ecdc4; width: 500px; margin: 0 auto;"
                                        width="500">
                                        <tbody>
                                            <tr>
                                                <td class="column column-1" width="100%"
                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                    <table class="image_block block-1" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad" style="padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;">
                                                                <div class="alignment" align="center"
                                                                    style="line-height:10px">
                                                                    <div style="max-width: 125px;"><img
                                                                            src="https://i.ibb.co/P1Zt9cp/swift-cart.png"
                                                                            style="display: block; height: auto; border: 0; width: 100%;"
                                                                            width="125" alt="your-logo" title="your-logo"></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                        role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4ecdc4;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content stack" align="center" border="0" cellpadding="0"
                                        cellspacing="0" role="presentation"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px; margin: 0 auto;"
                                        width="500">
                                        <tbody>
                                            <tr>
                                                <td class="column column-1" width="100%"
                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                    <table class="image_block block-1" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad"
                                                                style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
                                                                <div class="alignment" align="center"
                                                                    style="line-height:10px">
                                                                    <div class="fullWidth"
                                                                        style="max-width: 350px;"><img
                                                                            src="https://media.istockphoto.com/id/1294084830/vector/businessmen-start-and-launch-rockets-new-business-projects-and-plans-new-beginnings.jpg?s=612x612&w=0&k=20&c=eEe8H_2_LWKPbJy3fuMKa0YGpT26nPA6uogXDF_kTlI="
                                                                            style="display: block; height: auto; border: 0; width: 100%;"
                                                                            width="350" alt="reset-password"
                                                                            title="reset-password"></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="heading_block block-2" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad"
                                                                style="text-align:center;width:100%;">
                                                                <h1 style="margin: 0; color: #fb0000; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 30px;">Account Activation</h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="paragraph_block block-3" width="100%" border="0"
                                                        cellpadding="10" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                                                    <p style="margin: 0;">Your account was created successfully. Activate your account by clicking the activation link below:</p>
                                                                    <p style="margin: 0;"><a href="{{activationUrl}}" style="color: #fb0000; text-decoration: underline;">Activate Your Account</a></p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="paragraph_block block-5" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                        <tr>
                                                            <td class="pad"
                                                                style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                <div
                                                                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:13px;line-height:150%;text-align:center;mso-line-height-alt:19.5px;">
                                                                    <p style="margin: 0; word-break: break-word;"><span>If you didn’t request to activate your account, simply ignore this email.</span></p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                        role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content stack" align="center" border="0" cellpadding="0"
                                        cellspacing="0" role="presentation"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;"
                                        width="500">
                                        <tbody>
                                            <tr>
                                                <td class="column column-1" width="100%"
                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                    <table class="paragraph_block block-1" width="100%" border="0"
                                                        cellpadding="15" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:10px;line-height:120%;text-align:center;mso-line-height-alt:12px;">
                                                                    <p style="margin: 0; word-break: break-word;"><span>This activation link will expire in 30 minutes. If you continue to have problems,</span><br><span>don't hesitate to get in touch with us at <a
                                                                                href="mailto:support@youremail.com"
                                                                                target="_blank" title="support@youremail.com"
                                                                                style="text-decoration: underline; color: #393d47;"
                                                                                rel="noopener">support@swiftcart.com</a>. <a
                                                                                href="Example.com" target="_blank"
                                                                                style="text-decoration: underline; color: #393d47;"
                                                                                rel="noopener">UNSUBSCRIBE</a></span></p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                        role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content stack" align="center" border="0" cellpadding="0"
                                        cellspacing="0" role="presentation"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px; margin: 0 auto;"
                                        width="500">
                                        <tbody>
                                            <tr>
                                                <td class="column column-1" width="100%"
                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                    <table class="html_block block-1" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;"
                                                                    align="center"><div style="height:30px;">&nbsp;</div></div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="social_block block-2" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad"
                                                                style="text-align:center;padding-right:0px;padding-left:0px;">
                                                                <div class="alignment" align="center">
                                                                    <table class="social-table" width="168px" border="0"
                                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                                                        <tr>
                                                                            <td
                                                                                style="padding:0 5px 0 5px;"><a
                                                                                    href="https://www.facebook.com/phoenixhublr"
                                                                                    target="_blank"><img
                                                                                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-default-gray/facebook@2x.png"
                                                                                        width="32" height="32" alt="Facebook"
                                                                                        title="Facebook"
                                                                                        style="display: block; height: auto; border: 0;"></a></td>
                                                                            <td
                                                                                style="padding:0 5px 0 5px;"><a
                                                                                    href="https://www.twitter.com/phoenixhublr"
                                                                                    target="_blank"><img
                                                                                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-default-gray/twitter@2x.png"
                                                                                        width="32" height="32" alt="Twitter"
                                                                                        title="Twitter"
                                                                                        style="display: block; height: auto; border: 0;"></a></td>
                                                                            <td
                                                                                style="padding:0 5px 0 5px;"><a
                                                                                    href="https://www.instagram.com/phoenixhublr"
                                                                                    target="_blank"><img
                                                                                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-default-gray/instagram@2x.png"
                                                                                        width="32" height="32"
                                                                                        alt="Instagram" title="Instagram"
                                                                                        style="display: block; height: auto; border: 0;"></a></td>
                                                                            <td
                                                                                style="padding:0 5px 0 5px;"><a
                                                                                    href="https://www.linkedin.com/phoenixhublr"
                                                                                    target="_blank"><img
                                                                                        src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-default-gray/linkedin@2x.png"
                                                                                        width="32" height="32" alt="LinkedIn"
                                                                                        title="LinkedIn"
                                                                                        style="display: block; height: auto; border: 0;"></a></td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="html_block block-3" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;"
                                                                    align="center"><div
                                                                        style="margin-top: 25px;border-top:1px dashed #D6D6D6;margin-bottom: 20px;"></div></div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="paragraph_block block-4" width="100%" border="0"
                                                        cellpadding="10" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="color:#C0C0C0;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                                    <p style="margin: 0; word-break: break-word;">Consumers
                                                                        (users) are advised to read the&nbsp;<a
                                                                            href="http://email.mg.jumia.com/c/eJwsjMFuwyAQRL9muUSJlgVi-8DBbeWeeuwHEJbYtAZaG1T17ytHPc1o5umx9QZx8IJddRa6J8DxdAKiHOpP2T6BCNR4DO-vR8cRuhcRrOzwOkijTC8Wq_nujAxGedMzDqjZG3m7onKkpWMS0RKSRkIihYPsL2zkYJD5Fu7XjqUBjWm-fLQU3cWXJFa71Pq1gxqBJqAp_f6fbQaaQj4_soYt7WeX-exL5lhjybvYrN_aXsIS8ha_W1CgcU4urg9xtc8lpZajdwd-eivc1vAXAAD__9llTvM"
                                                                            target="_blank"
                                                                            style="text-decoration: underline; color: #0068A5;"
                                                                            rel="noopener">Terms & Conditions</a>&nbsp;carefully.
                                                                    </p>
                                                                    <p style="margin: 0;">Police Academy Road, Paynesville
                                                                        City, Liberia / phoenixhublr@gmail.com /
                                                                        (+231) 881158457<a href="http://www.example.com"
                                                                            style="text-decoration: underline; color: #0068A5;"></a>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="html_block block-5" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;"
                                                                    align="center"><div style="height-top: 20px;">&nbsp;</div></div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table><!-- End -->
</body>

</html>
`;

const sendActivationEmail = (email, activationToken) => {
  const emailContent = activationEmailTemplate.replace(
    "{{activationUrl}}",
    activationToken
  );
  const mailOptions = {
    email: email,
    subject: "Activate your account",
    message: emailContent,
  };

  return sendMail(mailOptions);
};

module.exports = sendActivationEmail;
