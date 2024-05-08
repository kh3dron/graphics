// HelloCanvas.js

function main() {
    // Retrieves <canvas> element
    var canvas = document.getElementById('webgl');

    // get the rendering context for webgl
    var gl = getWebGlContext(canvas);
    if (!gl){
        console.log('Failed to get the rendering context for webGL');
        return;
    }

    gl.clearColor(0.0, 0.0, 0,0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

