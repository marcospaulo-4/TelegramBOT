const TeleBot = require('telebot');
// const bot = new TeleBot('5235748620:AAHM6a9QUzMknVUE7OKoCF-twSTFC59L11U');


const bot = new TeleBot({
    token: '5235748620:AAHM6a9QUzMknVUE7OKoCF-twSTFC59L11U',
    webhook: {
        // Self-signed certificate:
        // key: './key.pem',
        // cert: './cert.pem',
        url: 'https://wapp.bestplayflix.com:8000/message',
        host: '0.0.0.0',
        port: 8000
    }
});

bot.on('text', msg => bot.sendMessage(msg.from.id, msg.text));

bot.start();