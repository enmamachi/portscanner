const { exec } = require('child_process');

const port = 3000; // Ganti dengan nomor port yang ingin ditutup

function closePort(port) {
    // Mencari PID yang menggunakan port tertentu
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        const lines = stdout.trim().split('\n');
        if (lines.length === 0) {
            console.log(`Port ${port} tidak sedang digunakan.`);
            return;
        }

        // Mengambil PID dari output
        const pid = lines[0].trim().split(/\s+/).pop();
        console.log(`Menutup port ${port} dengan PID ${pid}...`);

        // Menghentikan proses berdasarkan PID
        exec(`taskkill /PID ${pid} /F`, (killError) => {
            if (killError) {
                console.error(`Gagal menutup port: ${killError.message}`);
                return;
            }
            console.log(`Port ${port} berhasil ditutup.`);
        });
    });
}

closePort(port);
