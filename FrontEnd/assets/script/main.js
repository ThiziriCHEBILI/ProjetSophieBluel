import { fetchData } from "../../api/fonction.js";
import { initModal } from "./modale.js";

// Crée une carte (figure) pour un travail et la retourne
export function createCard(work) {
  const figure = document.createElement("figure");
  figure.dataset.id = work.id; // ajouter cette ligne
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
  `;
  return figure;
}
// Crée un bouton de filtre pour une catégorie
function createFilterButton(categorie) {
  const button = document.createElement("button");
  button.textContent = categorie.name;
  return button;
}

// Affiche les travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach((work) => {
    gallery.appendChild(createCard(work));
  });
}

// Crée et affiche les boutons de filtre par catégorie
function displayFilters(categories, works) {
  const filters = document.querySelector("#filters");
   // Bouton "Tous" actif par défaut
  const boutonTous = document.createElement("button");
  boutonTous.textContent = "Tous";
  boutonTous.classList.add("actif");
  boutonTous.addEventListener("click", () => {
    setActiveButton(boutonTous);
    displayWorks(works);
  });
  filters.appendChild(boutonTous);
  // Boutons pour chaque catégorie
  categories.forEach((categorie) => {
    const bouton = createFilterButton(categorie);
    bouton.addEventListener("click", () => {
      setActiveButton(bouton);
       // Filtre les travaux selon la catégorie sélectionnée
      const projetsFiltres = works.filter(
        (work) => work.categoryId === categorie.id,
      );
      displayWorks(projetsFiltres);
    });
    filters.appendChild(bouton);
  });
}
// Met en surbrillance le bouton de filtre actif
function setActiveButton(bouton) {
  document.querySelectorAll("#filters button").forEach((btn) => {
    btn.classList.remove("actif");
  });
  bouton.classList.add("actif");
}
// Affiche le mode édition si l'utilisateur est connecté
function displayEditionMode() {
  const bandeau = document.querySelector("#bandeau-edition");
  bandeau.style.display = "flex";
  const navLogin = document.querySelector("#nav-login");
    // Remplace "login" par "logout" et gère la déconnexion
  navLogin.textContent = "logout";
  navLogin.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
    // Cache les filtres en mode édition
  document.querySelector("#filters").style.display = "none";
   // Affiche le bouton modifier
  const btnModifier = document.querySelector("#btn-modifier");
  btnModifier.style.display = "block";
}

// Valide le formulaire de contact et affiche un message à l'utilisateur
function validateContact() {
  const form = document.querySelector("#contact form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();
    const contactMessage = document.querySelector("#contact-message");

    if (name === "" || email === "" || message === "" || !email.includes("@")) {
      contactMessage.style.color = "red";
      contactMessage.textContent = "Formulaire incomplet";
    } else {
      contactMessage.style.color = "green";
      contactMessage.textContent = "Message envoyé !";
      form.reset();
    }
  });
}


// Fonction principale : récupère les données et initialise la page
async function main() {
  const works = await fetchData("works");
  displayWorks(works);
  const categories = await fetchData("categories");
  displayFilters(categories, works);

 // Utilisateur connecté : mode édition
  const token = localStorage.getItem("token");
  if (token) {
    displayEditionMode();
    initModal(works, categories);
  } else {
     // Utilisateur non connecté : redirige vers login au clic
    const navLogin = document.querySelector("#nav-login");
    navLogin.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  validateContact();
}
// Lance la fonction principale au chargement du DOM
document.addEventListener("DOMContentLoaded", main);