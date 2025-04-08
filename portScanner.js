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

// Fungsi untuk mendapatkan subnet mask
function getSubnetMask(ip) {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && interfaceInfo.address === ip) {
        return interfaceInfo.netmask;
      }
    }
  }
  return '255.255.255.0';
}

// Fungsi untuk melakukan scan IP
async function scanIP(ip, subnetMask) {
  const ipParts = ip.split('.');
  const subnetParts = subnetMask.split('.');

  for (let i = 1; i < 255; i++) {
    const newIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${i}`;
    try {
      await pingIP(newIP);
      console.log(`IP ${newIP} aktif`);
    } catch (err) {
      // console.log(`IP ${newIP} tidak aktif`);
    }
  }
}

// Fungsi untuk melakukan ping IP
function pingIP(ip) {
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
    socket.connect(80, ip);
  });
}

// Jalankan fungsi scanIP
const localIP = getLocalIP();
const subnetMask = getSubnetMask(localIP);
scanIP(localIP, subnetMask);
