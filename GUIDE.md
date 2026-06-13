# Maintenance Guide — How to Update This Website

This site is plain **HTML + CSS + JS** — no build tools, no installation needed.
Edit files directly on GitHub (click the pencil ✏️ icon on any file) or locally, then
commit/push. GitHub Pages updates automatically in ~1 minute.

All content lives in **`index.html`**. Look for `<!-- ===== ... ===== -->` comment
markers — they show you exactly where to copy/paste.

---

## 1. Add a new top navigation tab (new section)

**Step 1 — Add the nav link** (near the top of `index.html`, inside `<ul class="nav-links">`):
```html
<li><a href="#mynewsection">My New Section</a></li>
```

**Step 2 — Add the section itself** (anywhere inside `<main>...</main>`, e.g. just before `</main>`):
```html
<section id="mynewsection" class="section">
  <div class="section-head reveal">
    <span class="num">★</span>
    <h2>My New Section</h2>
  </div>
  <p class="reveal section-intro">
    Write your intro text here.
  </p>
  <!-- add cards, text, images, etc. -->
</section>
```
Use `class="section"` or `class="section alt"` (alternates background shading) to match the rest of the page.
The `id` in the `<section id="...">` must match the `href="#..."` in the nav link.

---

## 2. Add a YouTube video of a simulation

The **Media** section (`id="media"`) already has a working example. To add another video:

```html
<div class="topic-card video-card">
  <h3>Title of your simulation</h3>
  <div class="video-wrap">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Simulation video" frameborder="0" allowfullscreen></iframe>
  </div>
  <p>Caption describing the simulation.</p>
</div>
```
- Get `VIDEO_ID` from your YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID` → copy the part after `v=`.
- Paste this block inside the `<div class="card-grid">` in the Media section (add more cards side by side).

---

## 3. Add your PhD thesis, presentation, or poster (PDF)

**Step 1 — Upload the PDF file** to the repo inside a folder `assets/docs/` (create it if it doesn't exist).
e.g. `assets/docs/thesis.pdf`, `assets/docs/defense-slides.pdf`, `assets/docs/poster-2026.pdf`.

**Step 2 — Add a link** in the Media section's `doc-list` div:
```html
<a class="doc-link" href="assets/docs/thesis.pdf" target="_blank">📄 PhD Thesis (PDF)</a>
```
Just change the `href` to your filename and the text/emoji to whatever you like.

> Tip: GitHub has a 25 MB per-file limit (100 MB hard limit) via the web upload UI — most PDFs/PPTs are fine.

---

## 4. Add a new publication

Go to the **Publications** section (`id="publications"`), find the
`<!-- ===== PUBLICATION ITEM ... ===== -->` comment block, copy one `.pub-item` div, and edit:

```html
<div class="pub-item">
  <h3><a href="PASTE_JOURNAL_LINK_HERE" target="_blank">Paper Title Here</a></h3>
  <p class="pub-meta">Author list — <em>Journal Name</em>, Year</p>
</div>
```
Paste new items anywhere within the `.pub-list` div — newest first is recommended.

---

## 5. Add a new project/tool card (e.g. new GitHub repo)

Go to the **Tools** section (`id="tools"`), copy a `.topic-card` block:
```html
<div class="topic-card">
  <div class="icon">⚙️</div>
  <h3>Project Name</h3>
  <p>Short description of what it does.</p>
  <a href="https://github.com/subediupadesh/your-repo" target="_blank" class="link-arrow">View on GitHub →</a>
</div>
```

---

## 6. Update your profile photo

Upload your image as `assets/profile.jpg` (square, ~500×500px works best). The site automatically
displays it; if the file is missing, a placeholder "US" monogram is shown instead — so nothing breaks
if you forget.

---

## 7. Change colors, fonts, spacing

All the main design tokens are at the top of `style.css` under `:root { ... }`:
```css
--accent:#5eb8ff;     /* primary accent color */
--accent-2:#8b7bff;   /* secondary accent (gradient) */
--font-head:'Space Grotesk', sans-serif;
--font-body:'Inter', sans-serif;
```
Change these values to retheme the entire site.

---

## 8. General tips

- Always keep matching pairs of `<div>...</div>` and `<section>...</section>` tags — if the layout
  breaks after an edit, check you haven't deleted a closing tag.
- Use the browser's "View Page Source" or right-click → Inspect to see how existing sections are
  structured before copying them.
- Test locally by just double-clicking `index.html` to open it in a browser before pushing changes.
- After pushing changes, GitHub Pages takes ~30-60 seconds to rebuild — refresh with Ctrl+Shift+R
  (hard refresh) if you don't see updates immediately.
