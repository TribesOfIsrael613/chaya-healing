/* ============================================================
   Chaya Fiedler — site behavior
   ============================================================ */

/* Submissions go to Chaya's inbox via FormSubmit — no account, no
   dashboard, her address is the endpoint. Once she's confirmed the
   activation email, swap the address here for the random token
   FormSubmit gives her, so scrapers can't read it off the page. */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/chaya.holisticrn@gmail.com";

/* Only used if FORM_ENDPOINT is ever emptied — then the forms hand off
   to the visitor's own mail app instead. */
const CONTACT_EMAIL = "chaya.holisticrn@gmail.com";

const CONTACT_PHONE = "718-607-7445";

/* ------------------------------------------------------------
   Mobile nav
   ------------------------------------------------------------ */
(function nav() {
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  const bar    = document.getElementById("nav");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------ */
(function reveal() {
  const targets = document.querySelectorAll(
    ".section-head, .card, .split-copy, .split-panel, .quote, .cta-band, " +
    ".workshop-points li, .signup-card, .steps li, .format-item, .faq details, .contact-tile"
  );
  if (!("IntersectionObserver" in window)) return;
  if (location.search.includes("nofx")) return; // screenshot/debug mode

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

  targets.forEach((el) => io.observe(el));
})();

/* ------------------------------------------------------------
   Current year
   ------------------------------------------------------------ */
(function year() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ------------------------------------------------------------
   Forms
   ------------------------------------------------------------ */
(function forms() {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll("form.form").forEach((form) => {
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    const original = button ? button.textContent : "";

    const say = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status" + (kind ? " " + kind : "");
    };

    // clear the invalid state as soon as the visitor starts fixing it
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("invalid"));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // honeypot — bots fill hidden fields, people don't
      if (form.querySelector('[name="_honey"]').value) return;

      const data = new FormData(form);
      let firstBad = null;

      form.querySelectorAll("[required]").forEach((el) => {
        const empty = !el.value.trim();
        const badEmail = el.type === "email" && el.value.trim() && !EMAIL_RE.test(el.value.trim());
        el.classList.toggle("invalid", empty || badEmail);
        if ((empty || badEmail) && !firstBad) firstBad = el;
      });

      if (firstBad) {
        say("Please fill in the highlighted fields.", "error");
        firstBad.focus();
        return;
      }

      if (!FORM_ENDPOINT) {
        mailtoFallback(form, data, say);
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      say("");

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });

        if (!res.ok) throw new Error("Request failed: " + res.status);

        // FormSubmit answers 200 even when it refused the submission
        // (unactivated form, blocked origin) — the body is the real verdict.
        const result = await res.json().catch(() => ({}));
        if (String(result.success) !== "true") {
          throw new Error(result.message || "Submission rejected");
        }

        form.reset();
        say(
          form.id === "workshopForm"
            ? "You're on the list — Chaya will be in touch with the dates."
            : "Thank you. Chaya will get back to you shortly.",
          "ok"
        );
      } catch (err) {
        say(`Something went wrong. Please call or text ${CONTACT_PHONE}.`, "error");
      } finally {
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  });

  /* No endpoint configured yet — hand off to the visitor's mail app. */
  function mailtoFallback(form, data, say) {
    if (!CONTACT_EMAIL) {
      say(`Please call or text ${CONTACT_PHONE} to sign up — online signup is coming shortly.`, "error");
      return;
    }

    const lines = [];
    for (const [key, value] of data.entries()) {
      if (key.startsWith("_") || !String(value).trim()) continue;
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`${label}: ${value}`);
    }

    const subject = form.id === "workshopForm"
      ? "Workshop signup"
      : "Session inquiry";

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;

    say("Opening your email app — just press send.", "ok");
  }
})();
