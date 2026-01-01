const cadCanvas = document.getElementById("cad");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, cadCanvas.clientWidth / cadCanvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: cadCanvas });
renderer.setSize(cadCanvas.clientWidth, cadCanvas.clientHeight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Export STL example
function exportSTL() {
  const exporter = new THREE.STLExporter();
  const stlString = exporter.parse(scene);
  fetch('/save', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({name:'test_cad', data: stlString, type:'cad'})
  }).then(res => res.text()).then(alert);
}
