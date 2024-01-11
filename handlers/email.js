const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: "handlebars",
    viewPath: __dirname + "/../views/emails",
  })
);

exports.sendEmailResetPassword = async (to, resetUrl) => {
  const opcionesEmail = {
    from: "DevJobs",
    to,
    subject: "Recuperar Password",
    template: "resetPass",
    context: {
      resetUrl,
    },
  };

  try {
    const info = await transporter.sendMail(opcionesEmail);
    console.log("Email enviado", info);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
