const loginBtn = document.getElementById("btn-login");

loginBtn.addEventListener("click", function () {
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;


   if (username === "admin" && password === "admin123") {


      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "main.html";

   } else {
      alert("Invalid username or password");
   }
});