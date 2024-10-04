# zen app - machine building week (how to make almost anything, mit)

This project includes a Node.js server script and a web page that connects to it.

[Node.js](https://nodejs.org/en/about/) is a popular runtime that lets you run server-side JavaScript. This project uses the [Fastify](https://www.fastify.io/) framework and explores basic templating with [Handlebars](https://handlebarsjs.com/).

## How to Set Up

1. Download files
2. [Install Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you haven't yet
3. Install Fastify (npm install fastify)
4. From your terminal, go to the folder, then run **node server.js**
5. Open the URL from your terminal in a browser

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool website does and how you built it.

← `public/style.css`: The styling rules for the pages in your site.

← `server.js`: The **Node.js** server script for your new site. The JavaScript defines the endpoints in the site back-end, one to return the homepage and one to update with the submitted color. Each one sends data to a Handlebars template which builds these parameter values into the web page the visitor sees.

← `package.json`: The NPM packages for your project's dependencies.

← `src/`: This folder holds the site template along with some basic data files.

← `src/pages/index.hbs`: This is the main page template for your site. The template receives parameters from the server script, which it includes in the page HTML. The page sends the user submitted color value in the body of a request, or as a query parameter to choose a random color.

← `src/seo.json`: When you're ready to share your new site or add a custom domain, change SEO/meta settings in here.

## Testing Gcode

https://ncviewer.com/ - copy and paste contents of gcode here
