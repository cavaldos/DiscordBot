const os = require("os");

let THRESHOLD = 30;
const CHECK_INTERVAL = 30 * 60 * 1000;
let lastAlertTime = 0;
let alertCallback = null;

function getCPUInfo() {
  const cpus = os.cpus();
  const cpuCount = cpus.length;
  
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpuCount;
  const total = totalTick / cpuCount;
  const usage = 100 - (100 * idle / total);

  return {
    model: cpus[0].model,
    cores: cpuCount,
    usage: parseFloat(usage.toFixed(2)),
    speed: cpus[0].speed,
  };
}

function getSystemInfo() {
  const cpu = getCPUInfo();
  return `
🖥️ **Thông tin CPU:**
- Model: ${cpu.model}
- Số core: ${cpu.cores}
- Tốc độ: ${cpu.speed} MHz
- **Usage: ${cpu.usage}%**
  `.trim();
}

function checkCPU() {
  setImmediate(() => {
    const cpu = getCPUInfo();
    const now = Date.now();
    const cooldown = 5 * 60 * 1000;

    if (cpu.usage > THRESHOLD && now - lastAlertTime > cooldown) {
      lastAlertTime = now;
      const alertMsg = `⚠️ **CPU Alert!** \nCPU đang ở **${cpu.usage}%** (ngưỡng: ${THRESHOLD}%)`;
      
      if (alertCallback) {
        alertCallback(alertMsg);
      } else {
        console.log(alertMsg);
      }
    }
  });
}

function startMonitoring(onAlert, threshold = 30) {
  alertCallback = onAlert;
  THRESHOLD = threshold;
  console.log(`[CPU Monitor] Bắt đầu theo dõi CPU (ngưỡng: ${THRESHOLD}%, mỗi 30 phút)`);
  
  checkCPU();
  setInterval(checkCPU, CHECK_INTERVAL);
}

module.exports = { getCPUInfo, getSystemInfo, startMonitoring };