function generateGerber(pads, traces) {
  let g = [];
  g.push("G04 PCB Gerber*");
  g.push("%FSLAX24Y24*%");
  g.push("%MOMM*%");
  g.push("D10*");

  // Pads
  pads.forEach(p => {
    g.push(
      
    );
  });

  // Traces
  traces.forEach(t => {
    g.push(
      
    );
    g.push(
      
    );
  });

  g.push("M02*");
  return g.join("\n");
}

function generateDrill(pads) {
  let d = [];
  d.push("M48");
  d.push("METRIC,TZ");
  d.push("T01C0.8");
  d.push("%");

  pads.forEach(p => {
    d.push();
  });

  d.push("M30");
  return d.join("\n");
}

function generateBOM(pads) {
  return JSON.stringify({
    components: pads.length,
    pad_size: "1.2mm",
    drill: "0.8mm"
  }, null, 2);
}
