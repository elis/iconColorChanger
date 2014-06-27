/**
	// Usage
	var iconColorChanger = require('iconColorChanger');
	
	iconColorChanger('/my-icon-file.png', '#FF0000', 'data-png', function (data) {
		var img = document.createElement('img');
		img.src = data;
		document.body.appendChild(img); // red colored icon
	});
	
	
	iconColorChanger('/my-icon-file.png', '#0000FF', 'image-data', function (data) {
		chrome.browserAction.setIcon({
			imageData: data
		});
		
		// Browser action is now blue
	});
	
**/
	
(function() {
	var iconColorChanger = (function() {
		var canvas, context, iconElement;
		
		
		/*
			string 		iconUrl 	path to image
			string		newColor	hex color
			string		[type]		'image-data' or 'data-png'
			function	callback (data)
		*/
		function init (iconUrl, newColor, type, callback) {
			if (!callback && typeof type == 'function') {
				callback = type;
				type = 'image-data';
			}
			getContext();
			
			iconElement = document.createElement('img');
			iconElement.addEventListener('load', imageReady);
			iconElement.src = iconUrl;
			
			function imageReady () {
				canvas.width = iconElement.width;
				canvas.height = iconElement.height;
				
				changeColor(newColor, 1);
								
				if (type == 'data-png') {
		      callback(canvas.toDataURL("image/png", 1));
				} else /* if (type == 'image-data') */ {
					callback(context.getImageData(0,0, canvas.width, canvas.height));
				}
				
				iconElement.remove();
			}
		}
		
		function getCanvas () {
			if (!canvas) {
	    	canvas = document.createElement("canvas"); // shared instance
	      context = canvas.getContext("2d");
			}
			return canvas;
		}
		
		function getContext () {
			if (!context) {
				getCanvas();
			}
			return context;
		}
		
		function changeColor (color, alpha) {
			getContext();
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    context.drawImage(iconElement, 0, 0, canvas.width, canvas.height);
	    desaturate();
	    colorize(color, alpha);
	  }
	  
	  function desaturate() {
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
				pixels = imageData.data,
				i, l, r, g, b, a, average;

			for (i = 0, l = pixels.length; i < l; i += 4) {
				a = pixels[i + 3];
				if (a === 0) {
					continue;
				} // skip if pixel is transparent

				r = pixels[i];
				g = pixels[i + 1];
				b = pixels[i + 2];

				average = (r + g + b) / 3 >>> 0; // quick floor
				pixels[i] = pixels[i + 1] = pixels[i + 2] = average;
			}

			context.putImageData(imageData, 0, 0);
	  }

	  function colorize(color, alpha) {
			context.globalCompositeOperation = "source-atop";
			context.globalAlpha = alpha;
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
			// reset
			context.globalCompositeOperation = "source-over";
			context.globalAlpha = 1.0;
	  }
		
		return init;
	}());

	if (module && module.hasOwnProperty('exports')) {
		module.exports = iconColorChanger;
	}
}());