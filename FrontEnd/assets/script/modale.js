import { createCard } from "./main.js";
export function initModal(works, categories) {
  // ========== SÉLECTEURS ==========
  const backdrop = document.querySelector("#backdrop");
  const btnModifier = document.querySelector("#btn-modifier");
  const btnsClose = document.querySelectorAll(".btn-close");
  const btnAddPhoto = document.querySelector("#btn-add-photo");
  const btnBack = document.querySelector("#btn-back");
  const modalGallery = document.querySelector("#modal-gallery");
  const modalForm = document.querySelector("#modal-form");
  let inputFile = null;

  // ========== FONCTIONS ==========
  function openModal() {
    backdrop.style.display = "flex";
  }

  function closeModal() {
    backdrop.style.display = "none";
  }

  function showFormView() {
    modalGallery.style.display = "none";
    modalForm.style.display = "block";
    btnBack.style.display = "block";
  }

  function showGalleryView() {
    modalGallery.style.display = "block";
    modalForm.style.display = "none";
    btnBack.style.display = "none";
  }

  function displayModalPhotos(works) {
    const modalPhotos = document.querySelector("#modal-photos");
    modalPhotos.innerHTML = "";

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <button class="btn-delete" data-id="${work.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      const btnDelete = figure.querySelector(".btn-delete");

      btnDelete.addEventListener("click", async () => {
        const id = btnDelete.dataset.id;
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          figure.remove();
          const figureGallery = document.querySelector(
            `.gallery figure[data-id="${id}"]`,
          );
          figureGallery.remove();
        }
      });

      modalPhotos.appendChild(figure);
    });
  }

  function displayCategories() {
    const select = document.querySelector("#category");
    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      select.appendChild(option);
    });
  }

  function selectImage() {
    inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/jpeg, image/png";
    inputFile.click();

    inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];
      const url = URL.createObjectURL(file);

      const uploadZone = document.querySelector("#upload-zone");
      uploadZone.innerHTML = "";

      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "170px";
      img.style.objectFit = "contain";

      uploadZone.appendChild(img);
    });
  }

  function validateForm() {
    const title = document.querySelector("#title").value;
    const category = document.querySelector("#category").value;
    const image = inputFile ? inputFile.files[0] : null;

    if (title === "" || category === "" || !image) {
      alert("Veuillez remplir tous les champs !");
      return false;
    }
    return true;
  }

  async function submitForm() {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", inputFile.files[0]);
    formData.append("title", document.querySelector("#title").value);
    formData.append("category", document.querySelector("#category").value);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();

      // 1. Ajouter dans la galerie de index.html
      const gallery = document.querySelector(".gallery");
      gallery.appendChild(createCard(newWork));

      // 2. Ajouter dans la galerie de la modale
      works.push(newWork);
      displayModalPhotos(works);

      alert("Photo ajoutée avec succès !");
      // Réinitialiser le formulaire
      document.querySelector("#title").value = "";
      document.querySelector("#category").value = "";
      inputFile = null;

      // Remettre la zone d'upload comme au début
      document.querySelector("#upload-zone").innerHTML = `
  <i class="fa-regular fa-image"></i>
  <button id="btn-upload">+ Ajouter photo</button>
  <p>jpg, png : 4mo max</p>
`;

      // Réenregistrer le clic sur le nouveau bouton upload
      document.querySelector("#btn-upload").addEventListener("click", () => {
        selectImage();
      });
    } else {
      alert("Une erreur est survenue !");
    }
  }
  // ========== INITIALISATION ==========
  displayModalPhotos(works);
  displayCategories();
  btnModifier.addEventListener("click", openModal);
  btnsClose.forEach((btn) => btn.addEventListener("click", closeModal));
  btnAddPhoto.addEventListener("click", showFormView);
  btnBack.addEventListener("click", showGalleryView);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  const btnUpload = document.querySelector("#btn-upload");
  btnUpload.addEventListener("click", () => {
    selectImage();
  });
  document.querySelector("#form-add").addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm();
  });
}
