import { loadingIndicator, hideLoading } from "../components/loading";
const API_URL = "https://notes-api.dicoding.dev/v2/notes";

const sector = document.querySelector('.sector-section')
const sampleList = document.getElementById("sampelList");
const archiveList = document.getElementById("archiveList");
console.log(archiveList);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const inputTitle = form.elements.title;
  const inputBody = form.elements.body;
  const submitButton = form.elements.submit;

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    const title = inputTitle.value;
    const body = inputBody.value;

    addNote(title, body);
    form.reset();
  });

  function noteBody(parentElement, notes, isArchived) {
    parentElement.innerHTML = "";
    notes.forEach((note) => {
      const noteItem = document.createElement("div");
      noteItem.id = "noteItem";
      noteItem.classList = "p-2 col-3 w-5 border border-info rounded";

      const title_note = document.createElement("h3");
      title_note.textContent = `${note.title}`;
      noteItem.appendChild(title_note);

      const body_note = document.createElement("p");
      body_note.textContent = `${note.body}`;
      noteItem.appendChild(body_note);

      const buttonParent = document.createElement("div");
      buttonParent.id = "buttonParent";

      noteItem.appendChild(buttonParent);

      if (isArchived) {
        const unarchiveButton = document.createElement("button");
        unarchiveButton.textContent = "kembalikan";
        unarchiveButton.classList = " btn btn-dark";
        unarchiveButton.addEventListener("click", function () {
          unarchiveNote(note.id);
        });
        buttonParent.appendChild(unarchiveButton);
      } else {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.classList = "btn btn-danger";
        deleteButton.addEventListener("click", function () {
          deleteNote(note.id);
        });
        buttonParent.appendChild(deleteButton);

        const archiveButton = document.createElement("button");
        archiveButton.textContent = "arsipkan";
        archiveButton.classList = "btn btn-warning";
        archiveButton.addEventListener("click", function () {
          archiveNote(note.id);
        });

        buttonParent.appendChild(archiveButton);
      }
      parentElement.appendChild(noteItem);
    });
  }

  async function fetchNote() {
    loadingIndicator(sector);
    try {
      const response = await fetch(API_URL);
      const { data } = await response.json();

      noteBody(sampleList, data, false);
    } catch (error) {
      hideLoading();
      console.error(error);
    } finally {
      hideLoading();
    }
  }

  async function fetchArchiveNotes() {
    // loadingIndicator(sampleList);
    try {
      const response = await fetch(`${API_URL}/archived`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      noteBody(archiveList, result.data, true);
    } catch (error) {
      console.error("Error saat mengambil data arsip: ", error);
      archiveList.innerHTML = "<p>Gagal memuat data arsip</p>";
    } finally {
      hideLoading();
    }
  }

  async function addNote(title, body) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });
      const result = await response.json();

      fetchNote();
    } catch (error) {
      console.error(`tidak dapat menambah Note: ${error}`);
    }
  }

  async function deleteNote(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      // Cek jika response sukses (status 200-299)
      if (response.ok) {
        console.log("Berhasil hapus");
        // Refresh daftar catatan dan arsip
        await Promise.all([fetchNote(), fetchArchiveNotes()]);
      } else {
        const errorText = await response.text();
        console.error("Gagal menghapus: ", errorText);
        alert(`Gagal menghapus catatan: ${errorText}`);
      }
    } catch (error) {
      console.error("Error saat menghapus catatan: ", error);
      alert("Terjadi kesalahan saat menghapus catatan");
    }
  }

  async function archiveNote(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/archive`, {
        method: "POST",
      });

      fetchNote();
      fetchArchiveNotes();
    } catch (error) {
      console.error("Error saat mengarsipkan catatan: ", error);
      alert("Terjadi kesalahan saat mengarsipkan catatan");
    }
  }

  async function unarchiveNote(id) {
    try {
      await fetch(`${API_URL}/${id}/unarchive`, {
        method: "POST",
      });

      console.log("Berhasil dikembalikan");
      fetchNote();
      fetchArchiveNotes();
    } catch (error) {
      console.error("Gagal mengembalikan note dari arsip", error);
    }
  }

  fetchNote();
  fetchArchiveNotes();
});
