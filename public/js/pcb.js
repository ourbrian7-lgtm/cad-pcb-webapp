const pcbCanvas = document.getElementById("pcb");
const ctx = pcbCanvas.getContext("2d");

pcbCanvas.width = pcbCanvas.clientWidth;
pcbCanvas.height = pcbCanvas.clientHeight;

// Draw pads
ctx.fillStyle = "gold";
ctx.fillRect(100, 100, 12, 12);
ctx.fillRect(250, 100, 12, 12);

// Draw trace
ctx.strokeStyle = "green";
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(106,106);
ctx.lineTo(256,106);
ctx.stroke();

// Save PCB
document.getElementById("savePCB").onclick = () => {
  const pcbData = {
    pads: [{x:100,y:100},{x:250,y:100}],
    traces: [{from:[100,100], to:[250,100]}]
  };

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'pcb_design',
      data: JSON.stringify(pcbData),
      type: 'pcb'
    })
  }).then(r => r.text()).then(alert);
};
