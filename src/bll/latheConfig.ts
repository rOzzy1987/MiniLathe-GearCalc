import { PitchType, Pitch } from "./pitch";

export default class LatheConfig {
    public leadscrew: Pitch = new Pitch(1.6, PitchType.Metric);
    public gears: number[] = [20,20,30,35,40,40,45,50,55,57,60,65,80,80];
    public minTeeth: number = 82;
    public maxSize: number = 90;

    public toString(): string {
        const gears = this.gears.sort();
        let gearsStr = "";
        for (let i = 0; i < this.gears.length; i++){
            gearsStr += gears[i];
            if(i < gears.length - 1)
                gearsStr += ", ";
        }
        return "Pitch: " + this.leadscrew + "\n" + "Gears: " + gearsStr;
    }

    public toPlainObject() {
        return {
            gears: this.gears.slice(),
            leadscrew: this.leadscrew.toPlainObject(),
            minTeeth: this.minTeeth,
            maxSize: this.maxSize
        };
    }

    public static fromPlainObject(o: any) {
        const result = new LatheConfig();
        result.gears = o.gears;
        result.leadscrew = Pitch.fromPlainObject(o.leadscrew)!;
        result.minTeeth = o.minTeeth;
        result.maxSize = o.maxSize;
        return result;
    }
}