<!DOCTYPE html>
<html>
<head>
  <title>Unified CAD + PCB App</title>

  <script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
  <script src="https://unpkg.com/three@0.158.0/examples/js/exporters/STLExporter.js"></script>

  <style>
    body { margin:0; font-family:Arial; }

    #toolbar {
      height:50px;
      background:#222;
      color:white;
      display:flex;
      align-items:center;
      padding:0 10px;
      gap:10px;
    }

    button {
      padding:6px 12px;
      border:none;
      cursor:pointer;
    }

    #workspace {
      display:flex;
      height:calc(100vh - 50px);
    }

    canvas {
      flex:1;
      display:none;
    }

    canvas.active {
      display:block;
    }
  </style>
</head>

<body>

<div id="toolbar">
  <button onclick="showCAD()">CAD</button>
  <button onclick="showPCB()">PCB</button>
  <button onclick="addCube()">Add Cube</button>
  <button onclick="addPad()">Add Pad</button>
  <button onclick="saveProject()">Save</button>
</div>

<div id="workspace">
  <canvas id="cad" class="active"></canvas>
  <canvas id="pcb"></canvas>
</div>

<script src="js/cad.js"></script>
<script src="js/pcb.js"></script>
<script>
  function showCAD() {
    cadCanvas.classList.add("active");
    pcbCanvas.classList.remove("active");
  }

  function showPCB() {
    pcbCanvas.classList.add("active");
    cadCanvas.classList.remove("active");
  }
</script>

</body>
</html>
