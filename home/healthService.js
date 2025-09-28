const os = require('os');
const process = require('process');
const logger = require('../../utils/logger');

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const getCpuUsagePercentage = () => {
  const cpus = os.cpus();
  let user = 0, sys = 0, idle = 0;
  cpus.forEach(cpu => {
    user += cpu.times.user;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
  });
  const total = user + sys + idle;
  return {
    user: ((user / total) * 100).toFixed(2) + '%',
    system: ((sys / total) * 100).toFixed(2) + '%',
    idle: ((idle / total) * 100).toFixed(2) + '%',
  };
};

const getHealthStatus = async () => {
  try {
    const memoryUsage = process.memoryUsage();
    const cpuLoad = os.loadavg();
    const cpuUsage = getCpuUsagePercentage();
    return {
      success: true,
      message: 'Server health OK',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(0)} sec`,
      pid: process.pid,
      platform: os.platform(),
      release: os.release(),
      hostname: os.hostname(),
      arch: os.arch(),
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        speed: `${os.cpus()[0].speed} MHz`,
        usagePercent: cpuUsage,
        loadAvg: {
          '1min': cpuLoad[0].toFixed(2),
          '5min': cpuLoad[1].toFixed(2),
          '15min': cpuLoad[2].toFixed(2),
        },
      },
      memory: {
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        external: formatBytes(memoryUsage.external),
        arrayBuffers: formatBytes(memoryUsage.arrayBuffers),
        totalSystem: formatBytes(os.totalmem()),
        freeSystem: formatBytes(os.freemem()),
      },
      node: {
        version: process.version,
        execPath: process.execPath,
      },
    };
  } catch (error) {
    logger.error('HealthService: Failed to get server metrics', error);
    return {
      success: false,
      message: 'Failed to fetch health metrics',
      error: error.message,
    };
  }
};

module.exports = {
  getHealthStatus,
};
