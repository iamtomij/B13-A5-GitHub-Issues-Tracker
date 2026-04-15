const loginBtn = document.getElementById("btn-login");

loginBtn.addEventListener("click", function () {
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;

   // demo credentials
   if (username === "admin" && password === "admin123") {

      // save login state
      localStorage.setItem("isLoggedIn", "true");

      // redirect to main page
      window.location.href = "main.html";

   } else {
      alert("Invalid username or password");
   }
});