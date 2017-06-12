/*!
 * JavaScript 3D Experiments
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

var canvasWidth = 640;
var canvasHeight = 480;
var canvasContainer = document.getElementById('canvas');

var clock = new THREE.Clock();

// RENDERER
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);
canvasContainer.appendChild(renderer.domElement);

// SCENE
var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 50;

var sphereRadius = 25;
var spherePrecision = 200;

// LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0x0066ff);
directionalLight.position.set(30, 30, 30);
scene.add(directionalLight);

/**
 * Returns array populated with sphere [x, y, z] coordinates
 * 
 * @param {*} radius 
 * @param {*} pecision 
 * @return {Array} 
 */
function sphere(radius, pecision) {
  var globe = [];
  for (var x = 0; x < pecision + 1; x++) {
    var lat = scale(x, 0, pecision, 0, Math.PI);
    for (var y = 0; y < pecision + 1; y++) {
      globe.push([]);
      var lon = scale(y, 0, pecision, 0, Math.PI * 2);
      var x3d = radius * Math.sin(lat) * Math.cos(lon);
      var y3d = radius * Math.sin(lat) * Math.sin(lon);
      var z3d = radius * Math.cos(lat);
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

sphereData.forEach((col) => {
  col.forEach((v3) => {
    geometry.vertices.push(new THREE.Vector3(v3[0], v3[1], v3[2]));
  });
});


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
var material = new THREE.MeshPhongMaterial({ color: 0x006D6F, specular: 0x221100, shininess: 50 });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -25;

scene.add(mesh);

// STATS PANEL
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// RENDERING & ANIMATION
render();

function render() {
  stats.begin();

  var time = Date.now() * 0.0005;
  var delta = clock.getDelta();

  mesh.rotation.x += 0.5 * delta;
  mesh.rotation.y += 0.5 * delta;
  mesh.position.x = Math.sin(time * 0.5) * 5;
  mesh.position.y = Math.cos(time * 0.5) * 5;
  mesh.position.z = Math.cos(time * 0.5) * 5 - 25;

  stats.end();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
