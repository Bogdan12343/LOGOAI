let userToken = localStorage.getItem("logoai_token") || null;
const API = "https://logoai-backend.vercel.app";

const header = document.getElementById("site-header");
const scrollProgress = document.getElementById("scroll-progress");
const mobileToggle = document.getElementById("mobile-toggle");
const navMenu = document.getElementById("nav-menu");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

mobileToggle.addEventListener("click", () => {
  const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
  mobileToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("open");
});

document.querySelectorAll('.nav-menu a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("open"));
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const typingTarget = document.getElementById("hero-typing");
const words = ["10 Seconds", "One Click", "Seconds Flat"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeHeadline() {
  const current = words[wordIndex];
  if (deleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }
  typingTarget.textContent = current.slice(0, charIndex);
  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeHeadline, 1200);
    return;
  }
  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(typeHeadline, deleting ? 65 : 95);
}
typeHeadline();

const subtitleText = "Generate production-ready logos, instantly. Type your brand name, pick a style, and get premium identities with complete commercial rights.";
const subtitleEl = document.getElementById("hero-subtitle");
let subtitleIdx = 0;
function typeSubtitle() {
  if (subtitleIdx <= subtitleText.length) {
    subtitleEl.textContent = subtitleText.slice(0, subtitleIdx++);
    setTimeout(typeSubtitle, 22);
  }
}
typeSubtitle();

const cursorDot = document.getElementById("cursor-dot");
const cursorGlow = document.getElementById("cursor-glow");
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let pointerX = glowX;
let pointerY = glowY;

window.addEventListener("mousemove", (e) => {
  pointerX = e.clientX;
  pointerY = e.clientY;
  cursorDot.style.left = `${pointerX}px`;
  cursorDot.style.top = `${pointerY}px`;
});

function animateGlow() {
  glowX += (pointerX - glowX) * 0.18;
  glowY += (pointerY - glowY) * 0.18;
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top = `${glowY}px`;
  requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const priceToggle = document.getElementById("price-toggle");
priceToggle.addEventListener("change", () => {
  document.querySelectorAll(".price").forEach((price) => {
    price.textContent = priceToggle.checked ? price.dataset.yearly : price.dataset.monthly;
  });
});

document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const openItem = document.querySelector(".faq-item.open");
    if (openItem && openItem !== item) openItem.classList.remove("open");
    item.classList.toggle("open");
  });
});

const testimonials = Array.from(document.querySelectorAll(".testimonial"));
const dots = Array.from(document.querySelectorAll(".dot"));
let testimonialIdx = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => t.classList.toggle("active", i === index));
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
  testimonialIdx = index;
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showTestimonial(Number(dot.dataset.index));
  });
});

setInterval(() => {
  showTestimonial((testimonialIdx + 1) % testimonials.length);
}, 5000);

const filterButtons = document.querySelectorAll(".filter-btn");
const logoCards = document.querySelectorAll(".logo-card");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    logoCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "block" : "none";
    });
  });
});

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
  });
});

const generateBtn = document.getElementById("generate-btn");

generateBtn.addEventListener("click", async () => {
  if (!userToken) {
    openAuth();
    return;
  }
  window.location.href = "dashboard.html";
});

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 14000);
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.8 + 0.7
  }));
}
createParticles();
window.addEventListener("resize", createParticles);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(236, 72, 153, 0.65)";
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.25;
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

let authMode = "login";

function openAuth() {
  document.getElementById("auth-modal").style.display = "flex";
}

function closeAuth() {
  document.getElementById("auth-modal").style.display = "none";
}

function switchTab(mode) {
  authMode = mode;
  document.getElementById("tab-login").style.background = mode === "login" ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "none";
  document.getElementById("tab-register").style.background = mode === "register" ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "none";
}

async function submitAuth() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const msg = document.getElementById("auth-message");
  const endpoint = authMode === "login" ? "/api/login" : "/api/register";

  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error;
      return;
    }

    if (data.token) {
      localStorage.setItem("logoai_token", data.token);
      userToken = data.token;
      closeAuth();
      updateNavbar();
      msg.textContent = "";
    } else {
      msg.textContent = "✅ Registered! Please sign in.";
      switchTab("login");
    }
  } catch (err) {
    msg.textContent = "Connection error. Is the server running?";
  }
}

function updateNavbar() {
  const signinBtn = document.querySelector(".btn-ghost");
  if (userToken && signinBtn) {
    signinBtn.textContent = "Dashboard →";
    signinBtn.onclick = () => window.location.href = "dashboard.html";
  }
}

function logout() {
  localStorage.removeItem("logoai_token");
  userToken = null;
  updateNavbar();
}

document.querySelector(".btn-ghost")?.addEventListener("click", openAuth);

updateNavbar();