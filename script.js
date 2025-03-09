let dataBarang = [];

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        dataBarang = data;
    })
    .catch(error => console.error("Gagal mengambil data:", error));

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

    let barang = dataBarang.find(item => item.PLU == keyword || item.BARCODE == keyword);

    if (barang) {
        resultDiv.innerHTML = `
            <p><strong>Nama Barang:</strong> ${barang.DESKRIPSI}</p>
            <p><strong>Barcode:</strong> ${barang.BARCODE ? barang.BARCODE : "Tidak tersedia"}</p>
        `;

        if (barang.BARCODE) {
            JsBarcode("#barcode", barang.BARCODE, { format: "EAN13", displayValue: true });
        }
    } else {
        resultDiv.innerHTML = "<p>Barang tidak ditemukan!</p>";
    }
}
