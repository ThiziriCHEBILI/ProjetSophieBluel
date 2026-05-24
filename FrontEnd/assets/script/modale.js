export function initModal(works) {
  // ========== SÉLECTEURS ==========
  const backdrop = document.querySelector("#backdrop");
  const btnModifier = document.querySelector("#btn-modifier");
  const btnsClose = document.querySelectorAll(".btn-close");
  const btnAddPhoto = document.querySelector("#btn-add-photo");
  const btnBack = document.querySelector("#btn-back");
  const modalGallery = document.querySelector("#modal-gallery");
  const modalForm = document.querySelector("#modal-form");
 
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


  // ========== INITIALISATION ==========
  displayModalPhotos(works);
 
  btnModifier.addEventListener("click", openModal);
  btnsClose.forEach((btn) => btn.addEventListener("click", closeModal));
  btnAddPhoto.addEventListener("click", showFormView);
  btnBack.addEventListener("click", showGalleryView);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  
}

