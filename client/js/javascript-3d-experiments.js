/*!
 * JavaScript 3D Experiments
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

var canvasContainer = document.getElementById('canvas');
var canvasWidth = canvasContainer.clientWidth;
var canvasHeight = canvasContainer.clientHeight;

var clock = new THREE.Clock();

// RENDERER
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x020304);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);
canvasContainer.appendChild(renderer.domElement);

// SCENE
var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(35, canvasWidth / canvasHeight, 0.1, 10000);

var sphereRadius = 2;
var spherePrecision = 50;

var roundingPrecision = 5;

// LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var pointlLight = new THREE.PointLight(0xccccff, 0.5);
scene.add(pointlLight);

var material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissiveIntensity: 0.2,
  roughness: 0.3,
  metalness: 0.9,
  side: THREE.DoubleSide,
  // wireframe: true,
});

// SUPER

var a = 1;
var b = 1;


function superRadius(theta, m, n1, n2, n3) {
  if (n1 === 0) return 1; // Avoid division by zero
  var t1 = Math.abs((1 / a) * Math.cos(m * theta / 4));
  t1 = Math.pow(t1, n2);
  var t2 = Math.abs((1 / b) * Math.sin(m * theta / 4));
  t2 = Math.pow(t2, n3);
  var t3 = t1 + t2;
  var r = Math.pow(t3, -1 / n1);
  return r;
}

/**
 * Returns array populated with sphere [x, y, z] coordinates
 * 
 * @param {*} radius 
 * @param {*} precision 
 * @return {Array} 
 */
function sphere(radius, precision) {
  var globe = [];
  for (var x = 0; x < precision; x++) {
    var lon = scale(x, 0, precision, 0, 2 * Math.PI);
    globe.push([]);
    for (var y = 0; y < precision; y++) {
      var lat = scale(y, 0, precision - 1, 0, Math.PI);
      var x3d = +(radius * Math.sin(lat) * Math.cos(lon)).toFixed(roundingPrecision);
      var y3d = +(radius * Math.sin(lat) * Math.sin(lon)).toFixed(roundingPrecision);
      var z3d = +(radius * Math.cos(lat)).toFixed(roundingPrecision);
      globe[x].push([x3d, y3d, z3d]);
    }
  }
  return globe;
}

function superShape(radius, precision, rad1, rad2) {
  var globe = [];
  for (var x = 0; x < precision; x++) {
    var lon = scale(x, 0, precision, -Math.PI, Math.PI);
    var r1 = superRadius(lon, rad2.m, rad2.n1, rad2.n2, rad2.n3);
    globe.push([]);
    for (var y = 0; y < precision; y++) {
      var lat = scale(y, 0, precision - 1, -Math.PI / 2, Math.PI / 2);
      var r2 = superRadius(lat, rad1.m, rad1.n1, rad1.n2, rad1.n3);
      var x3d = +(radius * r1 * Math.cos(lon) * r2 * Math.cos(lat)).toFixed(roundingPrecision);
      var y3d = +(radius * r1 * Math.sin(lon) * r2 * Math.cos(lat)).toFixed(roundingPrecision);
      var z3d = +(radius * r2 * Math.sin(lat)).toFixed(roundingPrecision);
      globe[x].push([x3d, y3d, z3d]);
    }
  }
  return globe;
}

/**
 * Returns scaled value of `v` of range `min1` - `max1` in range `min2` - `max2`
 * 
 * @param {number} v 
 * @param {number} min1 
 * @param {number} max1 
 * @param {number} min2 
 * @param {number} max2 
 */
function scale(v, min1, max1, min2, max2) {
  return ((v - min1) / (max1 - min1)) * (max2 - min2) + min2;
}

// CREATE SPHERE
var geometry = new THREE.Geometry();
var sphereData = sphere(sphereRadius, spherePrecision);

for (var y = 0; y < spherePrecision; y++) {
  for (var x = 0; x < spherePrecision; x++) {
    geometry.vertices.push(new THREE.Vector3(sphereData[x][y][0], sphereData[x][y][1], sphereData[x][y][2]));
  }
}

for (var y = 0; y < spherePrecision - 1; y++) {
  for (var x = 0; x < spherePrecision - 1; x++) {
    var pos = x + y * spherePrecision;
    geometry.faces.push(new THREE.Face3(pos, pos + spherePrecision, pos + 1));
    geometry.faces.push(new THREE.Face3(pos + 1, pos + spherePrecision, pos + spherePrecision + 1));
  }
  geometry.faces.push(new THREE.Face3((y + 1) * spherePrecision - 1, (y + 2) * spherePrecision - 1, y * spherePrecision));
  geometry.faces.push(new THREE.Face3(y * spherePrecision, (y + 2) * spherePrecision - 1, (y + 1) * spherePrecision));
}

geometry.computeFaceNormals();
geometry.computeVertexNormals();

var mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// STATS PANEL
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 8;
stats.domElement.style.top = 48;
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// RENDERING & ANIMATION
animate();

function animate() {
  update();
  render();
  requestAnimationFrame(animate);
}

mesh.geometry.dynamic = true;
var oscill = 0;
var oscilla = 0;

mesh.rotation.x = -0.5;
mesh.rotation.y = -0.5;

function update() {
  var time = Date.now() * 0.0005;
  var delta = clock.getDelta() * 5;

  mesh.rotation.x += 0.2 * delta;
  mesh.rotation.y += 0.3 * delta;
  mesh.rotation.z += 0.5 * delta;
  mesh.position.x = Math.sin(time * 0.5) * 2;
  mesh.position.y = Math.cos(time * 0.5) * 4;
  mesh.position.z = Math.cos(time * 0.5) - 35;

  var data = superShape(sphereRadius, spherePrecision,
    {
      m: scale(Math.sin(oscill), -1, 1, 1, 4),
      n1: 1,
      n2: 40,
      n3: 0.1,
    }, {
      m: scale(Math.sin(oscill), -1, 1, 0, 8),
      n1: 0.10,
      n2: 0.1,
      n3: 100,
    });

  oscill += 0.005;

  for (var y = 0; y < spherePrecision; y++) {
    for (var x = 0; x < spherePrecision; x++) {
      mesh.geometry.vertices[x + y * spherePrecision].x = data[x][y][0];
      mesh.geometry.vertices[x + y * spherePrecision].y = data[x][y][1];
      mesh.geometry.vertices[x + y * spherePrecision].z = data[x][y][2];
    }
  }

  mesh.geometry.computeFaceNormals();
  mesh.geometry.computeVertexNormals();
  mesh.geometry.verticesNeedUpdate = true;

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
  camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}