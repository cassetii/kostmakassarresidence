import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Referensi koleksi di Firestore
const acCollection = collection(db, "acData");

// Fungsi Tambah Data
document.getElementById("acForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const office = document.getElementById("office").value;
  const unit = document.getElementById("unit").value; // Digunakan untuk GPS
  const address = document.getElementById("address").value;

  if (!office || !unit || !address) {
    alert("Harap isi semua kolom.");
    return;
  }

  try {
    await addDoc(acCollection, { office, gps: unit, address, lastUpdated: new Date() });
    alert("Data berhasil ditambahkan!");
    fetchAndRenderData(); // Refresh data di tabel
    this.reset(); // Reset form input
  } catch (error) {
    console.error("Error menambah data:", error);
    alert("Gagal menambah data.");
  }
});

// Fungsi Render Data
async function fetchAndRenderData() {
  const tableBody = document.getElementById("summaryBody");
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum diisi ulang

  try {
    const querySnapshot = await getDocs(acCollection);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${data.office}</td>
          <td>
             <a href="https://www.google.com/maps?q=${data.gps}" target="_blank">
                 <i class="fas fa-map-marker-alt"></i>
             </a>
          </td>
          <td>${data.address}</td>
          <td>
            <button class="view-btn" data-id="${docSnap.id}">Lihat Data</button>
            <button class="delete-btn" data-id="${docSnap.id}">Hapus</button>
          </td>
      `;
      tableBody.appendChild(row);
    });

    attachViewButtonListener(); // Pasang event listener untuk tombol "Lihat Data"
    attachEventListeners(); // Pasang event listener untuk tombol Edit dan Hapus
  } catch (error) {
    console.error("Error mengambil data:", error);
    alert("Gagal mengambil data.");
  }
}

// Fungsi Tambah Detail
function appendDetailForm(row, id, data) {
  const detailsRow = document.createElement("tr");
  detailsRow.classList.add("details-row");
  detailsRow.innerHTML = `
      <td colspan="4">
          <form id="detailForm-${id}">
              <label>Model AC</label>
              <input type="text" id="model-${id}" value="${data.model || ""}" placeholder="Masukkan Model AC" />

              <label>Kapasitas AC</label>
              <input type="text" id="capacity-${id}" value="${data.capacity || ""}" placeholder="Masukkan Kapasitas AC" />

              <label>Titik GPS</label>
              <input type="text" id="gps-${id}" value="${data.gps || ""}" placeholder="Masukkan Titik GPS" />

              <label>Alamat</label>
              <textarea id="address-${id}" placeholder="Masukkan Alamat">${data.address || ""}</textarea>

              <button type="button" class="save-btn" data-id="${id}">Save</button>
          </form>
      </td>
  `;

  row.insertAdjacentElement("afterend", detailsRow);

  detailsRow.querySelector(".save-btn").addEventListener("click", async () => {
    const model = document.getElementById(`model-${id}`).value;
    const capacity = document.getElementById(`capacity-${id}`).value;
    const gps = document.getElementById(`gps-${id}`).value;
    const address = document.getElementById(`address-${id}`).value;

    try {
      const docRef = doc(db, "acData", id);
      await updateDoc(docRef, { model, capacity, gps, address });
      alert("Data berhasil diperbarui!");
      fetchAndRenderData();
    } catch (error) {
      console.error("Error menyimpan detail:", error);
      alert("Gagal menyimpan data.");
    }
  });
}

// Pasang Event Listener untuk tombol "Lihat Data"
function attachViewButtonListener() {
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const parentRow = button.closest("tr");

      const detailsRow = parentRow.nextElementSibling;
      if (detailsRow && detailsRow.classList.contains("details-row")) {
        detailsRow.remove(); // Hapus jika sudah ada
      } else {
        try {
          const docRef = doc(db, "acData", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            appendDetailForm(parentRow, id, docSnap.data());
          } else {
            alert("Data tidak ditemukan.");
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    });
  });
}

// Pasang Event Listener pada Tombol Edit dan Hapus
function attachEventListeners() {
  // Tombol Hapus
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      if (!confirm("Yakin ingin menghapus data ini?")) return;

      try {
        const docRef = doc(db, "acData", id);
        await deleteDoc(docRef);
        alert("Data berhasil dihapus!");
        fetchAndRenderData(); // Refresh data di tabel
      } catch (error) {
        console.error("Error menghapus data:", error);
        alert("Gagal menghapus data.");
      }
    });
  });
}

// Fungsi Pencarian
document.getElementById("search").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#summaryBody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchValue) ? "" : "none";
  });
});

// Load Data Saat Halaman Dibuka
fetchAndRenderData();
