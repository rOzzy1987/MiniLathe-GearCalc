import { PitchSetup } from './pitchSetup';
import LatheConfig from "./latheConfig";

export default class GlobalConfig {
    public static loadConfig(): LatheConfig | null {
        try {
            const a = localStorage.getItem("latheConfig");
            const b = JSON.parse(a!);
            return LatheConfig.fromPlainObject(b);
        }
        catch{
            return null;
        }
    }

    public static saveConfig(c: LatheConfig | null) {
        localStorage.setItem("latheConfig", JSON.stringify(c?.toPlainObject()));
    }

    public static loadCombos() : PitchSetup[]{
        try {
            const a = localStorage.getItem("gearCombos");
            const b = JSON.parse(a!);
            return (b as Array<any>).map(v => PitchSetup.fromPlainObject(v));
        } catch {
            return [];
        }
    }

    public static saveCombos(c: PitchSetup[] | null) {
        localStorage.setItem("gearCombos", JSON.stringify(c?.map(v => v.toPlainObject())));
    }
}