const Telegraf = require('telegraf')
const fs = require('fs');

//global vars
const token = fs.readFileSync('token', 'utf8').split("\n")[0];
const fullStopList = fs.readFileSync('full_stop.txt', 'utf8').split("\n");

const MAX_LENGTH_QUEUE = 10000
//bot -----------------
const bot = new Telegraf(token);
console.log("Start bot....")

let queue_counter = 0;

function deleteMsg(ctx) {
    ctx.deleteMessage()
    queue_counter--;
}


bot.start((ctx) => ctx.reply('Welcome!'))


bot.on('text', (ctx) => {
    let msg = ctx.message.text
    msg = msg.replace(/ +/g, ' ').trim();
    msg = msg.toLowerCase()
    for (let i = 0; i < fullStopList.length; ++i) {
        if (msg.includes(fullStopList[i])) {
            if (queue_counter < MAX_LENGTH_QUEUE) {
                setTimeout(deleteMsg, 60000, ctx);
                queue_counter++;
            }
            else {
                ctx.reply("memory overflow")
            }
            break
        }

    }
})
bot.launch();

//main logic ----------------------

