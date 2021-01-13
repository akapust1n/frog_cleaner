var spawn = require('child_process').spawn;
var readline = require('readline');

// delay between restarts of the client in case of failure
const RESTARTING_DELAY = 1000;

// the main object for a process of telegram-cli
var tg;

function delFrogMsg(tg, data) {
    const num = data.split(" ")[0].toString().replace(/[^\x00-\x7F]/g, "")
    tg.stdin.write("delete_msg")
    tg.stdin.write(` ${num.toString()}\n`.replace(";1m", "")) // я не знаю откуда взялось 1m
}

function processMsg(tg, data) {
    if (tg == undefined || data == undefined)
        return

    try {
        if (data.includes("Жаба")) {
            setTimeout(delFrogMsg, 60000, tg, data)
        }

    } catch (err) {
        if (err.name == 'SyntaxError') {
            //console.log(err)
            // sometimes client sends not only json, plain text process is not
            // necessary, just output for easy debugging
            //console.log(data.toString());
        } else {
            throw err; // todo - respawn bot
        }
    }
}

function main() {
    tg = spawn('telegram-cli', ['-N', '-k', 'public_key', '-c', './config'], { shell: true },
        { stdio: ['ipc', 'pipe', process.stderr] });
    console.log("hey_start")
    cb = processMsg.bind(undefined, tg)
    readline.createInterface({ input: tg.stdout }).on('line', cb);
}

main();