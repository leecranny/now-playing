# Headwaves

## Running locally

The project has two parts, an API component and a frontend.

## API Component

Create a `.env` file within `api/` with the following

`SPOTIFY_CLIENT_ID={redacted}
SPOTIFY_CLIENT_SECRET={redacted}
SPOTIFY_REFRESH_TOKEN={redacted}`

then

```bash
cd api/
npm install #first time only or after updating dependencies
npm run start
```

Runs locally at http://localhost:7001

## Frontend Component

Create a `.env` file within `/` with the following

`REACT_APP_API_ENDPOINT=http://localhost:7001/currentlyPlaying/`

then

```bash
npm install #first time only or after updating dependencies
npm run start
```

Runs locally at http://localhost:3000

### Building a static version

The frontend can generate a static version using the following:

```bash
npm run build
```

The files are created in the `build/`directory.
