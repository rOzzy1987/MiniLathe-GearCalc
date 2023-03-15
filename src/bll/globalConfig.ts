import { PitchSetup } from './pitchSetup';
import LatheConfig from "./latheConfig";
import type TranslationsBase from '@/i18n/lang';
import { EnTranslations } from '@/i18n/lang';
import HuTranslations from '@/i18n/hu';

export default class GlobalConfig {
    public static loadConfig(): LatheConfig {
        try {
            const a = localStorage.getItem("latheConfig");
            const b = JSON.parse(a!);
            return LatheConfig.fromPlainObject(b);
        }
        catch{
            return new LatheConfig();
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


// I18N

    private static _i18n: TranslationsBase = new EnTranslations();

    public static get i18n(): TranslationsBase {
        return this._i18n;
    };
    public static set i18n(value: TranslationsBase){
        this._i18n = value;
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
        }
    }

    public static readonly availableLanguages: TranslationsBase[] = [
        new EnTranslations(),
        new HuTranslations(),
    ]

    public static loadLanguage(){
        const langCode = localStorage.getItem("language");
        const x = this.availableLanguages.find(l => l.langCode == langCode);
        this.i18n = x ?? this.availableLanguages[0];
    }

    public static saveLanguage(){
        localStorage.setItem("language", this.i18n.langCode);
    }

    public static addLanguageChangeListener(f: Function){
        this.listeners.push(f);
    }
    private static listeners: Function[] = [];
}