/*!
 * JavaScript 3D Experiments
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

var canvasWidth = 640;
var canvasHeight = 480;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);

camera.position.x = 5;
camera.position.y = -10;
camera.position.z = 25;

var sphereRadius = 10;
var spherePrecision = 50;

/**
 * Returns array populated with sphere vertices
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
      globe[x].push(new THREE.Vector3(x3d, y3d, z3d));
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

sphere(sphereRadius, spherePrecision).forEach((col) => {
  col.forEach((v3) => {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(v3);
    var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);
  });
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
  renderer.render(scene, camera);
});

controls.enableZoom = false;
renderer.render(scene, camera);

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // monitored code goes here
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
