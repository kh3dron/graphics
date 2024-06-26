// ClickedPoint.js
// Vertex shader program

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform vec4 u_Translation;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position + u_Translation;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // the importand method
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

}
function initVertexBuffers(gl) {
    // webgl has typed arrays
    // they do not support push and pop methods
    var vertices = new Float32Array([
        0.5, 0.5, -0.5, 0.5, -0.5, -0.5
    ]);
    var n = 3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failse to create the buffer object ');
        return -1;
    }

    // bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}

