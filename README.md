# bysuhasbangale

A cinematic multi-page photography portfolio built with plain HTML, CSS, and JavaScript.

## Pages

- `index.html` - landing experience with cinematic hero and featured work
- `portfolio.html` - filterable archive with fullscreen lightbox
- `about.html` - storytelling-led brand introduction
- `contact.html` - enquiry page with a pre-filled mail client handoff

## Shared Assets

- `assets/css/styles.css` - design system, layout, responsiveness, and motion styling
- `assets/js/data.js` - portfolio dataset and gallery metadata
- `assets/js/main.js` - interactions, animations, gallery rendering, and form behavior
- `assets/images/favicon.svg` - brand favicon

## Run Locally

Open `index.html` directly in your browser, or start a simple local server from the project root.

If you have Node available:

```powershell
npx serve .
```

If you have Python available:

```powershell
python -m http.server 8000
```

Then visit the local URL printed by the server.

## Customize

- Replace the placeholder image URLs in `assets/js/data.js` with your own work
- Update the contact email in `contact.html` and the form `data-recipient`
- Swap Instagram links in `about.html` and `contact.html`
- Refine page copy to match your personal biography and real project history

## Notes

- The current build uses remote placeholder imagery so the layout feels complete before final assets are added.
- The contact form opens the visitor's default mail app with the message pre-filled.
