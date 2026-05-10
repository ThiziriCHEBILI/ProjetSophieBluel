// VARIABLE GLOBALE
// On la déclare ici pour qu'elle soit accessible
// dans toutes les fonctions du code
let tousLesProjets = []
// FONCTION : afficherProjets
// Reçoit un tableau de projets et les affiche dans la galerie
// On l'appelle au chargement et à chaque clic sur un filtre
function afficherProjets(projets) {

  // On sélectionne la div class="gallery" dans le HTML
  const gallery = document.querySelector(".gallery")

  // On vide la galerie avant d'afficher les nouveaux projets
  // Evite les doublons quand on change de filtre
  gallery.innerHTML = ""

  // On boucle sur chaque projet du tableau reçu en paramètre
  projets.forEach(projet => {

    // On crée une balise <figure> pour chaque projet
    const figure = document.createElement("figure")

    // On remplit la figure avec l'image et le titre
    // ${} permet d'insérer les valeurs du JSON directement dans le HTML
    figure.innerHTML = `
      <img src="${projet.imageUrl}" alt="${projet.title}">
      <figcaption>${projet.title}</figcaption>
    `

    // On ajoute la carte dans la galerie
    gallery.appendChild(figure)
  })
}

// -------------------------------------------------------
// FONCTION : mettreAJourBoutonActif
// Met le bouton cliqué en vert et les autres en blanc
// Reçoit le bouton cliqué en paramètre
// -------------------------------------------------------
function mettreAJourBoutonActif(boutonClique) {

  // On sélectionne tous les boutons et on enlève la classe "actif"
  // forEach boucle sur chaque bouton et supprime la classe actif
  document.querySelectorAll("#filters button").forEach(btn => {
    btn.classList.remove("actif")
  })

  // On ajoute la classe "actif" seulement au bouton cliqué
  // Ce qui le met en vert grâce au CSS
  boutonClique.classList.add("actif")
}

// -------------------------------------------------------
// FETCH 1 : Récupération des projets
// On demande au serveur la liste de tous les projets
// -------------------------------------------------------
fetch("http://localhost:5678/api/works")

  // On attend la réponse et on la convertit en JSON
  .then(response => response.json())

  .then(works => {

    // On stocke les projets dans la variable globale
    // pour pouvoir les utiliser dans les boutons de filtre
    tousLesProjets = works

    // On affiche tous les projets par défaut au chargement
    afficherProjets(tousLesProjets)
  })

// -------------------------------------------------------
// FETCH 2 : Récupération des catégories
// On demande au serveur la liste des catégories
// pour créer les boutons de filtre dynamiquement
// -------------------------------------------------------
fetch("http://localhost:5678/api/categories")

  // On attend la réponse et on la convertit en JSON
  .then(response => response.json())

  .then(categories => {

    // On sélectionne le conteneur des boutons dans le HTML
    const filters = document.querySelector("#filters")

    // --- Bouton "Tous" ---
    // On le crée manuellement car il n'est pas dans l'API
    const boutonTous = document.createElement("button")
    boutonTous.textContent = "Tous"

    // Il est actif par défaut au chargement de la page
    boutonTous.classList.add("actif")

    // Au clic sur "Tous" :
    boutonTous.addEventListener("click", () => {

      // On met le bouton "Tous" en vert et les autres en blanc
      mettreAJourBoutonActif(boutonTous)

      // On affiche tous les projets sans filtre
      afficherProjets(tousLesProjets)
    })

    // On ajoute le bouton "Tous" dans le conteneur
    filters.appendChild(boutonTous)

    // --- Boutons catégories ---
    // On boucle sur chaque catégorie reçue de l'API
    // (Objets, Appartements, Hotels & restaurants)
    categories.forEach(categorie => {

      // On crée un bouton pour chaque catégorie
      const bouton = document.createElement("button")

      // Le texte = le nom de la catégorie
      bouton.textContent = categorie.name

      // Au clic sur un bouton catégorie :
      bouton.addEventListener("click", () => {

        // On met ce bouton en vert et les autres en blanc
        mettreAJourBoutonActif(bouton)

        // On filtre les projets dont le categoryId
        // correspond à l'id de la catégorie cliquée
        const projetsFiltres = tousLesProjets.filter(projet => {
          return projet.categoryId === categorie.id
        })

        // On affiche seulement les projets filtrés
        afficherProjets(projetsFiltres)
      })

      // On ajoute le bouton dans le conteneur
      filters.appendChild(bouton)
    })
  })

  // On récupère le token dans le localStorage
const token = localStorage.getItem("token")

// Si le token existe → Sophie est connectée
if (token) {
  // On affiche le bandeau "Mode édition"
  const bandeau = document.querySelector("#bandeau-edition")
  bandeau.style.display = "flex"

  // On change "login" en "logout"
  const navLogin = document.querySelector("#nav-login")
  navLogin.textContent = "logout"
 // Au clic sur "logout" on déconnecte Sophie
  navLogin.addEventListener("click", () => {
    // On supprime le token du localStorage
    localStorage.removeItem("token")
    // On redirige vers la page login
    window.location.href = "login.html"
  })
  // On cache les filtres en mode édition
  document.querySelector("#filters").style.display = "none"

  // On affiche le bouton modifier
  const btnModifier = document.querySelector("#btn-modifier")
  btnModifier.style.display = "block"

}