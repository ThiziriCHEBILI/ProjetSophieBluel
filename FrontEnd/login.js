const form = document.querySelector("form")

form.addEventListener("submit", (event) => {
  event.preventDefault()

  // On récupère ce que l'utilisateur a tapé
  const email = document.querySelector("#email").value
  const password = document.querySelector("#password").value

  // On envoie les données au serveur avec POST
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
  localStorage.setItem("token", data.token)
  window.location.href = "index.html"
} else {
  alert("Email ou mot de passe incorrect !")
}
  })
})