# Care@Home Website

The official website of **Care@Home – AI that Cares for Aging at Home**, a European research project focused on AI-powered, privacy-preserving monitoring technologies that support independent living for older adults.

**Website:** https://icareathome.eu

## About the Project

Care@Home aims to develop an intelligent, contactless monitoring ecosystem that helps older adults live independently for longer while supporting caregivers, families, and healthcare professionals.

The project brings together **9 partners from 7 European countries**, coordinated by Kaunas University of Technology.

## Website

The website provides information about:

- Project vision and objectives
- Consortium partners
- Work Packages (WP1–WP6)
- Project timeline and milestones
- News and events
- Contact information

## Technologies

The website is built using:

- React
- Vite
- Tailwind CSS
- JavaScript
- GitHub Pages

## Project Structure

Website content is managed through the following files:

```text
src/content/
  pages/          Page texts
  events/         News and events
  people.json     Contact information
  partners.json   Consortium partners
  site.json       General website settings

public/
  images/         Photos and logos
  documents/      Attached documents
  CNAME           Custom domain configuration
```

## Run Locally

Install [Node.js](https://nodejs.org/) (LTS) and run:

```bash
npm install
npm run dev
```

To build the website:

```bash
npm run build
```

## Content Management

Website content can be updated without modifying the application code.

### Add an Event

1. Run `npm run new-event` to create a new event file.
2. Add event photos to the generated folder in `public/images/events/`.
3. Edit the event's Markdown file in `src/content/events/`.

Event files contain the title, date, location, description and optional images or attachments.

### Update Website Content

- **Page texts:** `src/content/pages/`
- **Contact persons:** `src/content/people.json`
- **Consortium partners:** `src/content/partners.json`
- **General settings:** `src/content/site.json`
- **Images and logos:** `public/images/`

Use approved project content, images and partner logos. Keep the required funding acknowledgements unchanged.

## Deployment

The website is hosted on **GitHub Pages** and deployed using **GitHub Actions**.

Once GitHub Pages is configured to use GitHub Actions, changes pushed to the `website` branch automatically trigger a new build and deployment.

## Funding

This project received funding from the Research Council of Lithuania (LMTLT), agreement No. S-THCS-26-2, under the framework of Transforming Health and Care Systems (THCS), supported by the European Union's Horizon Europe Research and Innovation Programme (Grant Agreement No. 101095654).
