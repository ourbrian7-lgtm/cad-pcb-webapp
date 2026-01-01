const cadCanvas = document.getElementById("cad");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  cadCanvas.clientWidth / cadCanvas.clientHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: cadCanvas });
renderer.setSize(cadCanvas.clientWidth, cadCanvas.clientHeight);

// Cube (basic CAD object)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Export STL
document.getElementById("saveCAD").onclick = () => {
  const exporter = new THREE.STLExporter();
  const stlData = exporter.parse(scene);

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'cad_model',
      data: stlData,
      type: 'cad'
    })
  }).then(r => r.text()).then(alert);
};
