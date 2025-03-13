let dataBarang = [];

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Ambil data dari data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      console.log("Data berhasil diambil:", data);
      dataBarang = data;
    })
    .catch(error => console.error("Gagal mengambil data:", error));
});

// Fungsi untuk menormalkan barcode jadi 13 digit (jika 11 atau 12 digit)
function normalizeBarcode(barcode) {
  barcode = barcode.toString();
  if (barcode.length === 11) {
    return "00" + barcode;
  } else if (barcode.length === 12) {
    return "0" + barcode;
  } else {
    return barcode;
  }
}

// Fungsi untuk mencari barang dan menampilkan popup
function cariBarang() {
  let keyword = document.getElementById("search").value.trim();
  let resultContent = document.getElementById("resultContent");
  let barcodeSvg = document.getElementById("barcode");
  
  // Bersihkan hasil pencarian sebelumnya
  resultContent.innerHTML = "";
  barcodeSvg.innerHTML = "";

  if (!keyword) {
    // Tampilkan pesan error langsung di popup
    resultContent.innerHTML = "<p>Masukkan PLU atau Barcode terlebih dahulu!</p>";
    showPopup();
    return;
  }

  let barang = dataBarang.find(item => item.PLU == keyword || item.BARCODE == keyword);

  if (barang) {
    // Barang ditemukan, tampilkan detail di popup
    resultContent.innerHTML = `
      <p><strong>Nama Barang:</strong> ${barang.DESKRIPSI}</p>
      <p><strong>PLU:</strong> ${barang.PLU}</p>
      <p><strong>Barcode:</strong> ${barang.BARCODE ? barang.BARCODE : "Tidak tersedia"}</p>
    `;
    
    // Jika ada barcode, tampilkan gambar barcode
    if (barang.BARCODE) {
      let normalized = normalizeBarcode(barang.BARCODE);
      setTimeout(() => {
        JsBarcode("#barcode", normalized, { format: "CODE128", displayValue: true });
      }, 100);
    }
    
    // Tampilkan popup
    showPopup();
  } else {
    // Barang tidak ditemukan
    resultContent.innerHTML = "<p>Barang tidak ditemukan!</p>";
    showPopup();
  }
}

// Fungsi untuk menampilkan popup
function showPopup() {
  console.log("showPopup() dipanggil!");
  document.getElementById("resultPopup").classList.add("active");
  document.getElementById("overlay").style.display = "block";
}


// Fungsi untuk menutup popup
function closePopup() {
  document.getElementById("resultPopup").classList.remove("active");
  document.getElementById("overlay").style.display = "none";
  
  // Bersihkan input pencarian
  document.getElementById("search").value = "";
  
  // Fokus kembali ke input pencarian
  document.getElementById("search").focus();
}

// Tutup popup dengan tombol Escape
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    closePopup();
  }
});
