// ===========================================================
//  Aura Luxe Salon - sample website
//  CHANGE THIS: salon WhatsApp number (country code + number, no + or spaces)
// ===========================================================
const WHATSAPP_NUMBER = "919876543210";

// ---------- Mobile menu ----------
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  })
);

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---------- Count-up numbers in hero ----------
document.querySelectorAll("[data-count]").forEach(el => {
  const target = +el.dataset.count;
  const plus = target >= 100 ? "+" : "";
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const timer = setInterval(() => {
    n = Math.min(target, n + step);
    el.textContent = n.toLocaleString("en-IN") + plus;
    if (n >= target) clearInterval(timer);
  }, 25);
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Booking form -> WhatsApp ----------
const form = document.getElementById("bookForm");
const msg = document.getElementById("formMsg");
const dateInput = document.getElementById("date");
dateInput.min = new Date().toISOString().split("T")[0];   // no past dates

// "Choose plan" buttons pre-select the package in the form
document.querySelectorAll("[data-service]").forEach(btn =>
  btn.addEventListener("click", () => {
    document.getElementById("service").value = btn.dataset.service;
  })
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = ["name", "phone", "service", "date", "time"].map(id => document.getElementById(id));
  let ok = true;
  fields.forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });

  const phone = fields[1].value.replace(/\D/g, "");
  if (ok && phone.length < 10) {
    fields[1].classList.add("invalid");
    msg.textContent = "Please enter a valid 10-digit phone number.";
    return;
  }
  if (!ok) {
    msg.textContent = "Please fill in all the fields.";
    return;
  }
  msg.textContent = "";

  const [name, , service, date, time] = fields.map(f => f.value.trim());
  const text =
    `Hello Aura Luxe Salon! I would like to book an appointment.\n\n` +
    `Name: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  form.reset();
});
