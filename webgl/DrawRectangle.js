// DrawRectangle.js

function main() {
    // Retrieve the <canvas> element
    var canvas = document.getElementById('example')
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

// get the rendering context for 2DCG
var ctx = canvas.getContext('2d');

// Draw a bleu rectangle
ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
ctx.fillRect(120, 10, 150, 150);
}

