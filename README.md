# Webcam Capture Interface

The **Webcam Capture Interface** is an extension for [Directus](https://directus.io) designed to capture one or more images using a device's webcam.

## Features

- **Multiple Files Field**: Integrates with the Directus multiple files field to store captured images.
- **Live Webcam Feed**: Captures images directly from a live webcam stream.
- **Image Metadata**: Includes basic fields for adding and editing image metadata (e.g., name and description).
- **Camera Permissions**: Requests camera access and handles user permissions gracefully.
- **Camera Settings Storage**: Remembers the user's previous camera selection using local storage for convenience.
- **User-Configurable Options**:
  - **Root Folder**: Set a default folder for uploading captured images.
  - **Camera Dimensions**: Configure the resolution of the captured images.

## Installation

To install the extension, run:

```bash
npm install directus-extension-webcam-capture-interface
```

## Usage Notes

### Accessing Webcam on Private Networks

To use this extension across a **private network** without HTTPS (which the webcam requires), you'll need to configure Chrome to allow webcam access over an insecure origin. You can do this by enabling the `Insecure origins treated as secure` flag in Chrome.

1. Open Chrome and navigate to `chrome://flags`.
2. Search for `Insecure origins treated as secure`.
3. Add your private network address (e.g., `http://192.168.0.1`) to the list of allowed origins.

This will allow webcam functionality to work on your private network without requiring an HTTPS connection.

---

Let me know if you need further adjustments!

### Screens

<figure>
    <figurecaption>Entrypoint</figurecaption>
    <img src="https://raw.githubusercontent.com/veryphatic/directus-webcam-capture-interface/main/screens/entrypoint.png" />
</figure>
<figure>
    <figurecaption>Image listing</figurecaption>
    <img src="https://raw.githubusercontent.com/veryphatic/directus-webcam-capture-interface/main/screens/image_list.png" />
</figure>
<figure>
    <figurecaption>Live video capture</figurecaption>
    <img src="https://raw.githubusercontent.com/veryphatic/directus-webcam-capture-interface/main/screens/live_video.png" />
</figure>