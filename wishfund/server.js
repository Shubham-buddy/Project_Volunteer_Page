const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public"));

app.use(cors({ origin: "*" }));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "guptaaayushman1@gmail.com ",
    pass: "mtvnguxfpogdbfzg",
  },
}); 

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});



app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: "guptaaayushman1@gmail.com", // receiver email,
      subject: `${data.subject}`,
      text: ` Name : ${data.name} \n Email: <${data.email}> \n Phone: ${data.phone} \n Address: ${data.address} \n Occupation :${data.occupation} \n Message: ${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        // res.status(200).send("Email successfully sent to recipient!");
        res.sendFile(process.cwd() + "/public/redirect.html");
        
      }
    });
  });
});

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/volunteer.html");
  // res.sendFile(process.cwd() + "/public/css/main.css");
  // res.sendFile(process.cwd() + "/public/css/util.css");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});