# Kansai Trip Map

A shareable trip-planning site for a Kansai itinerary. The app combines a zoomable map, 3D-style attraction cards, Google place search and photos, embedded transit directions, and date-based weather lookup in one lightweight web app.

## Overview

This project is designed for planning a group trip before day-by-day scheduling is finalized. Instead of focusing on a fixed route first, it helps collect attractions, visualize where they are, compare how to move between them, and quickly check weather for a selected place and date.

## Features

- Zoomable Kansai map with synced attraction markers
- 3D attraction card stage linked with the map and side list
- Add attractions by name with automatic place lookup
- Delete attractions with confirmation to avoid accidental removal
- Shared cloud-backed attraction list across browsers and devices
- Google place photos with a collapsible attribution panel
- Embedded Google Maps transit directions between two selected attractions
- Date-based weather lookup with daily summary
- Hourly weather timeline and hourly precipitation chance chart
- Collapsible weather and transit sections to keep the page compact

## Tech Stack

- Frontend: plain HTML, CSS, and JavaScript
- Map: Leaflet + OpenStreetMap tiles
- Place search and photos: Google Places API via Vercel serverless functions
- Embedded directions: Google Maps Embed API
- Weather: Open-Meteo forecast API
- Shared storage: Vercel Blob
- Deployment: Vercel

## Project Structure

```text
.
├── api/
│   ├── place-photo-media.js
│   ├── place-photo.js
│   ├── place-search.js
│   ├── public-config.js
│   └── shared-spots.js
├── index.html
├── script.js
├── styles.css
├── package.json
├── README.md
└── .env.example
```

## How It Works

### Attractions

- The app starts from a default spot list defined in `script.js`.
- New attractions are searched by name and then converted into stored spots with name, region, coordinates, and image metadata.
- Deleting a spot removes it from the shared list after a confirmation step.

### Shared Data

- The main spot list is stored in Vercel Blob so visitors on the deployed site can share one common attraction list.
- The browser also keeps a local cache in `localStorage` as a fallback.
- If shared storage is temporarily unavailable, the site can still work with local data on that device.

### Weather

- Weather results are fetched from Open-Meteo using the selected spot coordinates and date.
- The UI shows a daily summary, hourly forecast strip, and an hourly precipitation probability chart.

### Transit

- The route planner embeds Google Maps transit directions for the selected origin and destination.
- The route panel is intentionally lightweight and relies on the embedded Google Maps experience rather than rebuilding the full Google transit UI in-page.

## Environment Variables

Create a `.env.local` file for local development, or add the same values in Vercel:

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_EMBED_API_KEY=your_google_maps_embed_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
```

### Variable Guide

- `GOOGLE_MAPS_API_KEY`
  Used by the serverless functions for Google Places search and place photos.

- `GOOGLE_MAPS_EMBED_API_KEY`
  Used for the embedded Google Maps directions iframe.

- `BLOB_READ_WRITE_TOKEN`
  Used by the shared storage API to read and write the shared attraction list.

## Local Development

This project is intended to run with Vercel so the serverless functions are available.

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in the values.

3. Start local development:

```bash
vercel dev
```

4. Open the local URL shown by Vercel.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables:
   - `GOOGLE_MAPS_API_KEY`
   - `GOOGLE_MAPS_EMBED_API_KEY`
   - `BLOB_READ_WRITE_TOKEN`
4. Create and connect a Vercel Blob store to the project.
5. Redeploy the project after environment variables or storage are added.

## Google Cloud Setup

Use two separate Google API keys.

### Server Key

Use this for `GOOGLE_MAPS_API_KEY`.

- Enable `Places API (New)`
- Restrict the key to only the backend APIs you need

### Embed Key

Use this for `GOOGLE_MAPS_EMBED_API_KEY`.

- Enable `Maps Embed API`
- Set `Application restrictions` to `HTTP referrers`
- Allow only your deployment domains, for example:

```text
https://your-project.vercel.app/*
```

- Set `API restrictions` to `Maps Embed API` only

## Security Notes

- The server-side Google key and Blob token are not stored in the repository.
- The embed key is intentionally separate because embedded Google Maps must run in the browser.
- The embed key should always be restricted by referrer and API scope.

## Development Notes

- The project does not require a frontend framework or build step.
- Weather data is client-side and depends on the selected coordinates and the forecast range available from Open-Meteo.
- Shared spot data depends on Vercel Blob being connected and `BLOB_READ_WRITE_TOKEN` being available at runtime.

## License

No license has been added yet.
