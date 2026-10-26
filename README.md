# HTML Tag Lab

A searchable reference of 38 basic HTML tags with live previews, a code playground and a quiz.
Built from the original *Basic HTML Tags* mini-project by Ramya Vengadesan.

## Run it
Open `index.html` in a browser. No build step, no dependencies.

## Structure
- `index.html`   page markup
- `css/styles.css`  design tokens (light and dark), layout, components
- `js/tags.js`   all tag data (add a tag here and it appears everywhere)
- `js/app.js`    search and filters, detail dialog, syntax highlighter, playground, quiz
- `build_bundle.py`  optional: inlines everything into one HTML file

## Add a tag
Add an object to `TAGS` in `js/tags.js` with `id, t, name, cat, st, desc, q, code`.
