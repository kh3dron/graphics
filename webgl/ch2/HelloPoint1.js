// HelloPoint1.js with embeded shader programs


// Vertex shader program ( Written in GLSL ES ) 
var VSHADER_SOURCE =
    'void main() {\n' +
    ' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

// Fragment shader program ( Written in GLSL ES )
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + 
    '}\n';

// Main function ( Written in JavaScript )
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