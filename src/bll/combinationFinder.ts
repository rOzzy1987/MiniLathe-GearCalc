import { PitchSetup } from './pitchSetup';
import type LatheConfig from './latheConfig';
import type { Pitch } from './pitch';

export default class CombinationFinder {
    public findAllCombinations(config: LatheConfig): PitchSetup[]{
        const gears = config.gears.sort();

        function key(ka: number, kb: number, kc: number, kd: number){
            if (kb == kc)
                return "G"+ka+"--G"+kd;
            return "G"+ka+"G"+kb+"G"+kc+"G"+kd;
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

                        // the banjo can't stretch long enough
                        if (ga + gb + gc + gd <= config.minTeeth * 2)
                            continue;

                        // gear B interferes with the leadscrew axle
                        if (gb-gc > gd)
                            continue;
                        
                        // gear C interferes with the driving axle
                        if (gc-gb > ga)
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

    public findMetricPitch(gearA: number, gearB: number, gearC: number, gearD: number, leadscrew: Pitch): PitchSetup {
        const ratio = gearB == gearC || (Number.isNaN(gearB) || Number.isNaN(gearC))
        ?   gearD/gearA 
        :   (gearB * gearD) / (gearA * gearC);
        return new PitchSetup(gearA, gearB, gearC, gearD, leadscrew.withRatio(ratio).toMetric());
    }
}