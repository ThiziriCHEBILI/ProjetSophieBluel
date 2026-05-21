// ========== SÉLECTEURS ==========
const backdrop = document.querySelector("#backdrop");
const btnModifier = document.querySelector("#btn-modifier");
const btnsClose = document.querySelectorAll(".btn-close");
const btnAddPhoto = document.querySelector("#btn-add-photo");
const btnBack = document.querySelector("#btn-back");
const modalGallery = document.querySelector("#modal-gallery");
const modalForm = document.querySelector("#modal-form");

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
      <button class="btn-delete">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    modalPhotos.appendChild(figure);
  });
}

export function initModal(works) {
  // Étape 1 : afficher les photos dans la modale
  displayModalPhotos(works);

  // Étape 2 : les événements
  btnModifier.addEventListener("click", openModal);

  btnsClose.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  btnAddPhoto.addEventListener("click", showFormView);
  btnBack.addEventListener("click", showGalleryView);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
}
