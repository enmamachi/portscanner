const net = require('net');

const host = '127.0.0.1'; // Ganti dengan alamat IP target
const startPort = 1; // Port awal
const endPort = 65535; // Port akhir

function scanPort(port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2000); // Timeout 2 detik

        socket.on('connect', () => {
            console.log(`Port ${port} terbuka`);
            socket.destroy();
            resolve(port);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(port);
        });

        socket.on('error', () => {
            resolve(port);
        });

        socket.connect(port, host);
    });
}

async function scanPorts() {
    for (let port = startPort; port <= endPort; port++) {
        await scanPort(port);
    }
}

scanPorts().then(() => {
    console.log('Pemindaian selesai.');
});
