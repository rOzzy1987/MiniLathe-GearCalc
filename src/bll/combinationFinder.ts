import { PitchSetup } from './pitchSetup';
import type LatheConfig from './latheConfig';
import type { Pitch } from './pitch';
import { Gears, type Gear } from './gear';
import GlobalConfig from './globalConfig';
import { WorkerClient } from './backgroundWorker';


export default class CombinationFinder {

    private workerClient!: WorkerClient<PitchSetup[]>;
    private progressFn: (b: boolean, p: number | undefined) => void = ()=>{};

    public constructor(progressFn: (b: boolean, p: number | undefined) => void = ()=>{}, isWorker: boolean = false) {
        this.progressFn = progressFn;
        if(!isWorker)
            this.createWorker(progressFn);
    }

    private createWorker(progressFn: (b: boolean, p: number | undefined) => void = ()=>{}){
        const c = new WorkerClient<PitchSetup[]>();
        c.createWorker('/combinations.js', (o) => o?.map((i: any) => PitchSetup.fromPlainObject(i)), progressFn);
        this.workerClient = c;
    }

    public findAllCombinations(config: LatheConfig): PitchSetup[]{
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
                        if(!ps.isValid(config.minTeeth))
                            continue;
                        comboDict[k] = ps;
                    }                    
                }
            }
                this.progressFn(true, a / gears.length);
        }

        this.progressFn(true, undefined);

        let allCombos: PitchSetup[] = [];
        for(const i in comboDict)
        {
            allCombos.push(comboDict[i]);
        }
        allCombos = allCombos.sort((a,b) => a.pitch.value - b.pitch.value);

        console.info(`[[CobinationFinder]] Gear combos found: ${allCombos.length} in ${Date.now()-millis}ms`);

        return allCombos;
    }

    public async findAllCombinationsAsync(): Promise<PitchSetup[]>{
        return await this.workerClient.runWorker(GlobalConfig.config.toPlainObject());
    }

    public findMetricPitch(gearA: Gear | undefined, gearB: Gear | undefined, gearC: Gear | undefined, gearD: Gear | undefined, leadscrew: Pitch): PitchSetup {
        return PitchSetup.fromGearsAndLeadscrew(gearA, gearB, gearC, gearD, leadscrew).toMetric()
    }
}