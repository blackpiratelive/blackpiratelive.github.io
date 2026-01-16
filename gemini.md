# Gemini Agent Context: blackpiratex.com

This document provides an overview of the `blackpiratex.com` project for the Gemini agent.

## Project Overview

This is a personal website and blog built with the [Hugo](https://gohugo.io/) static site generator. The website serves as a portfolio, blog, and personal space for the owner.

## Technology Stack

*   **Static Site Generator:** Hugo
*   **Theme:** A custom theme named `blackpiratex` located in `themes/blackpiratex`.
*   **Serverless Functions:** The `api` directory contains Node.js serverless functions.
    *   `api/mood.js`: A function that fetches mood data from an external API and returns a formatted HTML snippet.
*   **Deployment:** The presence of `sitemap-netlify.xml` and serverless functions suggests the site is likely deployed on Netlify.

## Content Structure

The website's content is organized in the `content` directory and includes the following sections:

*   `about`: Information about the website owner.
*   `blog`: Blog posts.
*   `gallery`: A photo gallery.
*   `projects`: A portfolio of projects.
*   `music`: Information about music.
*   `now`: A "now" page describing current activities.
*   `recommendations`: Recommendations from the owner.
*   Other pages like `bookmarks`, `contact`, `credits`, `hobbies`, `search`, and `sitemap`.

## Key Features

*   **Personal Blog:** The site features a blog with posts on various topics.
*   **Project Portfolio:** The `projects` section showcases the owner's work.
*   **Photo Gallery:** The `gallery` section displays a collection of photos.
*   **Mood Tracker Display:** A unique feature on the site is a mood tracker display, powered by a serverless function that fetches data from an external API.

## Editing Guidelines

*   **Adding/Editing Content:** To add or edit content, modify the markdown files in the `content` directory.
*   **Theme Customization:** To customize the website's appearance or layout, edit the files in the `themes/blackpiratex` directory. The layouts are in `themes/blackpiratex/layouts`.
*   **Serverless Functions:** The serverless functions in the `api` directory can be modified to add or change server-side functionality.
*   **Building the Site:** Use the `hugo` command to build the site locally.
