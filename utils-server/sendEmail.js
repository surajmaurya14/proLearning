const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");

const ses = new aws.SES({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    apiVersion: process.env.AWS_API_VERSION,
    region: process.env.AWS_REGION,
    defaultProvider,
});

const sendEmail = async (options) => {
    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: { ses, aws },
    });

    // send some mail
    await transporter.sendMail(
        {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
            // text: "I hope this message gets sent!",
            // ses: {
            //     // optional extra arguments for SendRawEmail
            //     Tags: [
            //         {
            //             Name: "tag_name",
            //             Value: "tag_value",
            //         },
            //     ],
            // },
        },
        (err, info) => {
            if (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
            // console.log(info.envelope);
            // console.log(info.messageId);
        }
    );
};

module.exports = sendEmail;
