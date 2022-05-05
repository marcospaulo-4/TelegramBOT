const TeleBot = require('telebot');
const bot = new TeleBot('5302748541:AAElFZtIItpJctoBcIm7WUF8TR240RIb7qw');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./papatestes.bd');
const date = new Date();
const datee = date.toLocaleDateString();
console.log('date= '+ datee)

// const today = date.getDate()+"/"+ date.getMonth()+"/"+  date.getFullYear()
// console.log('date= '+ today)

db.run(`CREATE TABLE IF NOT EXISTS papateste (
    cod INTEGER PRIMARY KEY,
    numero CHAR(40) NOT NULL,
    data CHAR(10) NOT NULL,
    revenda CHAR(100) NOT NULL

);`);


const numero = '5531975354505'
// // const data = '05/05/2022'
// // const revenda = 'marcos'
// // db.run(`INSERT INTO papateste (numero,data,revenda) VALUES (?, ?, ? )`,[numero,data,revenda])

ts = db.all("SELECT numero FROM papateste WHERE numero = ? ",[numero],(error, rows) => {
    if (rows <1){

        console.log("nao existe")
    }else{
    rows.forEach((row) => {
        console.log(row);
    })}
})


// if (
//     db.all(`SELECT * FROM papateste WHERE numero = ?`, [numero], (error, rows) => {
//         rows.forEach((row) => {
//             console.log( 'teste= '+row.numero,row.data,row.revenda);
//         })
//     }) === undefined) {
//         console.log('nao tem cadatro')
//     }
 
//  catch ( Cannot read properties of undefined ) {
//     console.log('nao tem')
//  }
 



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


    }else{
        msg.reply.text('Numero errado!')
    }
});





bot.on('/consulta', (msg) => {
    const numero = msg.text.replace(/([^\d])+/gim, '');
    console.log('numero= ' + numero)
    teste = []
        if (numero.length == 11) { 
            console.log('numero valido')
            ts = db.all("SELECT * FROM papateste WHERE numero = ? ",[numero],(error, rows) => {
                if (rows <1){
                    console.log("nao existe")
                    msg.reply.text('Numero não cadastrado\n\nPode fazer o teste tranquilo 😜')
                }
                else{
                    console.log('Numero cadastrado')
                    rows.forEach((row) => {
                    console.log(row.numero,row.data,row.revenda);
                    number = row.numero
                    testes = teste.push(`${row.data}     ${row.revenda}\n` )


                    
                })    
                resposta = (`Dados Consultados:\n📲 Telefone: ${number}\n\nTestes realizados:\n\nData            Revenda/Servidor\n${teste}`)
                str = resposta.replaceAll(',', '')
                msg.reply.text(str)
            } 
        })

        
        }else{
                console.log("numero invalido")
                msg.reply.text("⚠️Numero invalido\n\nPor exemplo, para consultar o número 11912807412 envie o comando abaixo:\n\n/consulta 11912807412")
            }

})

 