let dataBarang = [];
let searchInput = document.getElementById("search");
let searchHistoryContainer = document.getElementById("searchHistory");

// **Load data.json saat halaman dimuat**
document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data berhasil dimuat:", data);
      dataBarang = data;
    })
    .catch((error) => console.error("Gagal mengambil data:", error));

  loadSearchHistory(); // **Tampilkan history pencarian di awal**
});

// **Event saat input diklik (hanya tampilkan history, tanpa autocomplete)**
searchInput.addEventListener("focus", function () {
  showSearchHistory();
});

// **Event klik di luar search agar history hilang**
document.addEventListener("click", function (event) {
  if (!searchInput.contains(event.target) && !searchHistoryContainer.contains(event.target)) {
    searchHistoryContainer.style.display = "none";
  }
});

// **Fungsi menampilkan history pencarian**
function showSearchHistory() {
  searchHistoryContainer.innerHTML = "";
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history.forEach((item) => {
    let div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.innerHTML = `🕒 ${item}`;
    div.onclick = () => {
      searchInput.value = item;
      searchHistoryContainer.style.display = "none";
      cariBarang(item);
    };
    searchHistoryContainer.appendChild(div);
  });

  searchHistoryContainer.style.display = history.length ? "block" : "none";
}

// **Fungsi mencari barang**
function cariBarang(keyword) {
  let resultContent = document.getElementById("resultContent");
  let barcodeSvg = document.getElementById("barcode");

  keyword = keyword || searchInput.value.trim();
  if (!keyword) return;

  resultContent.innerHTML = "";
  barcodeSvg.innerHTML = "";

  let barang = dataBarang.find((item) => item.PLU == keyword || item.BARCODE == keyword);

  if (barang) {
    resultContent.innerHTML = `
      <p><strong>Nama Barang:</strong> ${barang.DESKRIPSI}</p>
      <p><strong>PLU:</strong> ${barang.PLU}</p>
      <p><strong>Barcode:</strong> ${barang.BARCODE || "Tidak tersedia"}</p>
    `;

    if (barang.BARCODE) {
      let normalized = normalizeBarcode(barang.BARCODE);
      setTimeout(() => {
        JsBarcode("#barcode", normalized, { format: "CODE128", displayValue: true });
      }, 100);
    }

    saveSearchHistory(keyword);
    showPopup();
  } else {
    resultContent.innerHTML = "<p>Barang tidak ditemukan!</p>";
    showPopup();
  }
}

// **Fungsi menyimpan history pencarian**
function saveSearchHistory(keyword) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history = history.filter((item) => item !== keyword);
  history.unshift(keyword);

  if (history.length > 5) history.pop();
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// **Fungsi normalisasi barcode (13 digit)**
function normalizeBarcode(barcode) {
  barcode = barcode.toString();
  return barcode.length === 11 ? "00" + barcode : barcode.length === 12 ? "0" + barcode : barcode;
}

// **Fungsi menampilkan popup**
function showPopup() {
  document.getElementById("resultPopup").classList.add("active");
  document.getElementById("overlay").style.display = "block";
}

// **Fungsi menutup popup**
function closePopup() {
  document.getElementById("resultPopup").classList.remove("active");
  document.getElementById("overlay").style.display = "none";
  searchInput.value = "";
  searchInput.focus();
}

// **Tutup popup dengan tombol Escape**
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closePopup();
});
