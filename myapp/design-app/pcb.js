const pcbCanvas = document.getElementById("pcb");
const ctx = pcbCanvas.getContext("2d");

// Draw simple PCB pad
ctx.fillStyle = "gold";
ctx.fillRect(100, 100, 10, 10);
ctx.fillRect(200, 100, 10, 10);

// Draw a trace
ctx.strokeStyle = "green";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(105,105);
ctx.lineTo(205,105);
ctx.stroke();

// Save PCB JSON
function savePCB() {
  const pcbData = {pads: [{x:100,y:100},{x:200,y:100}], traces: [{from:[100,100], to:[200,100]}]};
  fetch('/save', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:'test_pcb', data: JSON.stringify(pcbData), type:'pcb'})
  }).then(res=>res.text()).then(alert);
}
