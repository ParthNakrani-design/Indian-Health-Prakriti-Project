console.log("Indian Health site loaded!");

// Common: update user info + theme
function updateUserArea() {
  const userArea = document.getElementById("userArea");
  const loggedUser = localStorage.getItem("loggedInUser");

  if (userArea) {
    let userHTML = loggedUser
      ? `<span>👤 ${loggedUser}</span> <button class="logout-btn" onclick="logout()">Logout</button>`
       : `<a href="login.html" style="color:white;">Log in</a>`  ;

    userHTML += `<button class="theme-toggle" onclick="toggleTheme()">🌓</button>`;
    userArea.innerHTML = userHTML;
  }
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Login required
function requireLogin() {
  const user = localStorage.getItem("loggedInUser");
  const currentPage = window.location.pathname.split("/").pop();
  if (!user && !["login.html", "register.html", "profile.html"].includes(currentPage)) {
    alert("Please log in first!");
    window.location.href = "login.html";
    window.location.href = "register.html";
  }
}

/* ===== Theme ===== */
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark-mode");
}

/* ===== Registration ===== */
document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  updateUserArea();
  requireLogin();

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value.trim();

      if (localStorage.getItem(username)) {
        alert("Username already exists!");
      } else {
        localStorage.setItem(username, JSON.stringify({ password }));
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
      }
    });
  }
});

/* ===== Login ===== */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const msg = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      const user = JSON.parse(localStorage.getItem(username));
      if (user && user.password === password) {
        localStorage.setItem("loggedInUser", username);
        msg.textContent = "✅ Login successful! Redirecting...";
        msg.style.color = "green";
        setTimeout(() => (window.location.href = "prakriti.html"), 1000);
      } else {
        msg.textContent = "❌ Invalid credentials!";
        msg.style.color = "red";
      }
    });
  }
});

/* ===== Prakriti Analysis ===== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prakritiForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let scores = { vata: 0, pitta: 0, kapha: 0 };
      const formData = new FormData(form);
      formData.forEach((v) => scores[v]++);
      const prakritiType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
      let desc = {
        vata: "Creative, energetic, irregular digestion.",
        pitta: "Strong digestion, good focus, can be irritable.",
        kapha: "Calm, strong, gains weight easily."
      }[prakritiType];

      document.getElementById("result").innerHTML = `
        <h3>Your Prakriti Type: ${prakritiType.toUpperCase()}</h3>
        <p>${desc}</p>
      `;

      localStorage.setItem("prakritiResult", JSON.stringify({ type: prakritiType, desc }));
      setTimeout(() => window.location.href = "diet.html", 1500);
    });
  }
});

/* ===== Diet Page ===== */
document.addEventListener("DOMContentLoaded", () => {
  const dietDiv = document.getElementById("dietPlan");
  if (dietDiv) {
    const prakriti = JSON.parse(localStorage.getItem("prakritiResult"));
    if (!prakriti) return (dietDiv.textContent = "Please complete Prakriti Analysis first.");

    const diets = {
      vata: `<h3>Vata Diet</h3><ul><li>Warm, cooked meals</li><li>Healthy fats</li><li>Sweet fruits</li><li>Avoid cold foods</li></ul>`,
      pitta: `<h3>Pitta Diet</h3><ul><li>Cooling foods</li><li>Milk & ghee</li><li>Sweet & bitter tastes</li><li>Avoid spicy food</li></ul>`,
      kapha: `<h3>Kapha Diet</h3><ul><li>Light, warm meals</li><li>Spices like ginger</li><li>Lots of veggies</li><li>Avoid dairy</li></ul>`
    };
    dietDiv.innerHTML = diets[prakriti.type];
  }
});

/* ===== Schedule Page ===== */
document.addEventListener("DOMContentLoaded", () => {
  const scheduleDiv = document.getElementById("dailySchedule");
  if (scheduleDiv) {
    const prakriti = JSON.parse(localStorage.getItem("prakritiResult"));
    if (!prakriti) return (scheduleDiv.textContent = "Please complete Prakriti Analysis first.");

    const schedules = {
      vata: `<ul><li>Wake up 6:00 AM</li><li>Light yoga</li><li>Warm breakfast</li><li>Sleep by 10 PM</li></ul>`,
      pitta: `<ul><li>Wake up 5:30 AM</li><li>Cooling breathing</li><li>Fruits breakfast</li><li>Sleep 10:30 PM</li></ul>`,
      kapha: `<ul><li>Wake 5:00 AM</li><li>Dynamic exercise</li><li>Light meals</li><li>Sleep 10 PM</li></ul>`
    };
    scheduleDiv.innerHTML = schedules[prakriti.type];
  }
});

/* ===== Progress Page ===== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("progressForm");
  const table = document.getElementById("progressTable")?.querySelector("tbody");

  function loadProgress() {
    const data = JSON.parse(localStorage.getItem("progressData")) || [];
    if (table) {
      table.innerHTML = data.map(
        e => `<tr><td>${e.date}</td><td>${e.energy}</td><td>${e.mood}</td><td>${e.notes}</td></tr>`
      ).join("");
    }
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const entry = {
        date: document.getElementById("date").value,
        energy: document.getElementById("energy").value,
        mood: document.getElementById("mood").value,
        notes: document.getElementById("notes").value,
      };

      const all = JSON.parse(localStorage.getItem("progressData")) || [];
      all.push(entry);
      localStorage.setItem("progressData", JSON.stringify(all));
      form.reset();
      loadProgress();
    });
    loadProgress();
  }

  const homeTable = document.getElementById("homeProgressTable")?.querySelector("tbody");
  if (homeTable) {
    const data = JSON.parse(localStorage.getItem("progressData")) || [];
    homeTable.innerHTML = data.slice(-5).map(
      e => `<tr><td>${e.date}</td><td>${e.energy}</td><td>${e.mood}</td><td>${e.notes}</td></tr>`
    ).join("");
  }
});
