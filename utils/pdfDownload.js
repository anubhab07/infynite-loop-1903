const PDFDocument = require('pdfkit');
const fs = require('fs');
const qr_generation = require('./qr_generation');
var nodemailer = require('nodemailer');
var dateFormat = require('dateformat');
require('dotenv').config();
console.log(process.env.email_id)

var user_email= 'anubhab.mondal11@gmail.com';
const infyLogo = fs.readFileSync('../assets/images/infosys-logo.png');
var todayDate = dateFormat(new Date(), "dd-mmm-yyyy");
var date1 = "22 June 2019";
var textMarginLeft = 30;
var name = 'Anubhab';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_id,
        pass: process.env.email_pass
    }
});

generatePDF();
function generatePDF() {
    const op = qr_generation.getQrSvg();
    op.then(data => {

        /* To create PDF Attachment */
        const doc = new PDFDocument();
        // doc.pipe(fs.createWriteStream('output.pdf'));
        doc.image(infyLogo, 460, 20, {
            scale: 0.045,
            align: 'center',
            valign: 'right'
        });
        doc.moveDown();
        doc.fontSize(8).text(`Date: ${todayDate}`, 460, 120);
        doc.moveDown();
        doc.fontSize(10);
        doc.text(`Dear ${name},`, textMarginLeft, 150, {
            width:100,
            align: 'left'
        });
        doc.text(`  Your visit has been scheduled on ${date1}. Please carry this document along with any government approved ID proof with you. Please adhere to the rules inside the campus and co-operate with the security personnel for a smooth visit.`, textMarginLeft, 165, {
            align: 'justify'
        });
        doc.moveDown();
        // doc.text('Thank You.');
        doc.moveDown();
        doc.moveDown();
        doc.image(data,  {
            fit: [120,120],
            align: 'left',
            valign: 'left'
        }).text("12345678", textMarginLeft + 35, 350);
        doc.end();


        /* To write mail contents */
        const mailOptions = {
            from: process.env.email_id,
            to: user_email,
            subject: 'Gate pass for your visit in Infosys',
            attachments: [{
                filename: "infy-logo.png",
                content: infyLogo,
                cid: "infy-logo"
            }, 
            {
                filename: "Gatepass.pdf",
                content: doc
            }],
            html: `
                <div><img src="cid:infy-logo" width="150" height="60" style="float:right"></div>
                <br />
                <p>Dear ${name},</p>
                <p>  Your  Your visit has been scheduled on ${date1}.</p> 
                <p>  Please carry the attached document along with any government approved photo ID proof with you. Please adhere to the rules inside the campus and co-operate with the security personnel for a smooth visit.</p>
                <p>Infosys Ltd.</p>
                `
        };
        sendMail(mailOptions);
    }).catch(err => {
        console.log(err);
    });
}
// const op = qr_generation.getQrSvg();
// op.then(data => {
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream('output.pdf'));
//     doc.image(infyLogo, 460, 20, {
//         scale: 0.045,
//         align: 'center',
//         valign: 'right'
//     });
//     doc.fontSize(10);
//     doc.moveDown();
//     doc.text('Dear Visitor,', textMarginLeft, 100, {
//         width:100,
//         align: 'left'
//     });
//     doc.text(`  Your visit has been scheduled on ${date1}. Please carry this document along with any government approved ID proof with you. Please adhere to the rules inside the campus and co-operate with the security personnel for a smooth visit.`, textMarginLeft, 115, {
//         align: 'justify'
//     });
//     doc.moveDown();
//     // doc.text('Thank You.');
//     doc.moveDown();
//     doc.moveDown();
//     doc.image(data,  {
//         fit: [150,150],
//         align: 'left',
//         valign: 'left'
//     }).text("12345678", textMarginLeft + 40, 310);
//     doc.end();
// }).catch(err => {
//     console.log(err);
// });


function sendMail(mailOptions) {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}