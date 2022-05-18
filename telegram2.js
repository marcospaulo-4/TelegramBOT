const TeleBot = require('telebot');
// const { Keyboard, Key } = require('telegram-keyboard')
const bot = new TeleBot({token: '5302748541:AAElFZtIItpJctoBcIm7WUF8TR240RIb7qw',    usePlugins: ['askUser']});
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

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = dd + '/' + mm + '/' + yyyy;

db.run(`CREATE TABLE IF NOT EXISTS papateste (
    cod INTEGER PRIMARY KEY,
    numero CHAR(40) NOT NULL,
    data CHAR(10) NOT NULL,
    revenda CHAR(100) NOT NULL

);`);



// ----------------  /COMMAND ANTI PAPA TESTE  ----------------


bot.on('/cadastro', (msg) => {
    const numero = msg.text.replace(/([^\d])+/gim, '');
    if (numero.length == 11) {
        const revenda = msg.from.first_name
        const data = today;
        console.log(numero)
        console.log(data)
        console.log(revenda)
        
        db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[numero,data,revenda])

        // me avisar que foi feito um cadastro
        bot2.sendMessage(662325737,'(BOT antipapateste)\n\nCadastro realizado com sucesso!!\n\nnumero= '+numero+"\nrevenda= "+ revenda)
        

        async function enviar(){
         await   msg.reply.text('☠️Cadastro realizado com sucesso!☠️\n\nUm papa teste cadastrado é um papa teste a menos🔪🔪☠️')

            let replyMarkup = bot.inlineKeyboard([
                [
                    bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                    bot.inlineButton('Consulta', {callback: 'consulta'})
                ]
             ]);
        
        return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
        }enviar() 


    }else{
        async function enviar(){
            await msg.reply.text('Numero errado!')

            let replyMarkup = bot.inlineKeyboard([
                [
                    bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                    bot.inlineButton('Consulta', {callback: 'consulta'})
                ]
             ]);
        
            return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
         
        }enviar() 
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
                async function enviar(){

                    await msg.reply.text(str)
                    let replyMarkup = bot.inlineKeyboard([
                        [
                            bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                            bot.inlineButton('Consulta', {callback: 'consulta'})
                        ]
                     ]);
                
                    return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
                 
                }enviar() 

                
                // me avisar que foi feito uma consulta 
                bot2.sendMessage(662325737,'(BOT antipapateste)\n\nConsulta realizada!!\n\nnumero= '+numero+" \nrevenda= "+ revenda)

            } 
        })

        
        }else{

                async function enviar(){
                    await  msg.reply.text("⚠️Numero invalido\n\nPor exemplo, para consultar o número 11912807412 envie o comando abaixo:\n\n/consulta 11912807412")
                    let replyMarkup = bot.inlineKeyboard([
                        [
                            bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                            bot.inlineButton('Consulta', {callback: 'consulta'})
                        ]
                     ]);
                    return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
                 
                }enviar() 
            
            }

})




// ----------------  BOTÃO ANTI PAPA TESTE  ----------------

// Inline buttons
bot.on('/start', msg => {
    async function enviar(){ 
    const start=`⚠️ Para realizar a consulta digite o comando seguido do número que deseja consultar.

Por exemplo, para consultar o número 11994301254 envie o comando abaixo:
        
/consulta 11994301254
        
Ou use os botões abaixo:`

        await  msg.reply.text(start)

        let replyMarkup = bot.inlineKeyboard([
            [
                bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                bot.inlineButton('Consulta', {callback: 'consulta'})
            ]
        ]);

        await bot.sendMessage(msg.from.id, 'Escolha uma opção:', {replyMarkup});
    }enviar()
});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    if ( msg.data == 'consulta'){
        bot.sendMessage(msg.from.id, 'Envie o numero a ser CONSULTADO:', {ask: 'consulta_telefone'})
    
    }else if(msg.data =='cadastro'){
        bot.sendMessage(msg.from.id, 'Envie o numero a ser CADASTRADO:', {ask: 'cadastro_telefone'})
    }
});

bot.on('ask.cadastro_telefone', msg => {
    const id = msg.from.id;
    const telefone = msg.text.replace(/([^\d])+/gim, '');

    if (telefone.length == 11){
        const revenda = msg.from.first_name
        const data = today;
        console.log(telefone)
        console.log(data)
        console.log(revenda)
        
        db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[telefone,data,revenda])
        // msg.reply.text('☠️Cadastro realizado com sucesso!☠️\n\nUm papa teste cadastrado é um papa teste a menos🔪🔪☠️')

        // me avisar que foi feito um cadastro
         bot2.sendMessage(662325737,'(BOT antipapateste)\n\nCadastro realizado com sucesso!!\n\nnumero= '+telefone+"\nrevenda= "+ revenda)

        async function enviar(){ 

            await bot.sendMessage(id, `☠️Cadastro realizado com sucesso!☠️\n\nUm papa teste cadastrado é um papa teste a menos🔪🔪☠️`);
     
             let replyMarkup = bot.inlineKeyboard([
                 [
                     bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                     bot.inlineButton('Consulta', {callback: 'consulta'})
                 ]
              ]);
         
              await  bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
        }
        enviar()
   
    }else{
        async function enviar(){
            await bot.sendMessage(id, `Numero Invalido!!\nVocê deve digitar no formato DDD + 9 + NUMERO, exemplo:  31984235432`);
    
            let replyMarkup = bot.inlineKeyboard([
                [
                    bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                    bot.inlineButton('Consulta', {callback: 'consulta'})
                ]
             ]);
        
            return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
         
        }enviar()    
    }

});

bot.on('ask.consulta_telefone', msg => {
    const id = msg.from.id;
    const telefone = msg.text.replace(/([^\d])+/gim, '');
    const revenda = msg.from.first_name
    teste = []

   if (telefone.length == 11){
       ts = db.all("SELECT * FROM papateste WHERE numero = ? ",[telefone],(error, rows) => {

        if (rows <1){
       
        async function enviar(){

          await  msg.reply.text('Numero não cadastrado\n\nPode fazer o teste tranquilo 😜')

            // me avisar que foi feito uma consulta 
            bot2.sendMessage(662325737,'(BOT antipapateste)\n\nConsulta realizada!!\n\nnumero= '+telefone+" \nrevenda= "+ revenda)
       
         let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                        bot.inlineButton('Consulta', {callback: 'consulta'})
                    ]
                ]);

            return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
        }enviar()





        }
        else{
            console.log('Numero cadastrado= ' +telefone )
            rows.forEach((row) => {
            // console.log(row.numero,row.data,row.revenda);
            number = row.numero
            testes = teste.push(`${row.data}     ${row.revenda}\n` )
        })    
        async function enviar(){

            resposta = (`Dados Consultados:\n📲 Telefone: ${number}\n\nTestes realizados:\n\nData            Revenda/Servidor\n${teste}`)
            str = resposta.replaceAll(',', '')
            await msg.reply.text(str)

            // me avisar que foi feito uma consulta 
            bot2.sendMessage(662325737,'(BOT antipapateste)\n\nConsulta realizada!!\n\nnumero= '+telefone+" \nrevenda= "+ revenda)
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                        bot.inlineButton('Consulta', {callback: 'consulta'})
                    ]
                ]);
                
            return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
        }enviar()
    } 
})


        
}else{
    // Ask user age
   
    async function enviar(){
        await bot.sendMessage(id, `Numero Invalido!!\nVocê deve digitar no formato DDD + 9 + NUMERO, exemplo:  31984235432`);

        let replyMarkup = bot.inlineKeyboard([
            [
                bot.inlineButton('Cadastrar', {callback: 'cadastro'}),
                bot.inlineButton('Consulta', {callback: 'consulta'})
            ]
         ]);
    
        return bot.sendMessage(msg.from.id, 'Escolha uma Opção:', {replyMarkup});
     
    }enviar()
   }
});

// ---------------- WEBHOOK ANTI PAPA TESTE  ----------------

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
    teste = []
        if (numero.length == 11) { 

            ts = db.all("SELECT * FROM papateste WHERE numero = ? ",[numero],(error, rows) => {
                if (rows <1){
                    res.status(201).json({
                        papateste: false,
                    });
                    // msg.reply.text('Numero não cadastrado\n\nPode fazer o teste tranquilo 😜')
                }
                else{
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
                papateste: "Numero invalido",
            });
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
            cadastro: "numero invalido",
            });
    }    
    })





server.listen(port, function() {
console.log('Anti papa teste rodando na porta: ' + port);
});

bot.start();
