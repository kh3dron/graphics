// ClickedPoint.js
// Vertex shader program

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' + 
    'uniform vec4 u_FragColor;\n' + // uniform variable
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' +
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

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // anonymous function, prevents global variable pollution
    canvas.onmousedown = function (ev) { 
        click(ev, gl, canvas, a_Position, u_FragColor);
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX; 
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    
    // client area != canvas area != webgl area
    // canvas origin is at the top-left corner, while webgl origin is at the center

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push([x, y]);
    g_colors.push([Math.random(), Math.random(), Math.random(), 1.0]);

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;

    for (var i = 0; i < len; i += 1) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}