// ClickedPoint.js
// Vertex shader program

var VSHADER_SOURCE =
    //x' = x cos b - y sin b
    //y' = x sin b + y cos b
    //z' = z
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' +
    'uniform vec4 u_Translation;\n' +
    'void main() {\n' +
    ' gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    ' gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
    ' gl_Position.z = a_Position.z;\n' +
    ' gl_Position.w = 1.0;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

// Rotation angle
var ANGLE = 90.0;

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

    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // the importand method
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

}
function initVertexBuffers(gl) {
    // webgl has typed arrays
    // they do not support push and pop methods
    var vertices = new Float32Array([
        -0.5, -0.5, 0.5, -0.5, 0.0, 0.5
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

