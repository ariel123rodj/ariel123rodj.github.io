class Inventori:
    def __init__(self):
        self.items = {}

    def tambah_item(self, nama, jumlah):
        if nama in self.items:
            self.items[nama] += jumlah
        else:
            self.items[nama] = jumlah
        print(f"Item '{nama}' ditambahkan dengan jumlah {jumlah}.")

    def hapus_item(self, nama, jumlah):
        if nama in self.items:
            if self.items[nama] >= jumlah:
                self.items[nama] -= jumlah
                print(f"Item '{nama}' dihapus sebanyak {jumlah}.")
                if self.items[nama] == 0:
                    del self.items[nama]
                    print(f"Item '{nama}' telah dihapus dari inventori.")
            else:
                print(f"Tidak cukup jumlah untuk menghapus {jumlah} dari '{nama}'.")
        else:
            print(f"Item '{nama}' tidak ditemukan dalam inventori.")

    def tampilkan_inventori(self):
        if not self.items:
            print("Inventori kosong.")
        else:
            print("Inventori:")
            for nama, jumlah in self.items.items():
                print(f"- {nama}: {jumlah}")

def main():
    inventori = Inventori()

    while True:
        print("\nMenu:")
        print("1. Tambah Item")
        print("2. Hapus Item")
        print("3. Tampilkan Inventori")
        print("4. Keluar")
        
        pilihan = input("Pilih opsi (1-4): ")

        if pilihan == '1':
            nama = input("Masukkan nama item: ")
            jumlah = int(input("Masukkan jumlah item: "))
            inventori.tambah_item(nama, jumlah)
        
        elif pilihan == '2':
            nama = input("Masukkan nama item: ")
            jumlah = int(input("Masukkan jumlah item yang ingin dihapus: "))
            inventori.hapus_item(nama, jumlah)
        
        elif pilihan == '3':
            inventori.tampilkan_inventori()
        
        elif pilihan == '4':
            print("Keluar dari program.")
            break
        
        else:
            print("Pilihan tidak valid. Silakan coba lagi.")

if __name__ == "__main__":
    main()