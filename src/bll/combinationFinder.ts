import { PitchSetup } from './pitchSetup';
import type LatheConfig from './latheConfig';
import type { Pitch } from './pitch';
import { Gears, type Gear } from './gear';


export default class CombinationFinder {
    public findAllCombinations(config: LatheConfig, reportProgressFn: ((x: number | undefined) => void) | null = null): PitchSetup[]{
        const millis = Date.now();
        const gears = config.gears.slice().sort((a,b) => Gears.compare(a, b));

        function key(ka: Gear, kb: Gear, kc: Gear, kd: Gear){
            if (Gears.equal(kb, kc))
                return "G"+ka.toString()+"--G"+kd.toString();
            return "G"+ka.toString()+"G"+kb.toString()+"G"+kc.toString()+"G"+kd.toString();
        }

        const comboDict: any = {};

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

                        const k = key(ga, gb, gc, gd);
                        if (comboDict[k] != null) 
                            continue;

                        const ps = this.findMetricPitch(ga, gb, gc, gd, config.leadscrew);
                        if(!ps.isValid())
                            continue;
                        comboDict[k] = ps;
                    }                    
                }
            }
            if(reportProgressFn != null) {
                reportProgressFn(a / gears.length);
            }
            
        }

        
        if(reportProgressFn != null) {
            reportProgressFn(undefined);
        }

        let allCombos: PitchSetup[] = [];
        for(const i in comboDict)
        {
                allCombos.push(comboDict[i]);
        }
        allCombos = allCombos.sort((a,b) => a.pitch.value - b.pitch.value);

        console.info(`Gear combos found: ${allCombos.length} in ${Date.now()-millis}ms`);

        return allCombos;
    }

    public createWorker(resultHandler: (r: PitchSetup[]) => void, isBusyHandler: (busy: boolean)=> void = ()=>{}, progressHandler: (p: number) => void = ()=>{}): Worker {
        const w = new Worker('/combinations-worker.js');

        w.onmessage = (ev: MessageEvent) => {
            if (ev.data.key == "working") {
              isBusyHandler(ev.data.value);
            } else if (ev.data.key == "progress") {
              progressHandler(ev.data.value);
            } else if (ev.data.key == "combos"){
              resultHandler(this.processWorkerResult(ev.data.value));
            } 
          }
        return w;
    }

    public runWorker(gears: Gear[], leadscrew: Pitch, w: Worker) {
        w.postMessage({
            gears: gears.map(g => g.toPlainObject()), 
            leadscrew: leadscrew.toPlainObject()
        });
    }

    private processWorkerResult(r: any[]){
        try {
            const result = r.map(i => PitchSetup.fromPlainObject(i)).filter(s => s.isValid())
            console.info(`Valid gear combos found: ${result.length}`);
            return result;
        } catch(e) {
            console.log(e);
            return [];
        }
    }

    public findMetricPitch(gearA: Gear | undefined, gearB: Gear | undefined, gearC: Gear | undefined, gearD: Gear | undefined, leadscrew: Pitch): PitchSetup {
        return PitchSetup.fromGearsAndLeadscrew(gearA, gearB, gearC, gearD, leadscrew).toMetric()
    }
}