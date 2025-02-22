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

runCommand(0);