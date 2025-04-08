const net = require('net');
const os = require('os');

// Fungsi untuk mendapatkan IP lokal
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
  return '127.0.0.1';
}

// Fungsi untuk melakukan scan port
async function scanPort(ip, startPort, endPort) {
  for (let port = startPort; port <= endPort; port++) {
    try {
      await connectToPort(ip, port);
      console.log(`Port ${port} terbuka`);
    } catch (err) {
      // console.log(`Port ${port} tertutup`);
    }
  }
}

// Fungsi untuk melakukan koneksi ke port
function connectToPort(ip, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve();
    });
    socket.on('timeout', () => {
      socket.destroy();
      reject();
    });
    socket.on('error', () => {
      reject();
    });
    socket.connect(port, ip);
  });
}

// Jalankan fungsi scanPort
const localIP = getLocalIP();
const startPort = 1;
const endPort = 65535;
scanPort(localIP, startPort, endPort);
