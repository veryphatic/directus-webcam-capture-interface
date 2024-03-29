# Webcam Capture Interface

The Webcam Capture Interface is an extension for [Directus](https://directus.io) designed to capture one or more images using a device webcam.

Features include:

- Utilizes the Multiple files field.
- Captures images from a live webcam feed.
- Basic image metadata input fields for capturing and editing (name and description).
- User-friendly interface for requesting camera permissions.
- Previous camera selection is stored locally using local storage.
- User-configurable options include:
    - Root folder: Set the default folder for image uploads.
    - Camera dimensions: Adjust the device image resolution.

### Installation

`npm install directus-extension-webcam-capture-interface`

### Screngrabs

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

### TODO

- abilty to zoom into image in live view and capture at set resolution
- add semantic commit
- auto semver
