const fs = require('fs');
const XLSX = require('xlsx');

let inventori = {};

// Fungsi untuk memuat inventori dari localStorage (simulasi)
function loadInventori() {
    if (fs.existsSync('inventori.txt')) {
        const data = fs.readFileSync('inventori.txt', 'utf8');
        inventori = JSON.parse(data);
    } else {
        // Jika file tidak ada, buat file baru
        fs.writeFileSync('inventori.txt', JSON.stringify(inventori), 'utf8');
    }
}

// Fungsi untuk menyimpan inventori ke file teks
function saveInventori() {
    fs.writeFileSync('inventori.txt', JSON.stringify(inventori), 'utf8');
}

// Fungsi untuk menambah item ke inventori
function tambahItem(itemName, itemQuantity) {
    const tanggalDitambahkan = new Date().toLocaleString(); // Mendapatkan tanggal dan waktu saat ini

    // Tambah item ke inventori
    if (inventori[itemName]) {
        inventori[itemName].jumlah += itemQuantity; // Jika sudah ada, tambahkan jumlahnya
        inventori[itemName].tanggalDitambahkan = tanggalDitambahkan; // Update tanggal ditambahkan
    } else {
        inventori[itemName] = { 
            jumlah: itemQuantity, 
            tanggalDitambahkan: tanggalDitambahkan,
            tanggalDihapus: null // Inisialisasi tanggal dihapus sebagai null
        }; 
    }
    
    saveInventori();
}

// Fungsi untuk menghapus item dari inventori
function hapusItem(itemName, itemQuantity) {
    if (inventori[itemName]) {
        if (inventori[itemName].jumlah >= itemQuantity) {
            inventori[itemName].jumlah -= itemQuantity;

            if (inventori[itemName].jumlah === 0) {
                delete inventori[itemName]; // Hapus item jika jumlahnya 0
            } else {
                const tanggalDihapus = new Date().toLocaleString(); // Mendapatkan tanggal dan waktu saat dihapus
                inventori[itemName].tanggalDihapus = tanggalDihapus; // Update tanggal dihapus
            }
            saveInventori();
        } else {
            console.log("Jumlah yang ingin dihapus melebihi jumlah yang ada.");
        }
    } else {
        console.log("Item tidak ditemukan.");
    }
}

// Fungsi untuk mengimpor data dari file Excel
function importDataFromExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    jsonData.forEach(item => {
        if (item.Nama && item.Jumlah) { // Pastikan kolom ada
            tambahItem(item.Nama, item.Jumlah);
        }
    });
}

// Fungsi untuk membuat file Excel jika belum ada
function createExcelFile() {
    const worksheetData = [['Nama', 'Jumlah', 'Tanggal Ditambahkan', 'Tanggal Dihapus']];
    
    for (const [nama, data] of Object.entries(inventori)) {
        worksheetData.push([nama, data.jumlah, data.tanggalDitambahkan, data.tanggalDihapus || 'Belum Dihapus']);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventari');

    XLSX.writeFile(workbook, 'inventari.xlsx'); // Simpan sebagai inventari.xlsx
}

// Contoh penggunaan
loadInventori();
tambahItem('Buku', 5);
hapusItem('Buku', 2);

// Buat file Excel jika belum ada
createExcelFile();

console.log(inventori);