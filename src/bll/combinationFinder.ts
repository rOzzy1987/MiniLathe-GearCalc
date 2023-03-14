import { PitchSetup } from './pitchSetup';
import { PitchType, type Pitch } from './pitch';
import type LatheConfig from './latheConfig';
import GcMath from './math';

export default class CombinationFinder {
    public findAllCombinations(config: LatheConfig): PitchSetup[]{
        let allCombos: PitchSetup[] = [];
        const gears = config.gears;
        const leadscrew = config.leadscrew.type == PitchType.Metric ? config.leadscrew : config.leadscrew.convert();

        for (let a = 0; a < gears.length; a++){
            const ga = gears[a];
            for (let d = 0; d < gears.length; d++) {
                if (d == a)
                    continue;
                const gd = gears[d];
                for (let c = 0; c < gears.length; c++) {
                    if (c == a || c == d)
                        continue;
                    const gc = gears[c];
                    for (let b = 0; b < gears.length; b++) {
                        if (b == c || b == d || b == a)
                            continue;
                        const gb = gears[b];
                        if (gb == gc)
                            continue;

                        if (ga + gb + gc + gd <= config.minTeeth * 2)
                            continue;

                        const ratio = (gb / ga) * (gd / gc);
                        const pitch = leadscrew.withRatio(ratio);
                        allCombos.push(new PitchSetup(ga, gb, gc, gd, pitch));
                    }                    
                }
                
                const ratio = gd / ga;
                const pitch = leadscrew.withRatio(ratio);
                allCombos.push(new PitchSetup(ga, null, null, gd, pitch));
            }
        }

        function key(v: PitchSetup){
            let k = v.pitch.type == PitchType.Metric ? "M" : "I";
            k+="G"+v.gearA;
            k+="G"+v.gearB;
            k+="G"+v.gearC;
            k+="G"+v.gearD;
            return k;
        }

        const comboDict: any = {};
        for (let i = 0; i < allCombos.length; i++) {
            comboDict[key(allCombos[i])]= allCombos[i];
        }

        console.log("All combos: "+allCombos.length);

        allCombos = [];
        for(const i in comboDict)
        {
            allCombos.push(comboDict[i]);
        }
        allCombos = allCombos.sort((a,b) => a.pitch.value - b.pitch.value);

        console.log("Without duplicates: "+allCombos.length);

        return allCombos;
    }

    public findCombination(pitch: Pitch, config: LatheConfig, threshold: number = 1.003) : PitchSetup[]{
        const lathePitch = pitch.type == config.leadscrew.type 
            ? config.leadscrew.value 
            : config.leadscrew.convert().value;
        const desiredPitch = pitch.value;
        const desiredDiv = pitch.type == PitchType.Imperial 
            ? desiredPitch / lathePitch 
            : lathePitch / desiredPitch;

        let smallToLarge = true;
        if (desiredDiv < 1){
            smallToLarge = false;
        }
        const gears = config.gears.sort((a,b) => smallToLarge ? a-b : b-a);

        const result : PitchSetup[] = []

        let i = 0;
        // 2 gear setups
        for(let a = 0; a < gears.length; a++){
            for (let b = a+1; b < gears.length; b++){
                const div = gears[b]/gears[a];
                if (GcMath.roughlyEqual(div, desiredDiv, threshold)) {
                    const setup = new PitchSetup(gears[a], null, null, gears[b], pitch.type == PitchType.Metric ? lathePitch/div : lathePitch * div, pitch.type);
                    console.log(setup.toString());
                    result.push(setup);
                }
                i++;
            }
        }

        // 4 gear setups
        
        for(let a = 0; a < gears.length; a++){
            for (let b = a+1; b < gears.length; b++){
                for(let c = 0; c < gears.length; c++){
                    if(c == a || c == b)
                        continue;
                    for (let d = 0; d < gears.length; d++){
                        if(d == c || d == b || d == a)
                            continue;
                        const div = (gears[d]/gears[c])*(gears[b]/gears[a]);
                        if (GcMath.roughlyEqual(div, desiredDiv, threshold)) {
                            const setup = new PitchSetup(gears[a], gears[b], gears[c], gears[d], pitch.type == PitchType.Metric ? lathePitch/div : lathePitch * div, pitch.type);
                            console.log(setup.toString());
                            result.push(setup);
                        }
                        i++;
                    }
                }
            }
        }

        console.log("combinations tried: "+i);

        return result.sort((a,b) => Math.abs(a.pitch.value - desiredPitch) - Math.abs(b.pitch.value - desiredPitch));
    }
}