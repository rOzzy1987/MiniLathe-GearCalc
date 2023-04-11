import { PitchSetup } from './pitchSetup';
import type LatheConfig from './latheConfig';
import type { Pitch } from './pitch';
import { Gears, type Gear } from './gear';

export default class CombinationFinder {
    public findAllCombinations(config: LatheConfig): PitchSetup[]{
        const gears = config.gears.sort();

        function key(ka: Gear, kb: Gear, kc: Gear, kd: Gear){
            if (Gears.equal(kb, kc))
                return "G"+ka.toString()+"--G"+kd.toString();
            return "G"+ka.toString()+"G"+kb.toString()+"G"+kc.toString()+"G"+kd.toString();
        }

        const comboDict: any = {};

        // in any combination gears A and C are interchangeable, as well as B and D 
        // also, we prioritize larger gears on B and D to decrease the risk of gears interfering with the axles
        for (let a = 0; a < gears.length; a++){
            for (let b = 0; b < gears.length; b++) {
                if (b == a)
                    continue;
                for (let c = a + 1; c < gears.length; c++) {
                    if (c == b)
                        continue;
                    for (let d = b+1; d < gears.length; d++) {
                        if (d == a || d == c)
                            continue;
                        const ga = gears[a];
                        const gb = gears[b];
                        const gc = gears[c];
                        const gd = gears[d];
                        const pcA = Gears.pitchRadius(ga)!;
                        const pcB = Gears.pitchRadius(gb)!;
                        const pcC = Gears.pitchRadius(gc)!;
                        const pcD = Gears.pitchRadius(gd)!;

                        // the banjo can't stretch long enough
                        if (pcA + pcB + pcC + pcD <= config.minTeeth * 2)
                            continue;

                        // gear B interferes with the leadscrew axle
                        if (pcB - pcC > pcD)
                            continue;
                        
                        // gear C interferes with the driving axle
                        if (pcC - pcC > pcA)
                            continue;

                        const k = key(ga, gb, gc, gd);
                        if(comboDict[k] != null) 
                            continue;

                        comboDict[k] = this.findMetricPitch(ga, gb, gc, gd, config.leadscrew);
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