# Kansai Trip Map

A shareable travel planning site for a Kansai trip. The app combines a zoomable map, 3D-style attraction cards, Google place photos, and embedded transit directions so a group can keep a shared list of places in one web app.

## Features

- Zoomable Kansai map with linked attraction markers
- 3D attraction card carousel with synced selection state
- Add and delete attractions by name
- Automatic place lookup and region detection
- Google place photos with attribution
- Embedded Google Maps transit directions between two selected spots
- Shared cloud-backed spot list across browsers and devices

## Tech Stack

- Frontend: plain HTML, CSS, and JavaScript
- Map: Leaflet + OpenStreetMap tiles
- Place search and photos: Google Places API via Vercel serverless functions
- Embedded directions: Google Maps Embed API
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
└── .env.example
```

## How Data Works

- The main attraction list is stored in Vercel Blob so all visitors to the deployed site can share one list.
- The browser also keeps a local cache in `localStorage` as a fallback.
- If shared storage is temporarily unavailable, the app continues to work with local data on that device.

## Environment Variables

Create a `.env.local` file for local development, or add the same values in Vercel:

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_EMBED_API_KEY=your_google_maps_embed_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
```

### What each variable is for

- `GOOGLE_MAPS_API_KEY`
  Used by the serverless functions for Google Places search and place photos.

- `GOOGLE_MAPS_EMBED_API_KEY`
  Used for the embedded Google Maps directions iframe.

- `BLOB_READ_WRITE_TOKEN`
  Used by the shared storage API to read and write the common attraction list.

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
4. Create and connect a Vercel Blob store to the project if you have not already.
5. Redeploy the project.

## Google Cloud Setup

You should use two separate Google API keys:

### 1. Server key

Use this for `GOOGLE_MAPS_API_KEY`.

- Enable `Places API (New)`
- Restrict the key to only the APIs needed by the backend

### 2. Embed key

Use this for `GOOGLE_MAPS_EMBED_API_KEY`.

- Enable `Maps Embed API`
- Set `Application restrictions` to `HTTP referrers`
- Allow only your production domain, for example:

```text
https://your-project.vercel.app/*
```

- Set `API restrictions` to `Maps Embed API` only

## Notes

- The server-side Google key and Blob token are not stored in the repository.
- The embed key is intentionally separate because embedded Google Maps must run in the browser.
- This project does not require a frontend framework or build step.

## License

No license has been added yet.
