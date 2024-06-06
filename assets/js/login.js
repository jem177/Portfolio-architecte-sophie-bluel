//** Variable */
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const message = document.querySelector(".login-container p");

document.getElementById("loginForm"),
  addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      email: email.value,
      password: password.value,
    };

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          message.textContent = "Connexion réussie!";
          localStorage.setItem("token", data.token);
          window.location.href = "/index.html";
          window.localStorage.loged = true;
        } else {
          message.textContent = "Erreur de connexion: " + data.message;
        }
      })
      .catch((error) => {
        console.log("Erreur:", error);
        message.textContent = "Erreur de connexion";
      });
  });
