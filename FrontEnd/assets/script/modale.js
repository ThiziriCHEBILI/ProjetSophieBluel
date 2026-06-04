import { createCard } from "./main.js";

// Initialise la modale avec les travaux et les catégories
export function initModal(works, categories) {
  // ========== SÉLECTEURS ==========
  const backdrop = document.querySelector("#backdrop"); // Fond sombre derrière la modale
  const btnModifier = document.querySelector("#btn-modifier"); // Bouton "modifier" sur la page
  const btnsClose = document.querySelectorAll(".btn-close"); // Boutons de fermeture de la modale
  const btnAddPhoto = document.querySelector("#btn-add-photo"); // Bouton "ajouter une photo"
  const btnBack = document.querySelector("#btn-back"); // Bouton retour vers la galerie
  const modalGallery = document.querySelector("#modal-gallery"); // Vue galerie de la modale
  const modalForm = document.querySelector("#modal-form"); // Vue formulaire de la modale
  let inputFile = null; // Stocke le fichier image sélectionné par l'utilisateur

  // ========== FONCTIONS ==========

  // Ouvre la modale en affichant le backdrop
  function openModal() {
    backdrop.style.display = "flex";
  }

  // Ferme la modale et réinitialise la zone d'upload et le formulaire
  function closeModal() {
    backdrop.style.display = "none";
    showGalleryView();

    // Réinitialise le fichier sélectionné
    inputFile = null;

    // Remet la zone d'upload à son état initial
    const uploadZone = document.querySelector("#upload-zone");
    uploadZone.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <button id="btn-upload">+ Ajouter photo</button>
    <p>jpg, png : 4mo max</p>
  `;

    // Réattache le listener sur le nouveau bouton d'upload
    document.querySelector("#btn-upload").addEventListener("click", () => {
      selectImage();
    });

    // Vérifie l'état du formulaire après réinitialisation
    checkForm();
  }

  // Affiche la vue formulaire et cache la galerie
  function showFormView() {
    modalGallery.style.display = "none";
    modalForm.style.display = "block";
    btnBack.style.display = "block"; // Affiche le bouton retour
  }

  // Affiche la vue galerie et cache le formulaire
  function showGalleryView() {
    modalGallery.style.display = "block";
    modalForm.style.display = "none";
    btnBack.style.display = "none";
    document.querySelector("#form-add").reset();
    document.querySelector("#upload-zone").innerHTML = `
    <i class="fa-regular fa-image"></i>
    <button id="btn-upload">+ Ajouter photo</button>
    <p>jpg, png : 4mo max</p>
  `;

    document.querySelector("#btn-upload").addEventListener("click", () => {
      selectImage();
    });
    inputFile = null;
  
  }

  // Affiche les photos dans la galerie de la modale avec un bouton de suppression
  function displayModalPhotos(works) {
    const modalPhotos = document.querySelector("#modal-photos");
    modalPhotos.innerHTML = ""; // Vide la galerie avant de la remplir

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <button class="btn-delete" data-id="${work.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      const btnDelete = figure.querySelector(".btn-delete");

      // Supprime le travail au clic sur la corbeille
      btnDelete.addEventListener("click", async () => {
        const id = btnDelete.dataset.id;
        const token = localStorage.getItem("token");

        // Envoi de la requête DELETE à l'API
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Supprime la figure dans la galerie de la modale
          figure.remove();
          // Supprime aussi la figure dans la galerie principale
          const figureGallery = document.querySelector(
            `.gallery figure[data-id="${id}"]`,
          );
          figureGallery.remove();
        }
      });

      modalPhotos.appendChild(figure);
    });
  }

  // Remplit le select des catégories avec une option vide par défaut
  function displayCategories() {
    const select = document.querySelector("#category");

    // Option vide sélectionnée par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    select.appendChild(defaultOption);

    // Ajoute une option pour chaque catégorie
    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      select.appendChild(option);
    });
  }

  // Ouvre le sélecteur de fichier et affiche la prévisualisation de l'image
  function selectImage() {
    inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/jpeg, image/png"; // Accepte uniquement jpg et png
    inputFile.click(); // Déclenche l'ouverture du sélecteur de fichier

    inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];
      const url = URL.createObjectURL(file); // Crée une URL temporaire pour la prévisualisation

      // Remplace le contenu de la zone d'upload par la prévisualisation
      const uploadZone = document.querySelector("#upload-zone");
      uploadZone.innerHTML = "";

      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "170px";
      img.style.objectFit = "contain";
      img.style.cursor = "pointer"; // Indique que l'image est cliquable pour la changer

      // Permet de cliquer sur l'image pour changer le fichier
      img.addEventListener("click", openFilePicker);

      uploadZone.appendChild(img);
      checkForm(); // Vérifie si le formulaire est complet
    });
  }

  // Rouvre le sélecteur de fichier pour changer l'image
  function openFilePicker() {
    inputFile.click();
  }

  // Vérifie si tous les champs sont remplis et active/désactive le bouton Valider
 function checkForm() {
  const title = document.querySelector("#title").value;
  const category = document.querySelector("#category").value;
  const image = inputFile ? inputFile.files[0] : null;
  const btnSubmit = document.querySelector("#form-add input[type='submit']");
  const formError = document.querySelector("#form-error");

  if (title !== "" && category !== "" && image) {
    btnSubmit.classList.add("actif");
    btnSubmit.disabled = false;
    formError.textContent = "";
  } else {
    btnSubmit.classList.remove("actif");
    btnSubmit.disabled = true;
    
    // affiche le message seulement si l'utilisateur a commencé à remplir
    if (title !== "" || category !== "" || image) {
      formError.textContent = "Veuillez remplir tous les champs.";
    } else {
      formError.textContent = "";
    }
  }
}

  // Envoie le nouveau travail à l'API et met à jour le DOM
  async function submitForm() {
    const token = localStorage.getItem("token");

    // Prépare les données du formulaire pour l'envoi
    const formData = new FormData();
    formData.append("image", inputFile.files[0]);
    formData.append("title", document.querySelector("#title").value);
    formData.append("category", document.querySelector("#category").value);

    // Envoi de la requête POST à l'API
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();

      // 1. Ajouter dans la galerie principale
      const gallery = document.querySelector(".gallery");
      gallery.appendChild(createCard(newWork));

      // 2. Ajouter dans la galerie de la modale
      works.push(newWork);
      displayModalPhotos(works);

      // 3. Réinitialiser le formulaire
      document.querySelector("#title").value = "";
      document.querySelector("#category").value = "";
      inputFile = null;

      // 4. Remettre la zone d'upload à son état initial
      document.querySelector("#upload-zone").innerHTML = `
      <i class="fa-regular fa-image"></i>
      <button id="btn-upload">+ Ajouter photo</button>
      <p>jpg, png : 4mo max</p>
    `;

      // 5. Réenregistrer le clic sur le nouveau bouton upload
      document.querySelector("#btn-upload").addEventListener("click", () => {
        selectImage();
      });

      // 6. Réinitialiser le bouton valider
      const btnSubmit = document.querySelector(
        "#form-add input[type='submit']",
      );
      btnSubmit.classList.remove("actif");
      btnSubmit.disabled = true;
    }
  }

  // ========== INITIALISATION ==========
  displayModalPhotos(works); // Affiche les photos dans la galerie de la modale
  displayCategories(); // Remplit le select des catégories
  btnModifier.addEventListener("click", openModal); // Ouvre la modale au clic sur modifier
  btnsClose.forEach((btn) => btn.addEventListener("click", closeModal)); // Ferme la modale au clic sur la croix
  btnAddPhoto.addEventListener("click", showFormView); // Affiche le formulaire au clic sur ajouter une photo
  btnBack.addEventListener("click", showGalleryView); // Retourne à la galerie au clic sur la flèche

  // Ferme la modale en cliquant en dehors
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Ouvre le sélecteur de fichier au clic sur le bouton upload
  const btnUpload = document.querySelector("#btn-upload");
  btnUpload.addEventListener("click", () => {
    selectImage();
  });

  // Empêche le rechargement de la page à la soumission du formulaire
  document.querySelector("#form-add").addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm();
  });

  // Désactive le bouton valider par défaut au chargement
  const btnSubmit = document.querySelector("#form-add input[type='submit']");
  btnSubmit.disabled = true;

  // Vérifie le formulaire en temps réel à chaque modification
  document.querySelector("#title").addEventListener("input", checkForm);
  document.querySelector("#category").addEventListener("change", checkForm);
}
