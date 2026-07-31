# Chaya Fiedler — Emotion Body Belief Code

A one-page site for Chaya Fiedler's energy healing practice, plus signup for the
upcoming "release your own trapped emotions" workshop.

Plain HTML/CSS/JS — no build step, no dependencies. Open `index.html` and it works.

```
index.html      all page content
styles.css      all styling
script.js       nav, scroll reveal, form handling  ← two values to fill in at the top
assets/         favicon (drop og-image.jpg here too)
```

---

## Before it goes live — 3 things

### 1. Make the forms actually deliver (5 minutes)

Right now the two forms (workshop signup + contact) validate but have nowhere to
send to. Easiest fix, free, no server:

1. Go to [formspree.io](https://formspree.io) and sign up with Chaya's email.
2. Create a new form. Copy the endpoint it gives you — looks like
   `https://formspree.io/f/xabcdefg`.
3. Open `script.js` and set:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/xabcdefg";
   const CONTACT_EMAIL = "chaya@herdomain.com";
   ```
4. Submit the form once yourself — Formspree emails a one-time confirmation link.

Submissions then land in her inbox with the name, email, phone, and message.
The free tier covers 50/month; if the workshop fills faster than that, the paid
tier is a few dollars.

**If you skip this:** with `FORM_ENDPOINT` empty but `CONTACT_EMAIL` set, the forms
open the visitor's own email app with everything pre-filled. With both empty, the
form tells them to call instead. Neither is as good as the real thing.

### 2. Fill in the workshop details

Search `index.html` for `id="workshop"`. The section currently says dates and
pricing are being finalized. Once they're set, replace that line in
`.signup-sub` with the real date, time, location, and price.

### 3. Confirm the details we inferred

These came from the flyers, but double-check with Chaya:

- **$120** — shown on the Emotion Body Belief Code flyer; the site presents it as
  the price for all session types. Fix if Food Codes / Heart Wall differ.
- **Brooklyn, NY** — inferred from the 718 number. Change in the "What a session
  looks like" and Contact sections if that's wrong.
- **Phone/video sessions, ~1 hour** — standard for this work, but not stated on
  any flyer. Confirm before publishing.
- **The Monthly Reset** — mentioned in Mindy's testimonial, so the site references
  it as ongoing monthly support. Worth giving it a real description.
- **Mindy's testimonial** — used verbatim from the Food Codes flyer. Make sure
  she's fine with it being on a public website.

---

## Publishing it

Any static host works. Cheapest good options:

**Netlify** (drag and drop, free)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page
3. It's live in seconds; add a custom domain in Site settings → Domain management

Bonus: on Netlify you can skip Formspree entirely — add `netlify` to the two
`<form>` tags and submissions show up in the Netlify dashboard.

**GitHub Pages** (free, if this is already a repo)
```bash
git init && git add -A && git commit -m "Chaya Fiedler site"
gh repo create chaya-healing --public --source=. --push
```
Then Settings → Pages → deploy from `main` / root.

---

## Nice-to-haves, not done yet

- **Photos.** The site is all illustration and type right now. A real photo of
  Chaya on the Heart Wall section and one warm image in the hero would lift it a
  lot. Drop them in `assets/` and swap the `.hero-art` SVG.
- **Social preview image.** `assets/og-image.jpg` is referenced but not there —
  1200×630, and links shared on WhatsApp will show it.
- **Online scheduling.** If she'd rather not play phone tag, Calendly or Acuity
  drops into the Contact section in place of the form.
- **Payments.** No payment collection on the site; sessions are arranged by phone.
