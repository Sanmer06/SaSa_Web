const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const intro = $("#intro");
const header = $("#header");
const menuButton = $("#menuButton");
const mobileMenu = $("#mobileMenu");

const searchButton = $("#searchButton");
const searchOverlay = $("#searchOverlay");
const searchClose = $("#searchClose");
const searchInput = $("#searchInput");
const searchStatus = $("#searchStatus");

const productCards = $$(".product-card");
const filters = $$(".filter");
const filterLinks = $$(".filter-link");
const noResults = $("#noResults");

const productModal = $("#productModal");
const productClose = $("#productClose");
const productModalImage = $("#productModalImage");
const productModalTitle = $("#productModalTitle");
const productModalDescription = $("#productModalDescription");
const productWhatsApp = $("#productWhatsApp");

const authModal = $("#authModal");
const authClose = $("#authClose");
const accountButton = $("#accountButton");
const accountText = $("#accountText");
const authTabs = $$(".auth-tab");
const registerForm = $("#registerForm");
const loginForm = $("#loginForm");
const profilePanel = $("#profilePanel");
const profileName = $("#profileName");
const logoutButton = $("#logoutButton");
const loginMessage = $("#loginMessage");

const newsletterForm = $("#newsletterForm");
const newsletterEmail = $("#newsletterEmail");
const toast = $("#toast");

const USERS_KEY = "sasa_users_v2";
const SESSION_KEY = "sasa_session_v2";
const NEWS_KEY = "sasa_newsletter_v1";

let activeFilter = "all";
let toastTimer;

// ----------------------------------
// Intro
// ----------------------------------
window.addEventListener("load", () => {
  setTimeout(() => intro.classList.add("hide"), 2850);
});

// ----------------------------------
// Header
// ----------------------------------
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 35);
}
updateHeader();
window.addEventListener("scroll", updateHeader, {passive:true});

// ----------------------------------
// Mobile menu
// ----------------------------------
function openMenu() {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  header.classList.add("menu-open");
  document.body.classList.add("locked");
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  header.classList.remove("menu-open");
  document.body.classList.remove("locked");
  updateHeader();
}

menuButton.addEventListener("click", () => {
  mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
});

$$(".mobile-menu a").forEach(link => link.addEventListener("click", closeMenu));

// ----------------------------------
// Search
// ----------------------------------
function openSearch() {
  searchOverlay.classList.add("show");
  searchOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  setTimeout(() => searchInput.focus(), 100);
}

function closeSearchOverlay() {
  searchOverlay.classList.remove("show");
  searchOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

searchButton.addEventListener("click", openSearch);
searchClose.addEventListener("click", closeSearchOverlay);

searchOverlay.addEventListener("click", e => {
  if (e.target === searchOverlay) closeSearchOverlay();
});

// ----------------------------------
// Filters + search
// ----------------------------------
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  productCards.forEach(card => {
    const categories = card.dataset.category.toLowerCase();
    const text = `${card.dataset.search} ${card.innerText}`.toLowerCase();

    const categoryMatch = activeFilter === "all" || categories.includes(activeFilter);
    const searchMatch = !query || text.includes(query);
    const show = categoryMatch && searchMatch;

    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });

  noResults.classList.toggle("show", visible === 0);

  if (query) {
    searchStatus.textContent = `${visible} resultado${visible === 1 ? "" : "s"} para “${searchInput.value.trim()}”`;
  } else {
    searchStatus.textContent = "Gorras, camisetas, polos, shorts...";
  }
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle("active", item === button));
    applyFilters();
  });
});

filterLinks.forEach(link => {
  link.addEventListener("click", () => {
    activeFilter = link.dataset.filterTarget;
    filters.forEach(item => item.classList.toggle("active", item.dataset.filter === activeFilter));
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    closeSearchOverlay();
    $("#shop").scrollIntoView({behavior:"smooth"});
  }
});

// ----------------------------------
// Toast
// ----------------------------------
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ----------------------------------
// Product modal
// ----------------------------------
function openProduct(button) {
  const name = button.dataset.product;
  const img = button.dataset.img;
  const description = button.dataset.desc;

  productModalTitle.textContent = name;
  productModalDescription.textContent = description;
  productModalImage.src = img;
  productModalImage.alt = name;

  const message = encodeURIComponent(`Hola, quiero consultar disponibilidad, tallas y precio de: ${name}.`);
  productWhatsApp.href = `https://wa.me/50684472728?text=${message}`;

  productModal.classList.add("show");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
}

function closeProduct() {
  productModal.classList.remove("show");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

$$("[data-product]").forEach(button => {
  button.addEventListener("click", () => openProduct(button));
});

productClose.addEventListener("click", closeProduct);
productModal.addEventListener("click", e => {
  if (e.target === productModal) closeProduct();
});

// ----------------------------------
// Local account demo
// ----------------------------------
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function setAuthView(view) {
  authTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.auth === view));
  registerForm.classList.toggle("active", view === "register");
  loginForm.classList.toggle("active", view === "login");
  profilePanel.classList.remove("active");
}

function renderAccount() {
  const session = getSession();
  accountText.textContent = session?.name ? session.name.split(" ")[0] : "Cuenta";
}

function openAuth() {
  const session = getSession();

  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");

  if (session?.name) {
    registerForm.classList.remove("active");
    loginForm.classList.remove("active");
    authTabs.forEach(tab => tab.classList.remove("active"));
    profilePanel.classList.add("active");
    profileName.textContent = session.name;
  } else {
    setAuthView("register");
  }
}

function closeAuthModal() {
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

accountButton.addEventListener("click", openAuth);
authClose.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", e => {
  if (e.target === authModal) closeAuthModal();
});

authTabs.forEach(tab => {
  tab.addEventListener("click", () => setAuthView(tab.dataset.auth));
});

registerForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = $("#registerName").value.trim();
  const email = $("#registerEmail").value.trim().toLowerCase();
  const password = $("#registerPassword").value;

  const users = getUsers();

  if (users.some(user => user.email === email)) {
    showToast("Ese correo ya está registrado.");
    setAuthView("login");
    $("#loginEmail").value = email;
    return;
  }

  users.push({name, email, password});
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, JSON.stringify({name, email}));

  registerForm.reset();
  renderAccount();
  closeAuthModal();
  showToast(`Bienvenido a SaSa, ${name.split(" ")[0]}.`);
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const user = getUsers().find(item => item.email === email && item.password === password);

  if (!user) {
    loginMessage.textContent = "Correo o contraseña incorrectos. Regístrate primero si todavía no tienes cuenta.";
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({name:user.name, email:user.email}));
  loginForm.reset();
  loginMessage.textContent = "Si todavía no tienes una cuenta, regístrate primero.";

  renderAccount();
  closeAuthModal();
  showToast(`Sesión iniciada: ${user.name.split(" ")[0]}.`);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  renderAccount();
  closeAuthModal();
  showToast("Sesión cerrada.");
});

// ----------------------------------
// Newsletter demo
// ----------------------------------
newsletterForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = newsletterEmail.value.trim().toLowerCase();
  if (!email) return;

  let emails = [];
  try { emails = JSON.parse(localStorage.getItem(NEWS_KEY)) || []; }
  catch { emails = []; }

  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem(NEWS_KEY, JSON.stringify(emails));
  }

  newsletterForm.reset();
  showToast("Te agregamos a SaSa Updates.");
});

// ----------------------------------
// Global escape
// ----------------------------------
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (searchOverlay.classList.contains("show")) closeSearchOverlay();
  if (productModal.classList.contains("show")) closeProduct();
  if (authModal.classList.contains("show")) closeAuthModal();
  if (mobileMenu.classList.contains("open")) closeMenu();
});

$("#year").textContent = new Date().getFullYear();
renderAccount();
