// On envoie une demande au serveur pour récupérer les projets
fetch("http://localhost:5678/api/works")

  // On attend la réponse du serveur et on la convertit en JSON
  .then(response => response.json())

  // On reçoit le tableau des projets, on peut maintenant les utiliser
  .then(works => {

    // On sélectionne la div class="gallery" dans le HTML
    const gallery = document.querySelector(".gallery")

    // On vide la galerie (utile quand on filtrera par catégorie)
    gallery.innerHTML = ""

    // On boucle sur chaque projet du tableau
    works.forEach(projet => {

      // On crée une balise <figure> pour chaque projet
      const figure = document.createElement("figure")

      // On remplit la figure avec l'image et le titre du projet
      // ${projet.imageUrl} et ${projet.title} viennent du JSON
      figure.innerHTML = `
        <img src="${projet.imageUrl}" alt="${projet.title}">
        <figcaption>${projet.title}</figcaption>
      `

      // On ajoute la carte dans la galerie
      gallery.appendChild(figure)
    })
  })

  // ---- RECUPERATION ET AFFICHAGE DES FILTRES ----

// On récupère les catégories depuis le serveur
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {

    // On sélectionne le conteneur des filtres
    const filters = document.querySelector("#filters")

    // On crée le bouton "Tous" en premier
    const boutonTous = document.createElement("button")
    boutonTous.textContent = "Tous"
    boutonTous.classList.add("actif")
    filters.appendChild(boutonTous)

    // On boucle sur chaque catégorie pour créer un bouton
    categories.forEach(categorie => {
      const bouton = document.createElement("button")
      bouton.textContent = categorie.name
      filters.appendChild(bouton)
    })
  })