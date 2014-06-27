iconColorChanger
================

A simple method to change a color of a PNG icon.

## Usage

Using `data-png` (base64) to use with image elements.

```javascript

	var iconColorChanger = require('iconColorChanger');
	
	iconColorChanger('/my-icon-file.png', '#FF0000', 'data-png', function (data) {
		var img = document.createElement('img');
		img.src = data;
		document.body.appendChild(img); // red colored icon
	});
```

Using `image-data` (canvas 2d context)

```javascript
	
	iconColorChanger('/my-icon-file.png', '#0000FF', 'image-data', function (data) {
		chrome.browserAction.setIcon({
			imageData: data
		});
		
		// Browser action is now blue
	});
```

Eli Sklar - June 2014