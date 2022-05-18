const TeleBot = require('telebot');
const bot = new TeleBot('5302748541:AAElFZtIItpJctoBcIm7WUF8TR240RIb7qw');
const bot2 = new TeleBot('5384847799:AAEv0QgaZS6ohZ971MoFIKi6fJ3OLO27K-Y');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./papatestes.bd');
const date = new Date();
const datee = date.toLocaleDateString();
const express = require('express');
const { body, validationResult } = require('express-validator');
const http = require('http');
const app2 = express();
const server2 = http.createServer(app2);
var app = express()
const port = process.env.PORT || 5000;
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

console.log('date= '+ datee)









db.run(`CREATE TABLE IF NOT EXISTS papateste (
    cod INTEGER PRIMARY KEY,
    numero CHAR(40) NOT NULL,
    data CHAR(10) NOT NULL,
    revenda CHAR(100) NOT NULL

);`);


// const numero = '5531975354505'
// // const data = '05/05/2022'
// // const revenda = 'marcos'
// // db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[numero,data,revenda])

// ts = db.all("SELECT numero FROM papateste WHERE numero = ? ",[numero],(error, rows) => {
//     if (rows <1){


//     }else{
//     rows.forEach((row) => {
//         console.log(row);
//     })}
// })

bot.start();

const start=`⚠️ Para realizar a consulta digite o comando seguido do número que deseja consultar.

Por exemplo, para consultar o número 11994301254 envie o comando abaixo:

/consulta 11994301254`

bot.on('/start', (msg) => {
    msg.reply.text(start)
});


bot.on('/cadastro', (msg) => {
    const numero = msg.text.replace(/([^\d])+/gim, '');
    if (numero.length == 11) {
        const revenda = msg.from.first_name
        const data = date.toLocaleDateString();
        console.log(numero)
        console.log(data)
        console.log(revenda)

        
        db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[numero,data,revenda])
        msg.reply.text('☠️Cadastro realizado com sucesso!☠️\n\nUm papa teste cadastrado é um papa teste a menos🔪🔪☠️')

        // me avisar que foi feito um cadastro
        bot2.sendMessage(662325737,'(BOT antipapateste)\n\nCadastro realizado com sucesso!!\n\nnumero= '+numero+"\nrevenda= "+ revenda)



    }else{
        msg.reply.text('Numero errado!')
    }
});

bot.on('/consulta', (msg) => {
    const numero = msg.text.replace(/([^\d])+/gim, '');
    const revenda = msg.from.first_name
    // console.log('numero= ' + numero)

    teste = []
        if (numero.length == 11) { 
            console.log('numero valido')

            ts = db.all("SELECT * FROM papateste WHERE numero = ? ",[numero],(error, rows) => {

                if (rows <1){

                    msg.reply.text('Numero não cadastrado\n\nPode fazer o teste tranquilo 😜')
                }
                else{
                    console.log('Numero cadastrado= ' +numero )
                    rows.forEach((row) => {
                    // console.log(row.numero,row.data,row.revenda);
                    number = row.numero
                    testes = teste.push(`${row.data}     ${row.revenda}\n` )

                })    
                resposta = (`Dados Consultados:\n📲 Telefone: ${number}\n\nTestes realizados:\n\nData            Revenda/Servidor\n${teste}`)
                str = resposta.replaceAll(',', '')
                msg.reply.text(str)

                // me avisar que foi feito uma consulta 
                bot2.sendMessage(662325737,'(BOT antipapateste)\n\nConsulta realizada!!\n\nnumero= '+numero+" \nrevenda= "+ revenda)

            } 
        })

        
        }else{
                console.log("numero invalido")

                msg.reply.text("⚠️Numero invalido\n\nPor exemplo, para consultar o número 11912807412 envie o comando abaixo:\n\n/consulta 11912807412")
            }

})


// verificar numero  WEBHOOK
app.post('/consulta', [
body('numero').notEmpty()
], async (req, res) => {
const errors = validationResult(req).formatWith(({
msg
}) => {
return msg;
});
if (!errors.isEmpty()) {
return res.status(422).json({
    status: false,
    message: errors.mapped()
});
}

const numero = req.body.numero.replace(/([^\d])+/gim, '');

console.log('numero= ' + numero)
teste = []
    if (numero.length == 11) { 
        console.log('numero valido')
        ts = db.all("SELECT * FROM papateste WHERE numero = ? ",[numero],(error, rows) => {
            if (rows <1){
                res.status(201).json({
                    papateste: false,
                });
                // msg.reply.text('Numero não cadastrado\n\nPode fazer o teste tranquilo 😜')
            }
            else{
                console.log('Numero cadastrado')
                rows.forEach((row) => {
                number = row.numero
                testes = teste.push(`${row.data}     ${row.revenda}\n` )
                resposta = (`Dados Consultados:\n📲 Telefone: ${number}\n\nTestes realizados:\n\nData            Revenda/Servidor\n${teste}`)
                    })    
                    res.status(201).json({
                    papateste: true,
                    resposta: resposta});
                    bot2.sendMessage(662325737,'(WEBHOOK antipapateste) \n\nConsulta realizada!!\nnumero= '+numero)


        } 
    })

    
    }else{
        res.status(201).json({
            papateste: "invalido",
            
        });
            console.log("numero nao existe")
            // msg.reply.text("⚠️Numero invalido\n\nPor exemplo, para consultar o número 11912807412 envie o comando abaixo:\n\n/consulta 11912807412")
        }
})


// verificar numero  WEBHOOK
app.post('/cadastro', [
    body('numero').notEmpty(),
    body('revenda').notEmpty()
    ], async (req, res) => {
    const errors = validationResult(req).formatWith(({
    msg
    }) => {
    return msg;
    });
    if (!errors.isEmpty()) {
    return res.status(422).json({
        status: false,
        message: errors.mapped()
    });
    }

    const numero = req.body.numero.replace(/([^\d])+/gim, '');
    const data = datee
    const revenda = req.body.revenda
    teste = []

        if (numero.length == 11) { 
        db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[numero,data,revenda])
                res.status(201).json({
                    cadastro: true,
                    numero: numero,
                    data: data,
                    revenda: revenda
                });
                console.log('Cadastro realizado com sucesso!! numero= '+numero+" revenda= "+ revenda)

                bot2.sendMessage(662325737,'(WEBHOOK antipapateste) \n\nCadastro realizado com sucesso!!\n\nnumero= '+numero+" \nrevenda= "+ revenda)
            
    } else{
        console.log('erro ao cadastrar numero= '+numero+" revenda= "+ revenda)
        res.status(201).json({
            cadastro: "erro ao",
            });
    }    
    })

server.listen(port, function() {
console.log('Anti papa teste rodando na porta: ' + port);
});
