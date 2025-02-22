const exec = require('child_process').exec;
const commands = [
    'git add .',
    'git commit -m "add System bot"',
];

function runCommand(index) {
    if (index >= commands.length) {
        console.log("Hoàn thành tất cả lệnh.");
        return;
    }

    const command = commands[index];
    console.log(`Đang thực thi: ${command}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Có lỗi khi thực thi "${command}":`, error.message);
            console.error(stderr);
            process.exit(1);
        }
        console.log(stdout);
        runCommand(index + 1);
    });
}

// New function that wraps runCommand in a Promise and collects output
function runCommandPromise() {
    return new Promise((resolve, reject) => {
        let resultLogs = "";
        function run(index) {
            if (index >= commands.length) {
                resultLogs += "Hoàn thành tất cả lệnh.\n";
                return resolve(resultLogs);
            }
            const command = commands[index];
            resultLogs += `Đang thực thi: ${command}\n`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    resultLogs += `Có lỗi khi thực thi "${command}": ${error.message}\n`;
                    resultLogs += stderr;
                    return reject(resultLogs);
                }
                resultLogs += stdout + "\n";
                run(index + 1);
            });
        }
        run(0);
    });
}

module.exports = { runCommand, runCommandPromise };