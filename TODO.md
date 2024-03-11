# Where am I?

# TODO List

[] update the token process to use this hook in this tutorial https://docs.directus.io/guides/extensions/interfaces-radio-selector-icons.html

[] use the FieldService to fetch the default values and pass through to interface
x support multiple uploads
x display unsaved images
x title and description fields when creating / editing
x open non-saved images
x edit non-saved images details / retake?
x delete items
x fix image sizing issue
x Move the LiveView into ImageCaptureDrawer 
x download saved and staged images
x update UI to match multiple files
x code cleanup and commenting
x move the input form from the LiveView so that it only emits an image blob
x make the LiveView props `width` and `height` config driven
x un-delete item option on saved items
x set the default value for the device width and height to use 

# Bugs

-----------------------------------------

Issue:
Sometimes after I reload the extension and I refresh the browser while looking at a entry with a known set of items previously saved; the UI indicates there are no item and doesn't present any information.

Cause:
I think I need to add a watch on the `value` to ensure when the api returns the data it's processed

Fix:
Put a watch on props `primaryKey` which is returning `+` initially, and there was nothing triggering a reload if the other components had already mounted.


-----------------------------------------

Issue:
When the item with thumbnails is open and the user doesn't interact with the app for a while, 
When the thumbnail is clicked the image is not fetched and there is a 401 error.

Cause:
The method of fetching was based on reusing a token after fetching the image. The token was expiring. 

Fix:
Use the Axois instance to fetch the image and use a bas64 string as the image source

[x] fixed

-----------------------------------------

Issue:
Directus isn't noticing when a change is made to the file object (title, description) on a saved image

Cause:
I've implemented the update in the `useRelatedImages` hook by directly mutating the values using the File API. Where it should insted be sent as an `update` property:

```json
{
    {
    "create": [],
    "update": [
        {
            "directus_files_id": {
                "description": "🤦!",
                "id": "e0bc33ee-0353-4e08-90e8-42a4ed70d67d"
            },
            "id": 39
        }
    ],
    "delete": []
}
}

Fix:


[] fixed

-----------------------------------------

```




---


# Scratch

// FileObject
```json
[
  {
    "id": "e0bc33ee-0353-4e08-90e8-42a4ed70d67d",
    "storage": "local",
    "filename_disk": "e0bc33ee-0353-4e08-90e8-42a4ed70d67d.jpeg",
    "filename_download": "1707387019864",
    "title": "Face palm",
    "type": "image/jpeg",
    "folder": "1b770a21-f67a-41b0-865f-93a80fb7179b",
    "uploaded_by": "649b6031-fa22-41c4-8ba3-9c2b544f2e38",
    "uploaded_on": "2024-02-08T10:10:19.941Z",
    "modified_by": null,
    "modified_on": "2024-02-08T10:10:20.013Z",
    "charset": null,
    "filesize": "427662",
    "width": 1280,
    "height": 720,
    "duration": null,
    "embed": null,
    "description": "🤦",
    "location": null,
    "tags": null,
    "metadata": {}
  }
]
``

// View Item
```json
[
  {
    "id": "e0bc33ee-0353-4e08-90e8-42a4ed70d67d",
    "type": "image/jpeg",
    "title": "Face palm",
    "filename_download": "1707387019864",
    "modified_on": "2024-02-08T10:10:20.013Z",
    
    "url": "/assets/e0bc33ee-0353-4e08-90e8-42a4ed70d67d?cache-buster=2024-02-08T10:10:20.013Z",
    "itemId": 39
  }
]
``