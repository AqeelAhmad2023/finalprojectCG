var g_jointNeeAngle = 0.0;
var g_jointNeeAngle1 = 0.0;
var g_joint2AngleToe = 90.0;
var g_joint2AngleToe1 = 90.0;
var bodyelevation = -1.5
var ANGLE_STEP0 = 20.0;
var ANGLE_STEP1 = 15.0;
var ANGLE_STEP2 = 10.0;
var ANGLE_STEP3 = 5.0;
var ANGLE_STEP4 = 0.0;
var ANGLE_STEP5 = -5.0;
var ANGLE_STEP6 = -10.0;
var ANGLE_STEP7 = -15.0;
var ANGLE_STEP8 = -20.0;
var GROUNGSPEED = .3
var viewX = 0
var viewY = -12
var viewZ = 70
var polWidth = 4
var polHight = 1
var polLength = 30
// increementation angle
var g_arm1Angle =-90.0; 

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  // Defined for constant in main fu
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Our Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  vec4 color = vec4(1.0, 1.0, 1., 1.0);\n' + // Sphere color
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // Calculate the vertex position in the world coordinate
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Color = color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +
  'varying vec4 v_Color;\n' +
  'uniform vec3 u_Viewpoint;\n' +
  'uniform float u_PhongExponent;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  // Normalize the normal because it is interpolated and not 1.0 in length any more
  '  vec3 normal = normalize(v_Normal);\n' +
  // '  float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
  // Calculate the light direction and make it 1.0 in length
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
  // The dot product of the light direction and the normal
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  // Calculate the final color from diffuse reflection and ambient reflection
  '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
  '  vec3 refl = 2.*nDotL*normal - lightDirection;\n' +
  '  vec3 view = normalize(u_Viewpoint - v_Position);\n' +
  '  float phong_dot = max(dot(refl, view), 0.0);\n' +
  '  vec3 phong = .45*pow(phong_dot, 6.0)*u_LightColor;\n' +
  '  gl_FragColor = vec4(diffuse + ambient + phong, v_Color.a);\n' +
  // '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
  '}\n';


var VSHADER_SOURCE2 =
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE2 =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

var all=[-0.9, 0];
var all2=[0.9, 0];
var kneecontrolPts = [

  all,
  [-0.785, -0.02],
  [-0.6799999999999999, -0.05500000000000003],
  [-0.58, -0.17000000000000004],
  [-0.48, -0.28500000000000003],
  [-0.30999999999999994, -0.245],
  [-0.20999999999999994, -0.245],
  [-0.11, -0.245],
  [0.04499999999999997, -0.24500000000000008],
  [0.14500000000000002, -0.24500000000000008],
  [0.24500000000000005, -0.24500000000000008],
  [0.35000000000000014, -0.21500000000000008],
  [0.4250000000000001, -0.18000000000000005],
  [0.5000000000000001, -0.14500000000000002],
  [0.5850000000000001, -0.11500000000000005],
  [0.655, -0.065],
  [0.725, -0.01500000000000001],
  [0.81, 0.04499999999999999],
  all2,




]




var upperlegcontrolPts = [
  all,
  [-0.79, 0.1],
  [-0.6749999999999999, 0.19000000000000006],
  [-0.595, 0.2500000000000001],
  [-0.485, 0.27500000000000013],
  [-0.37, 0.23000000000000007],
  [-0.26499999999999996, 0.15500000000000003],
  [-0.175, 0.10500000000000001],
  [-0.06999999999999998, 0.04000000000000002],
  [0.030000000000000002, -0.02],
  [0.125, -0.06499999999999997],
  [0.2, -0.10000000000000003],
  [0.3, -0.14500000000000005],
  [0.395, -0.17500000000000007],
  [0.515, -0.18500000000000005],
  [0.615, -0.16500000000000006],
  [0.72, -0.13000000000000006],
  [0.8250000000000001, -0.065],
  all2,
  [1, 0],
]






// slow version
var toecontrolPts = [
  all,
  [-0.805, 0.07500000000000002],
  [-0.69, 0.040000000000000015],
  [-0.585, -0.025],
  [-0.48, -0.08999999999999997],
  [-0.385, 0.15000000000000005],
  [-0.305, 0.245],
  [-0.22499999999999998, 0.37],
  [-0.19, 0.7450000000000001],
  [-0.105, 0.79],
  [-0.019999999999999976, 0.8350000000000001],
  [0.175, 0.19],
  [0.305, 0.215],
  [0.405, 0.19],
  [0.505, 0.030000000000000013],
  [0.605, -0.085],
  [0.69, -0.18],
  [0.795, -0.07000000000000002],
  all2,
]


var Heightcontrolpts = [
  all,
  [-0.795, 0.049999999999999996],
  [-0.645, 0.07999999999999999],
  [-0.555, 0.1],
  [-0.4600000000000001, 0.095],
  [-0.33, 0.07999999999999999],
  [-0.24, 0.04],
  [-0.14500000000000002, -0.02500000000000001],
  [-0.1, 0],
  [0, 0],
  [0.1, 0],
  [0.2, 0],
  [0.3, 0],
  [0.4, 0],
  [0.5, 0],
  [0.6, 0],
  [0.7, 0],
  [0.8, 0],
  all2,
]

// Function to generate Bezier curve based on given control points
function beizercrve(controlpts) {
  // Get the canvas element by its ID 'webgl2'
  var canvas2 = document.getElementById('webgl2');
  
  // Get the rendering context for WebGL. This is necessary to issue WebGL commands
  var wgl = getWebGLContext(canvas2);
  if (!wgl) {
    // If the WebGL context couldn't be fetched, log an error message and return from function
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  
  // Initialize the vertex shader and fragment shader. Shaders are programs that run on the GPU
  if (!initShaders(wgl, VSHADER_SOURCE2, FSHADER_SOURCE2)) {
    // If the shaders couldn't be initialized, log an error message and return from function
    console.log('Failed to intialize shaders.');
    return;
  }
  
  // Get the attribute location of 'a_Position' in the shader program
  // This is necessary to pass position data to the shaders
  var a_Position = wgl.getAttribLocation(wgl.program, 'a_Position');
  if (a_Position < 0) {
    // If 'a_Position' couldn't be located, log an error message and return from function
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  // Initialize the event handlers for the canvas. This could be for interaction like mouse events
  initEventHandlers(canvas2, wgl, a_Position, controlpts);

  // Specify the color to clear the canvas. Here it is set to black.
  wgl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear the canvas using the above specified color
  wgl.clear(wgl.COLOR_BUFFER_BIT);

  // Draw the control points and lines
  pts_lines_drawing(wgl, a_Position, controlpts)
  
  // Draw the Bezier curve with the given control points
  curve_drawing(wgl, a_Position, controlpts)
  
  
}
function updateControlPoints(pos, diffcords, controlPoints) {
  controlPoints[pos] = [xposcord, yposcord];

  if (pos % 3 === 0 && pos !== 0 && pos !== controlPoints.length - 1) {
    controlPoints[pos + 1] = addCoordinates(controlPoints[pos + 1], diffcords);
    controlPoints[pos - 1] = addCoordinates(controlPoints[pos - 1], diffcords);
  }

  if ((pos + 1) % 3 === 0 && pos !== 0 && pos !== controlPoints.length - 2 && pos !== controlPoints.length - 1) {
    controlPoints[pos + 2] = subtractCoordinates(controlPoints[pos + 2], diffcords);
  }

  if ((pos - 1) % 3 === 0 && pos !== 0 && pos !== 1 && pos !== controlPoints.length - 1) {
    controlPoints[pos - 2] = subtractCoordinates(controlPoints[pos - 2], diffcords);
  }
}

function addCoordinates(coord, diffcords) {
  return [coord[0] + diffcords[0], coord[1] + diffcords[1]];
}

function subtractCoordinates(coord, diffcords) {
  return [coord[0] - diffcords[0], coord[1] - diffcords[1]];
}

function initEventHandlers(canvas, gl, a_Position, controlPoints) {
  var mouse_dragging = 0;
  var lastX = -1, lastY = -1, pos = 0;
  
  canvas.onmousedown = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    var brect = ev.target.getBoundingClientRect();
    if (x < brect.right && brect.left <= x && brect.top <= y && y < brect.bottom) {
      lastX = x; lastY = y;
      var dfx = lastX - 200;
      var dfy = lastY - 200;

      xposcord = dfx / 200;
      yposcord = -1 * dfy / 200;

      for (var i = 0; i < controlPoints.length; i++) {
        if ((controlPoints[i][0] - 0.05 <= xposcord && xposcord <= controlPoints[i][0] + 0.05) && (controlPoints[i][1] - 0.05 <= yposcord && yposcord <= controlPoints[i][1] + 0.05)) {
          pos = i;
        }
      }
      mouse_dragging = true;
    }
  };

  canvas.onmouseup = function (ev) { mouse_dragging = 0; };

  canvas.onmousemove = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    if (mouse_dragging) {
      xposcord = (x - 200) / 200;
      yposcord = -1 * (y - 200) / 200;

      var prevPos = controlPoints[pos];
      var new_pos = [xposcord, yposcord];
      var diffcords = [new_pos[0] - prevPos[0], new_pos[1] - prevPos[1]];

      updateControlPoints(pos, diffcords, controlPoints);

      gl.clearColor(.0, .0, .0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT);
      curve_drawing(gl, a_Position, controlPoints);
      pts_lines_drawing(gl, a_Position, controlPoints);
      console.log(controlPoints);
    }

    lastX = x, lastY = y;
  };
}



function curve_drawing(gl, a_Position, controlPoints) {
  var newPoints = gp(controlPoints);
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return;
  }
  // pass data to floating point
  gl.vertexAttrib1f(a_PointSize, 1.0);

  var lenth = newPoints.length;

  var vertices = new Float32Array(newPoints);

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1, 0, 0, 1);


  gl.drawArrays(gl.LINE_STRIP, 0, lenth / 2);
}



function pts_lines_drawing(gl, a_Position, controlPoints) {
  var cPts = [];
  for (let i = 0; i < controlPoints.length; i++) {
    cPts.push(controlPoints[i][0]);
    cPts.push(controlPoints[i][1]);
  }
  var con_li = new Float32Array(cPts);
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return;
  }
  // pass data to floating point
  gl.vertexAttrib1f(a_PointSize, 10.0);

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, con_li, gl.STATIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 0, 0, 1, 1);
  // Draw Control Points
  gl.drawArrays(gl.POINTS, 0, 19);

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1, 1, 1, 1);

  gl.drawArrays(gl.LINE_STRIP, 0, 19);
}


function main() {
  beizercrve(upperlegcontrolPts);
  var canvas = document.getElementById('webgl');
  var wgl = getWebGLContext(canvas);
  if (!wgl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  if (!initShaders(wgl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(wgl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  wgl.clearColor(.2, .5, .9, 1.0);
  wgl.enable(wgl.DEPTH_TEST);



  // Get the storage locations of uniform variables 
  var u_PhongExponent = wgl.getUniformLocation(wgl.program, 'u_PhongExponent');
  var u_Viewpoint = wgl.getUniformLocation(wgl.program, 'u_Viewpoint');
  var u_ModelMatrix = wgl.getUniformLocation(wgl.program, 'u_ModelMatrix');
  var u_MvpMatrix = wgl.getUniformLocation(wgl.program, 'u_MvpMatrix');
  var u_NormalMatrix = wgl.getUniformLocation(wgl.program, 'u_NormalMatrix');
  var u_LightColor = wgl.getUniformLocation(wgl.program, 'u_LightColor');
  var u_LightPosition = wgl.getUniformLocation(wgl.program, 'u_LightPosition');
  var u_AmbientLight = wgl.getUniformLocation(wgl.program, 'u_AmbientLight');
  if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
    console.log('Failed to get the storage location');
    return;
  }


  wgl.vertexAttrib1f(u_PhongExponent, 6.0);

  wgl.uniform3f(u_Viewpoint, viewX, viewY, viewZ);

  wgl.uniform3f(u_LightColor, 1., 1., 1.);
  // Set the light direction (in the world coordinate)
  wgl.uniform3f(u_LightPosition, 1.0, 10.0, 10.0);
  // Set the ambient light
  wgl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(viewX, viewY, viewZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Clear color and depth buffer
  wgl.clear(wgl.COLOR_BUFFER_BIT | wgl.DEPTH_BUFFER_BIT);

  // Register the event handler to be called on key press
  document.onkeydown = function (ev) { keydown(ev, wgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); };

  numberframs = 0;
  direction = 20;

  var ticker = function () {

    ANGLE_STEP1 -= GROUNGSPEED
    if (ANGLE_STEP1 <= -20) {
      ANGLE_STEP1 = 20
    }
    ANGLE_STEP2 -= GROUNGSPEED
    if (ANGLE_STEP2 <= -20) {
      ANGLE_STEP2 = 20
    }
    ANGLE_STEP3 -= GROUNGSPEED
    if (ANGLE_STEP3 <= -20) {
      ANGLE_STEP3 = 20
    }

    ANGLE_STEP4 -= GROUNGSPEED
    if (ANGLE_STEP4 <= -20) {
      ANGLE_STEP4 = 20
    }

    ANGLE_STEP5 -= GROUNGSPEED
    if (ANGLE_STEP5 <= -20) {
      ANGLE_STEP5 = 20
    }

    ANGLE_STEP6 -= GROUNGSPEED
    if (ANGLE_STEP6 <= -20) {
      ANGLE_STEP6 = 20
    }

    ANGLE_STEP7 -= GROUNGSPEED
    if (ANGLE_STEP7 <= -20) {
      ANGLE_STEP7 = 20
    }
    ANGLE_STEP8 -= GROUNGSPEED
    if (ANGLE_STEP8 <= -20) {
      ANGLE_STEP8 = 20
    }
    ANGLE_STEP0 -= GROUNGSPEED
    if (ANGLE_STEP0 <= -20) {
      ANGLE_STEP0 = 20
    }

    g_joint1Angle1 = getAngle(numberframs, upperlegcontrolPts, 180, 120);
    g_joint1Angle = getAngle((numberframs + 299) % 600, upperlegcontrolPts, 180, 120);


    g_jointNeeAngle = getAngle(numberframs, kneecontrolPts, 0, 80);
    g_jointNeeAngle1 = getAngle((numberframs + 299) % 600, kneecontrolPts, 0, 80);

    g_joint2AngleToe = getAngle(numberframs, toecontrolPts, 90, 40);
    g_joint2AngleToe1 = getAngle((numberframs + 299) % 600, toecontrolPts, 90, 40);

    bodyelevation = getAngle((numberframs % 300), Heightcontrolpts, -1.55, 10);




    draw(wgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw the robot arm

    requestAnimationFrame(ticker, canvas); // Request that the browser ?calls tick

    numberframs = (numberframs + direction) % 600

  };
  ticker();
}


function gp(controlPoints) {
  var generatedPoints = [];
  for (let j = 0; j < (controlPoints.length / 4) + 1; j += 1) {
    let i = j * 3;
    var cX = 3 * (controlPoints[i + 1][0] - controlPoints[i][0]);
    var bX = 3 * (controlPoints[i + 2][0] - controlPoints[i + 1][0]) - cX;
    var aX = controlPoints[i + 3][0] - controlPoints[i][0] - cX - bX;

    var cY = 3 * (controlPoints[i + 1][1] - controlPoints[i][1]);
    var bY = 3 * (controlPoints[i + 2][1] - controlPoints[i + 1][1]) - cY;
    var aY = controlPoints[i + 3][1] - controlPoints[i][1] - cY - bY;

    for (var k = 0; k < 1; k += 0.01) {
      var x = (aX * Math.pow(k, 3)) + (bX * Math.pow(k, 2)) + (cX * k) + controlPoints[i][0];
      var y = (aY * Math.pow(k, 3)) + (bY * Math.pow(k, 2)) + (cY * k) + controlPoints[i][1];
      generatedPoints.push(x);
      generatedPoints.push(y);
    }
  }
  return generatedPoints;
}


function getAngle(numberframs, controlPoints, initialAngle, movementAngle) {
  var points = []
  for (let j = 0; j < (controlPoints.length / 4) + 1; j += 1) {
    let i = j * 3
    var cX = 3 * (controlPoints[i + 1][0] - controlPoints[i + 0][0]),
      bX = 3 * (controlPoints[i + 2][0] - controlPoints[i + 1][0]) - cX,
      aX = controlPoints[i + 3][0] - controlPoints[i + 0][0] - cX - bX;

    var cY = 3 * (controlPoints[i + 1][1] - controlPoints[i + 0][1]),
      bY = 3 * (controlPoints[i + 2][1] - controlPoints[i + 1][1]) - cY,
      aY = controlPoints[i + 3][1] - controlPoints[i + 0][1] - cY - bY;

    for (var k = 0; k < 1; k += .01) {
      var x = (aX * Math.pow(k, 3)) + (bX * Math.pow(k, 2)) + (cX * k) + controlPoints[i + 0][0];
      var y = (aY * Math.pow(k, 3)) + (bY * Math.pow(k, 2)) + (cY * k) + controlPoints[i + 0][1];
      points.push([x, y]);
    }
  }

  if (points.length > numberframs) {
    return initialAngle + points[numberframs][1] * movementAngle;
  } else {
    return initialAngle;
  }
}



function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
  switch (ev.keyCode) {
    case 49: // Key 1 -> Perform an action related to leg 1
      beizercrve(upperlegcontrolPts);
      break;
    case 50: // Key 2 -> Perform an action related to leg 2
      beizercrve(kneecontrolPts);
      break;
    case 51: // Key 3 -> Perform an action related to toe
      beizercrve(toecontrolPts);
      break;
    case 52: // Key 4 -> Perform an action related to height
      beizercrve(Heightcontrolpts);
      break;
    case 39: // Right arrow key -> Rotate arm1 positively around the y-axis
      g_arm1Angle = (g_arm1Angle + 3) % 360;
      break;
    case 37: // Left arrow key -> Rotate arm1 negatively around the y-axis
      g_arm1Angle = (g_arm1Angle - 3) % 360;
      break;

    default: return; // Skip drawing if no effective action is taken
  }

  // Draw the updated scene
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}


function initVertexBuffers(gl, model) { // Create a sphere
  var finalindices = [];

  if (model === "cylinder") {
var RADIUS = 0.5;
var HEIGHT = 1.0;

var i, ai, si, ci;
var j, aj, sj, cj;
var p1, p2;

var positions = [];

// Generate coordinates
for (j = 0; j <= 13; j++) {
  aj = j * 2 * Math.PI / 13;
  sj = Math.sin(aj);
  cj = Math.cos(aj);
  for (i = 0; i <= 13; i++) {
    ai = i * HEIGHT / 13 - HEIGHT / 2;
    si = RADIUS * Math.sin(aj);
    ci = RADIUS * Math.cos(aj);

    positions.push(si);        // X
    positions.push(ai);        // Y
    positions.push(ci);        // Z
  }
}

// Generate indices
for (j = 0; j < 13; j++) {
  for (i = 0; i < 13; i++) {
    p1 = j * (13 + 1) + i;
    p2 = p1 + (13 + 1);

    finalindices.push(p1);
    finalindices.push(p2);
    finalindices.push(p1 + 1);

    finalindices.push(p1 + 1);
    finalindices.push(p2);
   finalindices.push(p2 + 1);
  }
}


if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3)) return -1;

  }
  else if (model === "cone") {
    var CONE_DIV = 36;
var RADIUS = 0.5;
var HEIGHT = 1.0;

var i, ai, si, ci;
var j, aj, sj, cj;
var p1, p2;

var positions = [];
var finalindices = [];

// Generate coordinates
for (j = 0; j <= CONE_DIV; j++) {
  aj = j * 2 * Math.PI / CONE_DIV;
  sj = Math.sin(aj);
  cj = Math.cos(aj);
  
  // Top vertex
  positions.push(0);              // X
  positions.push(HEIGHT / 2);     // Y
  positions.push(0);              // Z

  for (i = 0; i <= CONE_DIV; i++) {
    ai = i * HEIGHT / CONE_DIV;
    si = RADIUS * (1 - ai / HEIGHT) * Math.sin(aj);
    ci = RADIUS * (1 - ai / HEIGHT) * Math.cos(aj);

    positions.push(si);        // X
    positions.push(-ai + HEIGHT / 2);  // Y
    positions.push(ci);        // Z
  }
}

// Generate indices
for (j = 0; j < CONE_DIV; j++) {
  for (i = 0; i < CONE_DIV; i++) {
    p1 = j * (CONE_DIV + 2) + i + 1;
    p2 = p1 + (CONE_DIV + 2);

    finalindices.push(p1);
    finalindices.push(p2);
    finalindices.push(p1 + 1);

    finalindices.push(p1 + 1);
    finalindices.push(p2);
    finalindices.push(p2 + 1);
  }
}

if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3)) return -1;


    
  }
  
  else if (model === "sphere") {


    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var positions = [];

    // Generate coordinates
    for (j = 0; j <= 13; j++) {
      aj = j * Math.PI / 13;
      sj = Math.sin(aj);
      cj = Math.cos(aj);
      for (i = 0; i <= 13; i++) {
        ai = i * 2 * Math.PI / 13;
        si = Math.sin(ai);
        ci = Math.cos(ai);

        positions.push(si * sj);  // X
        positions.push(cj);       // Y
        positions.push(ci * sj);  // Z
      }
    }

    // Generate indices
    for (j = 0; j < 13; j++) {
      for (i = 0; i < 13; i++) {
        p1 = j * (13 + 1) + i;
        p2 = p1 + (13 + 1);

        finalindices.push(p1);
        finalindices.push(p2);
        finalindices.push(p1 + 1);

        finalindices.push(p1 + 1);
        finalindices.push(p2);
        finalindices.push(p2 + 1);
      }
    }


    if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3)) return -1;



  }
  else {
    vt=[
      0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, 
      0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, 
      0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, 
      -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 
      -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 
      0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5  
    ]
    var verts = new Float32Array(vt);

    // Normal
    nv=[
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 
    ]
    var normals_values = new Float32Array(nv);

    // Indices of the verts
    ind=[
      0, 1, 2, 0, 2, 3,    
      4, 5, 6, 4, 6, 7,   
      8, 9, 10, 8, 10, 11,   
      12, 13, 14, 12, 14, 20,    
      16, 17, 18, 16, 18, 19,   
      20, 21, 22, 20, 22, 23     
    ]
    finalindices = new Uint8Array(ind);

    // Write the vertex property to buffers (coordinates and normals)
    if (!initArrayBuffer(gl, 'a_Position', verts, gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals_values, gl.FLOAT, 3)) return -1;

  }
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(finalindices), gl.STATIC_DRAW);

  return finalindices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
var NeckL = 3.0;

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  var bodyH = 10.0;
  

  // to make the head head of roo
  g_modelMatrix.setTranslate(0.0, bodyelevation + bodyH + NeckL + 2, 0.0);     
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  
  g_modelMatrix.rotate(190, 0.0, 0.0, 1.0); 

  drawshape(gl, n, 2.1, 2.5, 2.4, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); 

  var n = initVertexBuffers(gl, 'cylinder');

  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // neck of robot
  g_modelMatrix.setTranslate(0.0, bodyelevation + bodyH + 2, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis

  drawshape(gl, n, 1.3, NeckL, 1.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

// Shoulders of robo
  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.setTranslate(0.0, bodyelevation + bodyH, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  drawshape(gl, n, 2.3,2.2, 5.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw
  
  pushMatrix(g_modelMatrix);

 
  var Length = 3.8;
  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  // Right Arm of the robot
  
  g_modelMatrix.translate(0.0, -0.75, 3.5);       // Move to joint1
  g_modelMatrix.rotate(180+g_joint1Angle1, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 1.8, 1.8, 1.8, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, -3, 1.);       // Move to joint1
  g_modelMatrix.rotate(-10, 1.0, .0, .0);  // Rotate around the z-axis
  drawshape(gl, n, 1.8, 4.8, 1.8, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.translate(0.0, -3, 0);       // Move to joint1
  g_modelMatrix.rotate(0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 1, 1, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  // // left Arm

  g_modelMatrix = popMatrix();
  g_modelMatrix.translate(0.0, -0.75, -3.5);       // Move to joint1
  g_modelMatrix.rotate(g_joint1Angle+180, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 1.8, 1.8, 1.8, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, -3, -1.);       // Move to joint1
  g_modelMatrix.rotate(10, 1.0, .0, .0);  // Rotate around the z-axis
  drawshape(gl, n, 1.8, 4.8, 1.8, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.translate(0.0, -3, 0);       // Move to joint1
  g_modelMatrix.rotate(0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 1, 1, 1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw
  
  // body cylindere
  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.setTranslate(0.0, bodyelevation + bodyH-4, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  drawshape(gl, n, 4, 8, 6.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw


  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // back of robo
  g_modelMatrix.setTranslate(0.0, bodyelevation, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  drawshape(gl, n, 2.6, 3.3, 3.6, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  pushMatrix(g_modelMatrix);

  g_modelMatrix.translate(0.0, -1, 1.8);       // Move to joint1
  g_modelMatrix.rotate(0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 2.2, 2, 1.9, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // first leg
  var Length = 5.0;
  g_modelMatrix.translate(0.0, -2, 0, 0);       // Move to joint1
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 2.0, Length, 2.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, Length-1, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.45, 1.45, 1.45, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  // whole leg
  var palmLength = 5.0;
  g_modelMatrix.translate(0.0, 2, 0.0);       // Move to palm
  g_modelMatrix.rotate(g_jointNeeAngle, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.5, palmLength, 1.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, palmLength-1, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.4, 1.4, 1.4, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }


  // foot of leg
  var toeLength = 3.0;
  g_modelMatrix.translate(0, 0, 0.0);       // Move to palm
  g_modelMatrix.rotate(g_joint2AngleToe, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.1, toeLength, 1.1, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw


  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, 3, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.1, 1.8, 1.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  g_modelMatrix = popMatrix();

  // New LEG

  g_modelMatrix.translate(0.0, -1, -1.8);       // Move to joint1
  g_modelMatrix.rotate(0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 2.2, 2.0, 1.9, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // whole new leg
  g_modelMatrix.translate(0.0, -2, .0);       // Move to joint1
  g_modelMatrix.rotate(g_joint1Angle1, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawshape(gl, n, 2.0, Length, 2.3, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw


  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, Length-1, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.45, 1.45, 1.45, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.translate(0.0, 2, 0.0);       // Move to palm
  g_modelMatrix.rotate(g_jointNeeAngle1, 0.0, 0.0, 1.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.5, palmLength, 1.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw


  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  g_modelMatrix.translate(0.0, palmLength-1, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.4, 1.4, 1.4, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // foot 2
  g_modelMatrix.translate(0, 0, .0);       // Move to palm
  g_modelMatrix.rotate(g_joint2AngleToe1, 0.0, 0.0, 1.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.1, toeLength, 1.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'sphere');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  g_modelMatrix.translate(0.0, 3, 0.0);       // Move to palm
  g_modelMatrix.rotate(0, 0.0, 0.0, 3.0);  // Rotate around the y-axis
  drawshape(gl, n, 1.1, 1.8, 1.5, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);  // Draw

  var n = initVertexBuffers(gl, 'cylinder');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  var n = initVertexBuffers(gl, '3');
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

//for makig the ground of boxes
  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP0, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw
  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP1, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP2, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP3, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP4, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP5, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP6, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP7, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw

  g_modelMatrix.setRotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
  g_modelMatrix.translate(ANGLE_STEP8, -16.68, .0);     // Move onto the base
  drawshape(gl, n, polWidth, polHight, polLength, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix); // Draw



}
var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}
function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}
var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

// Draws shape
function drawshape(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
  pushMatrix(g_modelMatrix);   // Save the model matrix
  // Scale a cube and draw
  g_modelMatrix.scale(width, height, depth);
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix

  gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
  

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  g_modelMatrix = popMatrix();   // Retrieve the model matrix
}



