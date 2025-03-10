let dataBarang = [];

// Ambil data barang dari file JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    console.log("Data berhasil diambil:", data);
    dataBarang = data;
  })
  .catch(error => console.error("Gagal mengambil data:", error));

// Fungsi menormalkan barcode jadi 13 digit (jika 11 atau 12 digit)
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

function cariBarang() {
  let keyword = document.getElementById("search").value.trim();
  let resultDiv = document.getElementById("result");
  let barcodeSvg = document.getElementById("barcode");

  // Bersihkan hasil sebelumnya
  resultDiv.innerHTML = "";
  barcodeSvg.innerHTML = "";

  if (!keyword) {
    resultDiv.innerHTML = "<p>Masukkan PLU atau Barcode terlebih dahulu!</p>";
    moveFormToTop();
    return;
  }

  // Cari barang di array dataBarang
  let barang = dataBarang.find(item => item.PLU == keyword || item.BARCODE == keyword);

  if (barang) {
    resultDiv.innerHTML = `
      <p><strong>Nama Barang:</strong> ${barang.DESKRIPSI}</p>
      <p><strong>Barcode:</strong> ${barang.BARCODE || "Tidak tersedia"}</p>
    `;

    // Jika ada barcode, normalisasi lalu tampilkan barcode
    if (barang.BARCODE) {
      let normalized = normalizeBarcode(barang.BARCODE);
      setTimeout(() => {
        JsBarcode("#barcode", normalized, { format: "CODE128", displayValue: true });
      }, 100);
      moveFormToBottom(); // Pindahkan form ke bawah
    } else {
      moveFormToTop(); // Tetap di atas
    }
  } else {
    resultDiv.innerHTML = "<p>Barang tidak ditemukan!</p>";
    moveFormToTop(); // Kembalikan form ke atas
  }
}

// Pindahkan form saran ke #bottomSection dan tampilkan container-nya
function moveFormToBottom() {
  const bottomSection = document.getElementById("bottomSection");
  const addFormContainer = document.getElementById("addFormContainer");
  if (bottomSection && addFormContainer) {
    bottomSection.style.display = "block";   // Tampilkan container bawah
    bottomSection.appendChild(addFormContainer);
  }
}

// Pindahkan form saran ke #topSection dan sembunyikan container bawah
function moveFormToTop() {
  const topSection = document.getElementById("topSection");
  const bottomSection = document.getElementById("bottomSection");
  const addFormContainer = document.getElementById("addFormContainer");
  if (topSection && addFormContainer && bottomSection) {
    bottomSection.style.display = "none";    // Sembunyikan container bawah
    topSection.appendChild(addFormContainer);
  }
}
