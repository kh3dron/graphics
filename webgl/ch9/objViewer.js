var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Coordinate transformation matrix of the normal
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {

  var canvas = document.getElementById('webgl');
  var hud = document.getElementById('hud');
  var gl = getWebGLContext(canvas);
  var ctx = hud.getContext('2d');

  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of attribute and uniform variables
  var program = gl.program;
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal');

  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  program.u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
  program.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  program.u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');

  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

  // Prepare empty buffer objects for vertex coordinates, colors, and normals
  var model = initVertexBuffers(gl, program);

  // View projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 5000.0);
  viewProjMatrix.lookAt(-50.0, 100.0, 200.0, 10.0, 10.0, 10.0, 0.0, 1.0, 0.0);

  // Set light color and ambient light color
  gl.uniform3f(program.u_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(program.u_LightPosition, 2.3, 4.0, 3.5);
  gl.uniform3f(program.u_AmbientLight, 0.2, 0.2, 0.2);

  // Start reading the OBJ file
  readOBJFile('../resources/cubes.obj', gl, model, 60, true);

  // Variables to store position
  var posX = 0.0, posY = 0.0; posZ = 0.0;
  var currentAngle = [0.0, 0.0]; // [x-axis, y-axis] degrees
  initEventHandlers(canvas, currentAngle);

  // Handle key press events
  window.addEventListener('keydown', function (ev) {
    switch (ev.key) {
      case 'w': posY += 10.0; break;
      case 's': posY -= 10.0; break;
      case 'a': posX -= 10.0; break;
      case 'd': posX += 10.0; break;
      case 'q': posZ += 10.0; break;
      case 'e': posZ -= 10.0; break;
      default: return;
    }
  });

  var tick = function () {
    draw(gl, gl.program, posX, posY, posZ, currentAngle, viewProjMatrix, model);
    draw2d(ctx, posX, posY, posZ); // HUD drawing
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

// Create an buffer object and perform an initial configuration
function initVertexBuffers(gl, program) {
  var o = new Object(); // Utilize Object object to return multiple buffer objects
  o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
  o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
  o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
  o.indexBuffer = gl.createBuffer();
  if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return o;
}

// Create a buffer object, assign it to attribute variables, and enable the assignment
function createEmptyArrayBuffer(gl, a_attribute, num, type) {
  var buffer = gl.createBuffer();  // Create a buffer object

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);  // Enable the assignment

  return buffer;
}

function draw2d(ctx, posX, posY, posZ) {
  ctx.clearRect(0, 0, 400, 400); // Clear <hud>
  ctx.font = '18px "Times New Roman"';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
  ctx.fillText('Position X: ' + Math.floor(posX), 40, 40);
  ctx.fillText('Position Y: ' + Math.floor(posY), 40, 60);
  ctx.fillText('Position Z: ' + Math.floor(posZ), 40, 80);
  ctx.fillText('Walk with WASD', 40, 100);
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function draw(gl, program, posX, posY, posZ, currentAngle, viewProjMatrix, model) {
  if (g_objDoc != null && g_objDoc.isMTLComplete()) { // OBJ and all MTLs are available
    g_drawingInfo = onReadComplete(gl, model, g_objDoc);
    g_objDoc = null;
  }
  if (!g_drawingInfo) return;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear color and depth buffers

  //g_modelMatrix.setTranslate(posX, posY, 0.0); // Set position
  // g_modelMatrix.rotate(90.0, 1.0, 0.0, 0.0); // Rotate around x-axis

  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // y axis rotation (x axis disabled)
  g_mvpMatrix.multiply(g_modelMatrix);
  g_mvpMatrix.translate(-posX, posZ, posY);
  
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  // Draw
  gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function initEventHandlers(canvas, currentAngle) {
  var dragging = false;
  var lastX = -1; var lastY = -1;

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
    var x = ev.clientX; var y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height;
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);

      // limit x axis rotation to +- 90 degrees
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] - dx;
    }
    lastX = x, lastY = y;
  };
}