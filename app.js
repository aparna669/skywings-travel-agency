/* ============================================================
   Skywings – behaviour
   ============================================================ */
document.documentElement.classList.add("js");

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Mobile menu ---------- */
const menuBtn = $("#menu-btn");
const navLinks = $("#nav-links");
const menuIcon = $("i", menuBtn);

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuIcon.className = open ? "ri-close-line" : "ri-menu-line";
}
menuBtn.addEventListener("click", () =>
  setMenu(!navLinks.classList.contains("open"))
);
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ---------- Scroll effects: nav, progress bar, back-to-top ---------- */
const navbar = $("#navbar");
const progress = $("#progress");
const toTop = $("#to-top");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  navbar.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 700);
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ---------- Active nav link ---------- */
const sectionLinks = new Map(
  $$(".nav__links a[href^='#']").map((a) => [a.getAttribute("href").slice(1), a])
);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.classList.remove("active"));
      sectionLinks.get(entry.target.id)?.classList.add("active");
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
["home", "destinations", "tour", "about", "package", "contact"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
$$("[data-reveal]").forEach((el) => {
  const siblings = $$("[data-reveal]", el.parentElement);
  el.style.transitionDelay = `${siblings.indexOf(el) * 120}ms`;
  revealObserver.observe(el);
  // clear the stagger delay once shown so hover effects feel instant
  el.addEventListener(
    "transitionend",
    () => (el.style.transitionDelay = ""),
    { once: true }
  );
});

/* ---------- Animated counters ---------- */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const start = performance.now();
      const dur = 1600;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
$$("[data-count]").forEach((el) => counterObserver.observe(el));

/* ---------- Testimonials slider ---------- */
if (window.Swiper) {
  new Swiper("#reviews-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    autoplay: { delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      700: { slidesPerView: 2 },
      1000: { slidesPerView: 3 },
    },
  });
}

/* ============================================================
   Flight search
   ============================================================ */

// Approximate one-way economy fare (₹) for each city — indicative only.
const CITIES = {
  Delhi: 4500,
  Mumbai: 4800,
  Bengaluru: 5200,
  Chennai: 5200,
  Kolkata: 5400,
  Hyderabad: 5000,
  Goa: 5800,
  Jaipur: 4200,
  Dubai: 18000,
  Bangkok: 14000,
  Singapore: 22000,
  Bali: 28000,
  Tokyo: 38000,
  Paris: 42000,
  London: 45000,
  "New York": 55000,
};

const form = $("#book-form");
const fromEl = $("#from");
const toEl = $("#to");
const departEl = $("#depart");
const returnEl = $("#return");
const returnField = $("#return-field");
const travelersEl = $("#travelers");
const travelersOut = $("#travelers-out");
const cabinEl = $("#cabin");

// Fill the city suggestions.
$("#cities").innerHTML = Object.keys(CITIES)
  .map((c) => `<option value="${c}"></option>`)
  .join("");

// Date limits.
const iso = (d) => {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
};
const today = iso(new Date());
departEl.min = today;
returnEl.min = today;
document.getElementById("year").textContent = new Date().getFullYear();

// Trip type toggle.
function isRound() {
  return form.elements.trip.value === "round";
}
function syncTrip() {
  returnField.style.display = isRound() ? "" : "none";
  if (!isRound()) {
    returnEl.value = "";
    setError("return", "");
  }
}
$$("input[name='trip']").forEach((r) => r.addEventListener("change", syncTrip));
syncTrip();

departEl.addEventListener("change", () => {
  returnEl.min = departEl.value || today;
  if (returnEl.value && returnEl.value < returnEl.min) returnEl.value = "";
});

// Travelers stepper.
$$("[data-step]", form).forEach((btn) =>
  btn.addEventListener("click", () => {
    const next = Math.min(9, Math.max(1, +travelersEl.value + +btn.dataset.step));
    travelersEl.value = next;
    travelersOut.textContent = next;
  })
);

// Swap origin / destination.
$("#swap").addEventListener("click", () => {
  [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
});

// Errors.
function setError(name, msg) {
  const out = $(`[data-err="${name}"]`, form);
  const field = out.closest(".field");
  out.textContent = msg;
  field.classList.toggle("invalid", Boolean(msg));
}
["from", "to", "depart", "return"].forEach((n) =>
  $(`[name="${n}"]`, form).addEventListener("input", () => setError(n, ""))
);

const matchCity = (value) =>
  Object.keys(CITIES).find((c) => c.toLowerCase() === value.trim().toLowerCase());

function validate() {
  let firstBad = null;
  const fail = (name, msg, el) => {
    setError(name, msg);
    firstBad = firstBad || el;
  };

  const from = matchCity(fromEl.value);
  const to = matchCity(toEl.value);

  if (!fromEl.value.trim()) fail("from", "Enter your departure city", fromEl);
  else if (!from) fail("from", "Pick a city from the list", fromEl);
  else setError("from", "");

  if (!toEl.value.trim()) fail("to", "Where would you like to go?", toEl);
  else if (!to) fail("to", "Pick a city from the list", toEl);
  else if (from && from === to) fail("to", "Choose a different city", toEl);
  else setError("to", "");

  if (!departEl.value) fail("depart", "Choose a date", departEl);
  else if (departEl.value < today) fail("depart", "Date is in the past", departEl);
  else setError("depart", "");

  if (isRound()) {
    if (!returnEl.value) fail("return", "Choose a date", returnEl);
    else if (returnEl.value < departEl.value)
      fail("return", "Return is before departure", returnEl);
    else setError("return", "");
  }

  if (firstBad) {
    firstBad.focus();
    return null;
  }
  return { from, to };
}

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtDate = (v) =>
  new Date(v + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function estimate(from, to) {
  const a = CITIES[from];
  const b = CITIES[to];
  const oneWay = Math.max(a, b) + Math.min(a, b) * 0.1;
  const legs = isRound() ? 1.85 : 1;
  const cabin = parseFloat(cabinEl.value);
  const pax = +travelersEl.value;
  return oneWay * legs * cabin * pax;
}

const dialog = $("#result");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const res = validate();
  if (!res) return;

  const { from, to } = res;
  const pax = +travelersEl.value;
  const cabinLabel = cabinEl.options[cabinEl.selectedIndex].text;

  $("#result-route").textContent = `${from} ${isRound() ? "⇄" : "→"} ${to}`;
  const rows = [
    ["Depart", fmtDate(departEl.value)],
    ...(isRound() ? [["Return", fmtDate(returnEl.value)]] : []),
    ["Travelers", `${pax} ${pax > 1 ? "adults" : "adult"}`],
    ["Cabin", cabinLabel],
    ["Trip", isRound() ? "Round trip" : "One way"],
  ];
  $("#result-list").innerHTML = rows
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");
  $("#result-total").textContent = inr(estimate(from, to));

  $("#enq-err").textContent = "";
  if (typeof dialog.showModal === "function") dialog.showModal();
});

/* ---------- Destination / package buttons prefill the form ---------- */
$$("[data-dest]").forEach((btn) =>
  btn.addEventListener("click", () => {
    toEl.value = btn.dataset.dest;
    setError("to", "");
    $("#book").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (departEl.value ? toEl : departEl).focus({ preventScroll: true }), 600);
    toast(`Great choice! ${btn.dataset.dest} added — pick your dates.`);
  })
);

/* ---------- Toast ---------- */
const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.innerHTML = `<i class="ri-checkbox-circle-fill"></i>`;
  toastEl.append(document.createTextNode(msg));
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3500);
}

/* ---------- Email forms ---------- */
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

$("#enquiry-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#enq-email");
  if (!emailOk(input.value)) {
    $("#enq-err").textContent = "Please enter a valid email address";
    input.focus();
    return;
  }
  $("#enq-err").textContent = "";
  dialog.close();
  input.value = "";
  toast("Thanks! We'll email your quote within 24 hours.");
});

$("#subscribe-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#sub-email");
  if (!emailOk(input.value)) {
    $("#sub-err").textContent = "Please enter a valid email address";
    input.focus();
    return;
  }
  $("#sub-err").textContent = "";
  input.value = "";
  toast("You're subscribed. Welcome aboard!");
});

// Close the dialog on backdrop click.
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
