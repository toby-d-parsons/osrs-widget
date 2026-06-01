# OSRS XENEON EDGE Widget

A custom iCUE widget for the Corsair XENEON EDGE that displays Old School RuneScape player stats, including skills, bosses, and combat summary data.

The widget is built as a native iCUE widget using HTML, CSS, and JavaScript.

## Features

* Displays OSRS skill data
* Displays boss/activity data
* Shows player summary information
* Supports manual refresh
* Automatically refreshes data on an interval
* Uses a Cloudflare Worker/API endpoint to retrieve OSRS data

## Project Structure

```text

├── index.html
├── main.js
├── manifest.json
├── translation.json
├── config.js
├── resources/
│   ├── fonts/
│   ├── high-scores/
│   └── skill_icons/
└── styles/
    └── main.css
```

## Local Configuration

Create a `config.js` file in the project root.

This file is ignored by Git and should contain your Worker URL:

```js
var workerUrl = "";
```

Example:

```js
var workerUrl = "https://your-worker-url.workers.dev";
```

## Packaging

Package the widget using the iCUE widget CLI:

```powershell
icuewidget package osrs-widget
```

The generated `.icuewidget` file is a build artifact and should not be committed to source control.

## Notes

* `config.js` is not committed because it contains environment-specific configuration.
* `*.icuewidget` files are ignored because they are generated package outputs.
* The widget depends on the configured Worker URL returning OSRS player data in the expected format.