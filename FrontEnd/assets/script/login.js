async function login() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  try {
    const request = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    if (request.ok) {
      const response = await request.json();
      if (response) {
        localStorage.setItem("token", response.token);
        window.location.href = "index.html";
      }
   } else {
  document.querySelector("#error-message").style.color = "red";
} 
  } catch (exception) {
    console.error(`Error: ${exception}`);
  }
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});
