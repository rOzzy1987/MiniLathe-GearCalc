
const INCH = 25.4;

function gearToString(g) {
  return g == undefined ? '-' : (g.module) + ' Z' + g.teeth; 
}

function compareGears(a, b) {
  return gearToString(a) - gearToString(b);
}

function reportProgressFn(p){
  postMessage({key: 'progress', value: p});
}

function key(ka, kb, kc, kd){
  if (gearToString(kb) == gearToString(kc))
      return "G"+gearToString(ka)+"--G"+gearToString(kd);
  return "G"+gearToString(ka)+"G"+gearToString(kb)+"G"+gearToString(kc)+"G"+gearToString(kd);
}

function findMetricPitch(a,b,c,d, ls) {
  var ratio = a.teeth * c.teeth / (b.teeth * d.teeth);
  var p = {type: 0, value: ls.type == 0 ? ls.value * ratio : (INCH / ls.value) * ratio };
  return {gearA: gearToString(a), gearB: gearToString(b), gearC: gearToString(c), gearD: gearToString(d), pitch: p};  
}

self.addEventListener("message", (event) => {
  postMessage({ key: "working", value: true });
  if(event.data) {


    const millis = Date.now();
    const gears = event.data.gears.slice().sort((a,b) => compareGears(a, b));


    const comboDict = {};

    for (let a = 0; a < gears.length; a++){
        for (let b = 0; b < gears.length; b++) {
            if (b == a)
                continue;
            for (let c = 0; c < gears.length; c++) {
                if (c == a || c == b)
                    continue;
                for (let d = 0; d < gears.length; d++) {
                    if (d == a || d == b || d == c)
                        continue;
                    const ga = gears[a];
                    const gb = gears[b];
                    const gc = gears[c];
                    const gd = gears[d];

                    if (ga.module != gb.module)
                      continue;
                    if (gc.module != gd.module)
                      continue;

                    const k = key(ga, gb, gc, gd);
                    if (comboDict[k] != null) 
                        continue;

                    const ps = findMetricPitch(ga, gb, gc, gd, event.data.leadscrew);
                    comboDict[k] = ps;
                }                    
            }
        }
        reportProgressFn(a / gears.length);
        
    }

    reportProgressFn(undefined);
    
    let allCombos = [];
    for(const i in comboDict)
    {
        allCombos.push(comboDict[i]);
    }
    allCombos = allCombos.sort((a,b) => a.pitch.value - b.pitch.value);

    console.info(`Gear combos found: ${allCombos.length} in ${Date.now()-millis}ms`);

    postMessage({key: 'combos', value: allCombos});
  }
  postMessage({ key: "working", value: false });
});