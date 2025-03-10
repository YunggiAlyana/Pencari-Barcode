let dataBarang = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    console.log("Data berhasil diambil:", data);
    dataBarang = data;
  })
  .catch(error => console.error("Gagal mengambil data:", error));

// Fungsi untuk menambahkan 0 agar jadi 13 digit
function normalizeBarcode(barcode) {
  barcode = barcode.toString();
  if (barcode.length === 11) {
    return "00" + barcode;
  } else if (barcode.length === 12) {
    return "0" + barcode;
  } else if (barcode.length === 13) {
    return barcode;
  } else {
    // Kembalikan apa adanya
    return barcode;
  }
}

function cariBarang() {
  let keyword = document.getElementById("search").value.trim();
  let resultDiv = document.getElementById("result");
  let barcodeSvg = document.getElementById("barcode");

  resultDiv.innerHTML = "";
  barcodeSvg.innerHTML = "";

  if (keyword === "") {
    resultDiv.innerHTML = "<p>Masukkan PLU atau Barcode terlebih dahulu!</p>";
    return;
  }

  // Debug: cek apa yang diketik user
  console.log("User mencari:", keyword);

  let barang = dataBarang.find(item => item.PLU == keyword || item.BARCODE == keyword);

  // Debug: cek barang
  console.log("Hasil pencarian:", barang);

  if (barang) {
    resultDiv.innerHTML = `
      <p><strong>Nama Barang:</strong> ${barang.DESKRIPSI}</p>
      <p><strong>Barcode:</strong> ${barang.BARCODE ? barang.BARCODE : "Tidak tersedia"}</p>
    `;

    if (barang.BARCODE) {
      let normalized = normalizeBarcode(barang.BARCODE);
      console.log("Barcode sebelum normalisasi:", barang.BARCODE);
      console.log("Barcode setelah normalisasi:", normalized);

      // Gunakan CODE128 agar fleksibel
      setTimeout(() => {
        JsBarcode("#barcode", normalized, { format: "CODE128", displayValue: true });
      }, 100);
    }
  } else {
    resultDiv.innerHTML = "<p>Barang tidak ditemukan!</p>";
  }
}
