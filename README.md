# subediupadesh.github.io

Personal website of Upadesh Subedi — Computational Materials Science Researcher.

## Deploy to GitHub Pages

1. Create a new repository named exactly: **subediupadesh.github.io** (must match your GitHub username).
2. Upload all files from this folder (`index.html`, `style.css`, `script.js`, `assets/`) to the root of that repo.
3. Add your profile photo as `assets/profile.jpg` (square image, e.g. 500x500px works best).
4. Go to repo **Settings → Pages**. Source: "Deploy from branch", branch: `main`, folder: `/ (root)`. Save.
5. Wait 1-2 minutes — your site will be live at **https://subediupadesh.github.io**

## Editing content
- All text content is in `index.html`, organized by section (`<section id="...">`).
- Colors, fonts, layout are in `style.css` (edit the `:root` variables at the top for quick theme changes).
- Interactivity (dark mode, particle background, scroll animations) is in `script.js`.

## Adding your photo
Place your photo at `assets/profile.jpg`. If missing, the site automatically shows a placeholder "US" monogram instead — so the site works even without it.

## Adding more publications/projects
Copy a `.pub-item` or `.topic-card` block in `index.html` and edit the text/links.
