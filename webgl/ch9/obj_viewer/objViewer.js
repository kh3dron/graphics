// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;
  uniform vec3 u_AmbientLight;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    vec4 vertexPosition = u_ModelMatrix * a_Position;
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
    float nDotL = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
  }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

function main() {
  var canvas = document.getElementById('webgl');
  var hud = document.getElementById('hud');
  var gl = getWebGLContext(canvas);
  var ctx = hud.getContext('2d');

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  var program = gl.program;
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  program.u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
  program.u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
  program.u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

  var model = initVertexBuffers(gl, program);

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 5000.0);

  var eyeX = -50.0, eyeY = 100.0, eyeZ = 200.0;
  var centerX = 10.0, centerY = 10.0, centerZ = 10.0;
  var initialLookAngle = Math.atan2(centerZ-eyeZ, centerX-eyeX);
  console.log(initialLookAngle * Math.PI / 180.0);

  viewProjMatrix.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0.0, 1.0, 0.0);


  gl.uniform3f(program.u_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(program.u_LightPosition, 2.3, 4.0, 3.5);
  gl.uniform3f(program.u_AmbientLight, 0.2, 0.2, 0.2);

  readOBJFile('../resources/cubes.obj', gl, model, 60, true);

  var posX = 0.0, posY = 0.0, posZ = 0.0;

  var currentAngle = [0.0, 0.0];
  initEventHandlers(canvas, currentAngle);

  window.addEventListener('keydown', function (ev) {
    var rad = currentAngle[1] * Math.PI / 180.0;
    console.log(rad);
    var cosRad = Math.cos(rad);
    var sinRad = Math.sin(rad);

    switch (ev.key) {
      case 'w':
        posX += sinRad * 10.0;
        posZ -= cosRad * 10.0;
        break;
      case 's':
        posX -= sinRad * 10.0;
        posZ += cosRad * 10.0;
        break;
      case 'a':
        posX -= cosRad * 10.0;
        posZ -= sinRad * 10.0;
        break;
      case 'd':
        posX += cosRad * 10.0;
        posZ += sinRad * 10.0;
        break;
      default: return;
    }
  });

  window.addEventListener('wheel', function (ev) {
    if (ev.deltaY < 0) {
      posY -= 10.0; // Zoom in
    } else {
      posY += 10.0; // Zoom out
    }
  });

  function tick() {
    draw(gl, gl.program, posX, posY, posZ, currentAngle, viewProjMatrix, model);
    draw2d(ctx, posX, posY, posZ, currentAngle);
    requestAnimationFrame(tick);
  }
  tick();
}

function initVertexBuffers(gl, program) {
  var o = new Object();
  o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
  o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
  o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
  o.indexBuffer = gl.createBuffer();
  if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return o;
}

function createEmptyArrayBuffer(gl, a_attribute, num, type) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
  return buffer;
}

function draw2d(ctx, posX, posY, posZ, currentAngle) {
  ctx.clearRect(0, 0, 400, 400);
  ctx.font = '18px "Times New Roman"';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillText('Position X: ' + Math.floor(posX), 40, 40);
  ctx.fillText('Position Y: ' + Math.floor(posY), 40, 60);
  ctx.fillText('Position Z: ' + Math.floor(posZ), 40, 80);
  ctx.fillText('Current Angle: ' + Math.floor(currentAngle[1]), 40, 100);
  ctx.fillText('Walk with WASD', 40, 120);
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function draw(gl, program, posX, posY, posZ, currentAngle, viewProjMatrix, model) {
  if (g_objDoc != null && g_objDoc.isMTLComplete()) {
    g_drawingInfo = onReadComplete(gl, model, g_objDoc);
    g_objDoc = null;
  }
  if (!g_drawingInfo) return;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

  g_mvpMatrix.set(viewProjMatrix);
  // g_mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
  g_mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
  g_mvpMatrix.multiply(g_modelMatrix);
  g_mvpMatrix.translate(-posX, posY, -posZ);

  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function initEventHandlers(canvas, currentAngle) {
  var dragging = false;
  var lastX = -1, lastY = -1;

  window.onmousedown = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  window.onmouseup = function (ev) { dragging = false; };

  window.onmousemove = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height;
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);

      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] - dx;
    }
    lastX = x; lastY = y;
  };
}
