
headers: {
  'Content-Type':'application/json',
  'Authorization': TOKEN
},const pcbCanvas = document.getElementById("pcb");
const ctx = pcbCanvas.getContext("2d");

pcbCanvas.width = pcbCanvas.clientWidth;
pcbCanvas.height = pcbCanvas.clientHeight;

let pads = [];
let traces = [];
let selectedPad = null;
let drawingTrace = false;
let traceStart = null;

// Helpers
function draw() {
  ctx.clearRect(0, 0, pcbCanvas.width, pcbCanvas.height);

  // Draw traces
  ctx.strokeStyle = "green";
  ctx.lineWidth = 4;
  traces.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.from.x, t.from.y);
    ctx.lineTo(t.to.x, t.to.y);
    ctx.stroke();
  });

  // Draw pads
  pads.forEach(p => {
    ctx.fillStyle = "gold";
    ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
  });
}

function getPadAt(x, y) {
  return pads.find(p =>
    Math.abs(p.x - x) < 8 &&
    Math.abs(p.y - y) < 8
  );
}

// Mouse events
pcbCanvas.addEventListener("mousedown", e => {
  const rect = pcbCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const pad = getPadAt(x, y);

  if (pad) {
    selectedPad = pad;
    drawingTrace = true;
    traceStart = { x: pad.x, y: pad.y };
  }
});

pcbCanvas.addEventListener("mousemove", e => {
  if (!selectedPad) return;
  const rect = pcbCanvas.getBoundingClientRect();
  selectedPad.x = e.clientX - rect.left;
  selectedPad.y = e.clientY - rect.top;
  draw();
});

pcbCanvas.addEventListener("mouseup", e => {
  if (drawingTrace) {
    const rect = pcbCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    traces.push({
      from: traceStart,
      to: { x, y }
    });
  }

  selectedPad = null;
  drawingTrace = false;
  traceStart = null;
  draw();
});

// Toolbar action
function addPad() {
  pads.push({ x: 100 + pads.length * 40, y: 150 });
  draw();
}

// Save PCB
function saveProject() {
  const pcbData = { pads, traces };

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'pcb_project',
      type: 'pcb',
      data: JSON.stringify(pcbData)
    })
  }).then(r => r.text()).then(alert);
}

// Initial draw
draw();

function exportPCB() {
  const gerber = generateGerber(pads, traces);
  const drill = generateDrill(pads);
  const bom = generateBOM(pads);

  fetch('/save', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization': TOKEN
    },
    body: JSON.stringify({
      name:'top_copper',
      type:'pcb',
      data: gerber
    })
  });

  fetch('/save', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization': TOKEN
    },
    body: JSON.stringify({
      name:'drill',
      type:'pcb',
      data: drill
    })
  });

  fetch('/save', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization': TOKEN
    },
    body: JSON.stringify({
      name:'bom',
      type:'pcb',
      data: bom
    })
  });

  alert("Gerber, Drill & BOM exported");
}
