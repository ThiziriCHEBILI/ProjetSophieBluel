const form = document.querySelector("form")
const email = document.getElementById('email')
const password = document.getElementById('password')

async function login() {
  try {
    const request = await fetch('http://localhost:5678/api/users/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    if(request.ok) {
      const response = await request.json()
      if(response) {
        localStorage.setItem('token', response.token)
        window.location.href = "index.html"
      }
    }
    else {
  alert("Email ou mot de passe incorrect !")
}
  } catch (exception) {
    console.error(`Error: ${exception}`)
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  login()
})