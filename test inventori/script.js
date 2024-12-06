let inventori = {};

// Memuat inventori dari localStorage saat halaman dimuat
window.onload = function() {
    const storedInventori = localStorage.getItem('inventori');
    if (storedInventori) {
        inventori = JSON.parse(storedInventori);
        tampilkanInventari();
    }
};

function tambahItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value);

    if (itemName && itemQuantity > 0) {
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
        
        // Reset input fields
        document.getElementById('itemName').value = '';
        document.getElementById('itemQuantity').value = '';
        
        // Tampilkan inventari yang diperbarui dan simpan ke localStorage
        tampilkanInventari();
        simpanInventari();
    } else {
        alert("Nama item dan jumlah harus diisi dengan benar.");
    }
}

function hapusItem() {
    const removeItemName = document.getElementById('removeItemName').value;
    const removeItemQuantity = parseInt(document.getElementById('removeItemQuantity').value);

    if (removeItemName && removeItemQuantity > 0 && inventori[removeItemName]) {
        if (inventori[removeItemName].jumlah >= removeItemQuantity) {
            inventori[removeItemName].jumlah -= removeItemQuantity;

            if (inventori[removeItemName].jumlah === 0) {
                delete inventori[removeItemName]; // Hapus item jika jumlahnya 0
            } else {
                const tanggalDihapus = new Date().toLocaleString(); // Mendapatkan tanggal dan waktu saat dihapus
                inventori[removeItemName].tanggalDihapus = tanggalDihapus; // Update tanggal dihapus
            }
            document.getElementById('removeItemQuantity').value = '';
            tampilkanInventari();
            simpanInventari();
        } else {
            alert("Jumlah yang ingin dihapus melebihi jumlah yang ada.");
        }
    } else {
        alert("Nama item atau jumlah tidak valid.");
    }
}

function tampilkanInventari() {
    const inventoryList = document.getElementById('inventoryList');
    const removeItemSelect = document.getElementById('removeItemName');
    
    // Bersihkan daftar inventari dan dropdown
    inventoryList.innerHTML = '';
    removeItemSelect.innerHTML = '';

    for (const [nama, data] of Object.entries(inventori)) {
        // Menampilkan daftar inventari dengan tanggal ditambahkan dan terakhir dihapus
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        
        let textContent = `${nama}: ${data.jumlah} (Ditambahkan pada: ${data.tanggalDitambahkan})`;
        
        if (data.tanggalDihapus) {
            textContent += ` (Terakhir dihapus pada: ${data.tanggalDihapus})`;
        }

        li.textContent = textContent;
        inventoryList.appendChild(li);

        // Menambahkan opsi ke dropdown untuk penghapusan
        const option = document.createElement('option');
        option.value = nama;
        option.textContent = `${nama} (${data.jumlah})`;
        removeItemSelect.appendChild(option);
    }
}

// Fungsi untuk menyimpan inventari ke localStorage
function simpanInventari() {
    localStorage.setItem('inventori', JSON.stringify(inventori));
}

// Fungsi untuk mengunduh data inventari sebagai file teks
function unduhData() {
    let textData = "Nama Item, Jumlah, Tanggal Ditambahkan, Tanggal Dihapus\n";
    
    for (const [nama, data] of Object.entries(inventori)) {
        textData += `${nama}, ${data.jumlah}, ${data.tanggalDitambahkan}, ${data.tanggalDihapus || 'Belum Dihapus'}\n`;
    }

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventari.txt';
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
}