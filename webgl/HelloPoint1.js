// HelloPoint1.js
// Vertex shader program
var VSHADER_SOURCE =
    'void main() {\n' +
    ' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Coordinates
    ' gl_PointSize = 10.0;\n' + // Set the point size
    '}\n';
// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
    '}\n';

function main() {

    var canvas = document.getElementById('webgl');


    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
} 