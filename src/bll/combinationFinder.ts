import { PitchSetup } from './pitchSetup';
import type LatheConfig from './latheConfig';
import type { Pitch } from './pitch';
import { Gears, type Gear } from './gear';

export default class CombinationFinder {
    public findAllCombinations(config: LatheConfig): PitchSetup[]{
        const gears = config.gears.slice().sort((a,b) => Gears.compare(a, b));

        function key(ka: Gear, kb: Gear, kc: Gear, kd: Gear){
            if (Gears.equal(kb, kc))
                return "G"+ka.toString()+"--G"+kd.toString();
            return "G"+ka.toString()+"G"+kb.toString()+"G"+kc.toString()+"G"+kd.toString();
        }

        const comboDict: any = {};
        const axleRadius = 8;

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
        }

        let allCombos: PitchSetup[] = [];
        for(const i in comboDict)
        {
                allCombos.push(comboDict[i]);
        }
        allCombos = allCombos.sort((a,b) => a.pitch.value - b.pitch.value);

        console.info("Gear combos found: " + allCombos.length);

        return allCombos;
    }

    public findMetricPitch(gearA: Gear | undefined, gearB: Gear | undefined, gearC: Gear | undefined, gearD: Gear | undefined, leadscrew: Pitch): PitchSetup {
        return PitchSetup.fromGearsAndLeadscrew(gearA, gearB, gearC, gearD, leadscrew).toMetric()
    }
}