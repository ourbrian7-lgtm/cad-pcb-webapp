headers: {
  'Content-Type':'application/json',
  'Authorization': TOKEN
},
const cadCanvas = document.getElementById("cad");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: cadCanvas, antialias:true });
renderer.setSize(cadCanvas.clientWidth, cadCanvas.clientHeight);

camera.position.set(0, 2, 5);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

const objects = [];
let selected = null;

// Mouse selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

cadCanvas.addEventListener('click', e => {
  const rect = cadCanvas.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if (hits.length > 0) {
    selected = hits[0].object;
    selected.material.wireframe = true;
  }
});

// Add cube
function addCube() {
  const geo = new THREE.BoxGeometry(1,1,1);
  const mat = new THREE.MeshStandardMaterial({ color:0x2194ce });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = objects.length * 1.5;
  scene.add(mesh);
  objects.push(mesh);
}

// Add cylinder
function addCylinder() {
  const geo = new THREE.CylinderGeometry(0.5,0.5,1,32);
  const mat = new THREE.MeshStandardMaterial({ color:0x4caf50 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = objects.length * 1.5;
  scene.add(mesh);
  objects.push(mesh);
}

// Transform tools
function moveSelected(x,y,z) {
  if (selected) selected.position.add(new THREE.Vector3(x,y,z));
}

function scaleSelected(f) {
  if (selected) selected.scale.multiplyScalar(f);
}

// STL Export
function exportSTL() {
  const exporter = new THREE.STLExporter();
  const stl = exporter.parse(scene);

  fetch('/save', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      name:'cad_export',
      type:'cad',
      data:stl
    })
  }).then(r=>r.text()).then(alert);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
