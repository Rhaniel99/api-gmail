const nodemailer = require ('nodemailer');
const Mailgen = require ('mailgen');

const {EMAIL, PASSWORD} = require ('../env');

/** Teste de email */
const signup = async (req, res) => {

    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

    // send mail with defined transport object
    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Você foi registrado com sucesso por nós.", // plain text body
        html: "<b>Você foi registrado com sucesso por nós!</b>", // html body
    }

    transporter.sendMail(message).then((info) =>{
        return res.status(201).json({
            msg : "Você acabou de receber um email!",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("Logado com sucesso...!");
}

/** Mandando email para um usuário real */
const getbill = (req, res) => {
    const { userEmail } = req.body;

    let config = {
        service : 'gmail',
        auth :{
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name : "Bora",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : "Daily Tuition",
              intro: "Seu bora bill chegou!",
            table: {
                data : [
                    {
                    item : "Nodemailer Stack Book",
                    description : "Uma aplicação backend",
                    price : "$10.99",
                    }
                ]
            },
            outro : "Procurando por mais negocios"
        }
    }

    let mail = MailGenerator.generate(response);

    let message = {
        from : EMAIL,
        to : userEmail,
        subject: "Place Order",
        html: mail
    }

    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg: "Você enviou um email."
        })
    }).catch(error =>{
        return res.status(500).json({error})
    })


   
}

module.exports = {
    signup,
    getbill
}