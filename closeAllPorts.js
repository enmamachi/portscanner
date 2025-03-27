const { exec } = require('child_process');

function closeAllPorts() {
    // Mencari semua PID yang menggunakan port
    exec('netstat -ano', (error, stdout) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        const lines = stdout.trim().split('\n');
        const pids = new Set();

        // Mengambil semua PID dari output
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4) {
                const pid = parts[parts.length - 1];
                pids.add(pid);
            }
        });

        if (pids.size === 0) {
            console.log('Tidak ada port yang sedang digunakan.');
            return;
        }

        // Menghentikan setiap proses berdasarkan PID
        pids.forEach(pid => {
            exec(`taskkill /PID ${pid} /F`, (killError) => {
                if (killError) {
                    console.error(`Gagal menutup PID ${pid}: ${killError.message}`);
                } else {
                    console.log(`PID ${pid} berhasil ditutup.`);
                }
            });
        });
    });
}

closeAllPorts();
