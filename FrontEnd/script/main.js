import { fetchData } from '../api/fonction.js'

async function getWorks() {
  try {
    const works = await fetchData("works")
    return works
  } catch (exception) {
    console.error(`Error: ${exception}`)
  }
}

async function getCategories() {
  try {
    const categories = await fetchData("categories")
    return categories
  } catch (exception) {
    console.error(`Error: ${exception}`)
  }
}

function createCard(work) {
  const figure = document.createElement("figure")
  figure.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
  `
  return figure
}

function createFilterButton(categorie) {
  const button = document.createElement("button")
  button.textContent = categorie.name
  return button
}

function setActiveButton(bouton) {
  document.querySelectorAll("#filters button").forEach(btn => {
    btn.classList.remove("actif")
  })
  bouton.classList.add("actif")
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery")
  gallery.innerHTML = ""
  works.forEach(work => {
    gallery.appendChild(createCard(work))
  })
}

function displayFilters(categories, works) {
  const filters = document.querySelector("#filters")

  const boutonTous = document.createElement("button")
  boutonTous.textContent = "Tous"
  boutonTous.classList.add("actif")
  boutonTous.addEventListener("click", () => {
    setActiveButton(boutonTous)
    displayWorks(works)
  })
  filters.appendChild(boutonTous)

  categories.forEach(categorie => {
    const bouton = createFilterButton(categorie)
    bouton.addEventListener("click", () => {
      setActiveButton(bouton)
      const projetsFiltres = works.filter(work => work.categoryId === categorie.id)
      displayWorks(projetsFiltres)
    })
    filters.appendChild(bouton)
  })
}

function displayEditionMode() {
  // Afficher le bandeau
  const bandeau = document.querySelector("#bandeau-edition")
  bandeau.style.display = "flex"

  // Changer "login" en "logout"
  const navLogin = document.querySelector("#nav-login")
  navLogin.textContent = "logout"

  // Au clic sur logout → déconnexion
  navLogin.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.href = "login.html"
  })

  // Cacher les filtres
  document.querySelector("#filters").style.display = "none"

  // Afficher le bouton modifier
  const btnModifier = document.querySelector("#btn-modifier")
  btnModifier.style.display = "block"
}

async function main() {
  const works = await getWorks()
  displayWorks(works)

  const categories = await getCategories()
  displayFilters(categories, works)


  // Gestion du mode édition
  const token = localStorage.getItem("token")
  if(token) {
    displayEditionMode()
  }
}

document.addEventListener("DOMContentLoaded", main)