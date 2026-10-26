/* Tag data: every entry drives the reference cards, detail dialog, hero demo and quiz.
   cat: structure | text | list | media | form | table
   st : current | deprecated | rare */
const CATEGORIES = {
  structure: "Page structure",
  text: "Text & formatting",
  list: "Lists",
  media: "Links & media",
  form: "Forms",
  table: "Tables"
};

const TAGS = [
  /* ---------- Page structure ---------- */
  { id: "html", t: "<html>", name: "HTML root", cat: "structure", st: "current",
    desc: "Wraps the entire document. Everything else lives inside it.",
    q: "Which tag is the root that wraps the whole HTML document?",
    code: `<!DOCTYPE html>\n<html lang="en">\n  <head><title>My page</title></head>\n  <body>Hello, web!</body>\n</html>`,
    note: "Always add lang so screen readers pick the right pronunciation." },
  { id: "head", t: "<head>", name: "Document head", cat: "structure", st: "current",
    desc: "Holds information about the page: title, metadata, links to CSS and scripts. None of it is shown directly.",
    q: "Which tag holds the title, meta tags and stylesheet links of a page?",
    code: `<head>\n  <meta charset="UTF-8">\n  <title>My first page</title>\n  <link rel="stylesheet" href="styles.css">\n</head>`, inv: true },
  { id: "body", t: "<body>", name: "Document body", cat: "structure", st: "current",
    desc: "Contains everything the visitor sees: text, images, links, forms and tables.",
    q: "Which tag contains all the visible content of a page?",
    code: `<body>\n  <h1>Welcome</h1>\n  <p>This is the visible part of the page.</p>\n</body>` },
  { id: "title", t: "<title>", name: "Page title", cat: "structure", st: "current",
    desc: "Sets the text on the browser tab and in search results.",
    q: "Which tag sets the text shown on the browser tab?",
    code: `<title>Basic HTML Tags</title>`, inv: true,
    note: "Keep it under about 60 characters so search engines don't cut it." },
  { id: "meta", t: "<meta>", name: "Metadata", cat: "structure", st: "current",
    desc: "Describes the page to browsers and search engines: character set, description, viewport, even auto-refresh.",
    q: "Which void tag declares the charset or page description?",
    code: `<meta charset="UTF-8">\n<meta name="description" content="Description of your site">\n<meta name="viewport" content="width=device-width, initial-scale=1">`, inv: true,
    note: "The old http-equiv refresh trick works but is bad for accessibility. Use a server redirect instead." },
  { id: "link", t: "<link>", name: "External resource", cat: "structure", st: "current",
    desc: "Connects the page to an outside resource, most often a stylesheet.",
    q: "Which tag connects an HTML page to an external CSS file?",
    code: `<link rel="stylesheet" href="styles.css">`, inv: true },

  /* ---------- Text & formatting ---------- */
  { id: "h", t: "<h1>–<h6>", name: "Headings", cat: "text", st: "current",
    desc: "Six heading levels. h1 is the most important, h6 the least. Use them in order to outline the page.",
    q: "Which family of tags creates six levels of headings?",
    code: `<h1>Heading level 1</h1>\n<h2>Heading level 2</h2>\n<h3>Heading level 3</h3>\n<h4>Heading level 4</h4>\n<h5>Heading level 5</h5>\n<h6>Heading level 6</h6>`,
    note: "Pick a level for meaning, not for size. Resize with CSS." },
  { id: "p", t: "<p>", name: "Paragraph", cat: "text", st: "current",
    desc: "A block of text. Browsers add space above and below it.",
    q: "Which tag defines a paragraph of text?",
    code: `<p>HTML is the standard language for creating web pages.</p>\n<p>This is a second paragraph.</p>` },
  { id: "br", t: "<br>", name: "Line break", cat: "text", st: "current",
    desc: "Starts a new line without starting a new paragraph. It has no closing tag.",
    q: "Which void tag forces text onto a new line?",
    code: `<p>\n  This is line 1.<br>\n  This is line 2.<br>\n  This is line 3.\n</p>`,
    note: "Use it for addresses and poems. For spacing, use CSS margin instead." },
  { id: "hr", t: "<hr>", name: "Horizontal rule", cat: "text", st: "current",
    desc: "Draws a horizontal line to mark a change of topic.",
    q: "Which void tag draws a horizontal line across the page?",
    code: `<p>Above the line</p>\n<hr>\n<p>Below the line</p>` },
  { id: "b", t: "<b>", name: "Bold", cat: "text", st: "current",
    desc: "Draws attention to text in bold without adding extra importance.",
    q: "Which tag makes text bold without marking it as important?",
    code: `<p><b>This text is bold.</b></p>`,
    note: "Use <strong> when the text is truly important." },
  { id: "i", t: "<i>", name: "Italic", cat: "text", st: "current",
    desc: "Sets text in italics for a different voice or mood, like a foreign word or a thought.",
    q: "Which tag sets text in italics for an alternate voice?",
    code: `<p><i>This text is italic.</i></p>` },
  { id: "em", t: "<em>", name: "Emphasis", cat: "text", st: "current",
    desc: "Stresses a word, the way your voice would. Browsers show it in italics and screen readers change tone.",
    q: "Which tag adds spoken stress to a word and shows italics by default?",
    code: `<p>I <em>really</em> mean it.</p>` },
  { id: "strong", t: "<strong>", name: "Strong importance", cat: "text", st: "current",
    desc: "Marks text as important, such as a warning. Shown in bold by default.",
    q: "Which tag marks text as strongly important?",
    code: `<p><strong>Warning:</strong> this action cannot be undone.</p>` },
  { id: "code", t: "<code>", name: "Code", cat: "text", st: "current",
    desc: "Marks a short piece of computer code. Shown in a monospace font.",
    q: "Which tag marks inline computer code in a monospace font?",
    code: `<p>Use the <code>&lt;br&gt;</code> tag for a line break.</p>`,
    note: "To show an angle bracket on the page, write &lt; and &gt;." },
  { id: "comment", t: "<!-- -->", name: "Comment", cat: "text", st: "current",
    desc: "A note for developers. Visible in the source code, never on the page.",
    q: "Which syntax adds a note that browsers do not display?",
    code: `<!-- This comment is invisible on the page -->\n<p>Only this paragraph is visible.</p>` },
  { id: "big", t: "<big>", name: "Big text", cat: "text", st: "deprecated",
    desc: "Made text one size larger. Removed from HTML5.",
    q: "Which removed tag used to make text one size bigger?",
    code: `<big>This text is big.</big>`,
    alt: `Use CSS: <span style="font-size:1.25em">…</span>` },
  { id: "center", t: "<center>", name: "Center", cat: "text", st: "deprecated",
    desc: "Centered its content horizontally. Removed from HTML5.",
    q: "Which removed tag used to center its content?",
    code: `<center>This will center your contents</center>`,
    alt: `Use CSS: text-align: center; or flexbox.` },
  { id: "font", t: "<font>", name: "Font", cat: "text", st: "deprecated",
    desc: "Set the typeface, size and colour of text. Removed from HTML5.",
    q: "Which removed tag set face, size and colour through attributes?",
    code: `<font face="Courier" size="4" color="blue">\n  Old-style text.\n</font>`,
    alt: `Use CSS: font-family, font-size and color.` },

  /* ---------- Lists ---------- */
  { id: "ul", t: "<ul>", name: "Unordered list", cat: "list", st: "current",
    desc: "A bulleted list. Each entry goes in an li.",
    q: "Which tag creates a bulleted list?",
    code: `<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Cherry</li>\n</ul>` },
  { id: "ol", t: "<ol>", name: "Ordered list", cat: "list", st: "current",
    desc: "A numbered list, for steps or rankings where order matters.",
    q: "Which tag creates a numbered list?",
    code: `<ol>\n  <li>Open the editor</li>\n  <li>Write some HTML</li>\n  <li>Save and refresh</li>\n</ol>` },
  { id: "li", t: "<li>", name: "List item", cat: "list", st: "current",
    desc: "One entry inside a ul, ol or menu.",
    q: "Which tag defines a single entry inside a list?",
    code: `<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n</ul>` },
  { id: "dl", t: "<dl>", name: "Description list", cat: "list", st: "current",
    desc: "A list of terms and their descriptions, like a glossary.",
    q: "Which tag wraps a list of terms and descriptions?",
    code: `<dl>\n  <dt>HTML</dt>\n  <dd>Standard language for creating web pages.</dd>\n  <dt>CSS</dt>\n  <dd>Used for styling HTML elements.</dd>\n</dl>` },
  { id: "dt", t: "<dt>", name: "Definition term", cat: "list", st: "current",
    desc: "The term being defined inside a dl.",
    q: "Which tag holds the term in a description list?",
    code: `<dl>\n  <dt>Browser</dt>\n  <dd>Software that displays web pages.</dd>\n</dl>` },
  { id: "dd", t: "<dd>", name: "Definition description", cat: "list", st: "current",
    desc: "The explanation that goes with a dt.",
    q: "Which tag holds the explanation of a term in a description list?",
    code: `<dl>\n  <dt>Server</dt>\n  <dd>A computer that delivers web pages.</dd>\n</dl>` },
  { id: "menu", t: "<menu>", name: "Menu", cat: "list", st: "rare",
    desc: "A list of commands. It renders like ul and is rarely used today.",
    q: "Which rarely used tag lists commands like Open and Save?",
    code: `<menu>\n  <li>Open</li>\n  <li>Save</li>\n  <li>Print</li>\n</menu>`,
    note: "For site navigation, use <nav> with a ul." },

  /* ---------- Links & media ---------- */
  { id: "a", t: "<a>", name: "Anchor (link)", cat: "media", st: "current",
    desc: "Creates a hyperlink to another page, file or spot on the same page.",
    q: "Which tag creates a hyperlink?",
    code: `<a href="https://developer.mozilla.org" target="_blank" rel="noopener">Visit MDN</a>`,
    note: "When you use target=\"_blank\", add rel=\"noopener\"." },
  { id: "img", t: "<img>", name: "Image", cat: "media", st: "current",
    desc: "Shows an image. src is the file, alt is the text for people who can't see it.",
    q: "Which void tag displays a picture?",
    code: `<img\n  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect width='160' height='90' fill='%232b4cff'/%3E%3Ctext x='80' y='52' font-size='20' fill='white' text-anchor='middle'%3EHTML%3C/text%3E%3C/svg%3E"\n  alt="Blue placeholder image"\n  width="160" height="90">`,
    note: "Always write alt text. Use alt=\"\" for purely decorative images." },
  { id: "embed", t: "<embed>", name: "Embed", cat: "media", st: "rare",
    desc: "Places external content such as a PDF or plugin object in the page.",
    q: "Which void tag embeds external content like a PDF?",
    code: `<embed src="guide.pdf" type="application/pdf" width="300" height="200">`, inv: true,
    note: "For video and audio prefer <video> and <audio>." },
  { id: "marquee", t: "<marquee>", name: "Marquee", cat: "media", st: "deprecated",
    desc: "Scrolled text across the page. Obsolete, but browsers still run it.",
    q: "Which obsolete tag scrolls text across the screen?",
    code: `<marquee bgcolor="powderblue" direction="left">\n  WELCOME TO MARQUEE PAGE\n</marquee>`,
    alt: `Use a CSS @keyframes animation with transform: translateX().` },

  /* ---------- Forms ---------- */
  { id: "form", t: "<form>", name: "Form", cat: "form", st: "current",
    desc: "Collects input from visitors and sends it to a server.",
    q: "Which tag wraps fields that collect user input?",
    code: `<form action="#" method="post">\n  <label>Name: <input type="text" name="name"></label><br><br>\n  <label>Email: <input type="email" name="email"></label><br><br>\n  <input type="submit" value="Submit">\n</form>` },
  { id: "input", t: "<input>", name: "Input field", cat: "form", st: "current",
    desc: "A field for the visitor to fill in. The type attribute turns it into text, email, checkbox, date and more.",
    q: "Which void tag creates text boxes, checkboxes and other form fields?",
    code: `<input type="text" placeholder="Your name">\n<input type="email" placeholder="you@example.com">\n<input type="checkbox"> Remember me\n<input type="range" min="0" max="10">` },
  { id: "label", t: "<label>", name: "Label", cat: "form", st: "current",
    desc: "Names a form field. Clicking the label focuses the field.",
    q: "Which tag gives a form field a clickable text name?",
    code: `<label for="city">City</label>\n<input id="city" type="text">` },
  { id: "button", t: "<button>", name: "Button", cat: "form", st: "current",
    desc: "A clickable button that can submit a form or run JavaScript.",
    q: "Which tag creates a clickable button?",
    code: `<button type="button">Click me</button>` },

  /* ---------- Tables ---------- */
  { id: "table", t: "<table>", name: "Table", cat: "table", st: "current",
    desc: "Shows data in rows and columns.",
    q: "Which tag creates a data table?",
    code: `<table border="1" cellpadding="6">\n  <tr><th>Tag</th><th>Name</th></tr>\n  <tr><td>&lt;b&gt;</td><td>bold</td></tr>\n  <tr><td>&lt;i&gt;</td><td>italic</td></tr>\n</table>` },
  { id: "tr", t: "<tr>", name: "Table row", cat: "table", st: "current",
    desc: "One horizontal row of cells.",
    q: "Which tag defines a row in a table?",
    code: `<table border="1" cellpadding="6">\n  <tr><td>Row 1, cell 1</td><td>Row 1, cell 2</td></tr>\n  <tr><td>Row 2, cell 1</td><td>Row 2, cell 2</td></tr>\n</table>` },
  { id: "th", t: "<th>", name: "Table header cell", cat: "table", st: "current",
    desc: "A header cell. Bold and centered by default, and announced as a header by screen readers.",
    q: "Which tag defines a header cell in a table?",
    code: `<table border="1" cellpadding="6">\n  <tr><th>Fruit</th><th>Colour</th></tr>\n  <tr><td>Apple</td><td>Red</td></tr>\n</table>` },
  { id: "td", t: "<td>", name: "Table data cell", cat: "table", st: "current",
    desc: "A normal cell that holds data inside a row.",
    q: "Which tag defines a regular data cell in a table?",
    code: `<table border="1" cellpadding="6">\n  <tr><td>One</td><td>Two</td><td>Three</td></tr>\n</table>` }
];

/* Starter page for the playground */
const STARTER = `<h1>My first page</h1>
<p>Edit this code and the <em>preview</em> updates as you type.</p>

<h2>Things I'm learning</h2>
<ul>
  <li>Headings and paragraphs</li>
  <li>Lists and links</li>
  <li>Forms and tables</li>
</ul>

<p><a href="https://developer.mozilla.org" target="_blank">Read the MDN docs</a></p>

<form>
  <label>Name: <input type="text" placeholder="Your name"></label>
  <button type="button">Say hello</button>
</form>

<table border="1" cellpadding="6">
  <tr><th>Tag</th><th>Job</th></tr>
  <tr><td>&lt;p&gt;</td><td>Paragraph</td></tr>
  <tr><td>&lt;a&gt;</td><td>Link</td></tr>
</table>`;
