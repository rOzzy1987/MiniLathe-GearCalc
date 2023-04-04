import { PitchSetup } from './pitchSetup';
import LatheConfig from "./latheConfig";
import type TranslationsBase from '@/i18n/lang';
import { EnTranslations } from '@/i18n/lang';
import HuTranslations from '@/i18n/hu';
import { PitchType } from './pitch';

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


    private static _favorites: PitchSetup[];
    public static get favorites(): PitchSetup[] {
        this.ensureFavoritesLoaded();
        return this._favorites;
    }

    public static addFavorite(s: PitchSetup) {
        if(s.pitch.type == PitchType.Imperial)
            s = s.convert();
        if(this.indexOfFavorite(s) == -1){
            this._favorites.push(s);
            this.saveFavorites();
        }
    }

    public static removeFavorite(s: PitchSetup) {
        const i = this.indexOfFavorite(s);
        if(i == -1) return;

        this._favorites = this._favorites.slice(0, i).concat(this._favorites.slice(i+1));
        this.saveFavorites();
    }

    public static isFavorite(s: PitchSetup) {
        return this.indexOfFavorite(s) >= 0;
    }

    private static saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(this._favorites))
    }

    private static ensureFavoritesLoaded(){
        if (this._favorites ==  null) {
            this.loadFavorites();
        }
    }

    private static loadFavorites() {
        this._favorites = (JSON.parse(localStorage.getItem("favorites") ?? "null") ?? [])
            .map((i: any) => PitchSetup.fromPlainObject(i));
    }

    private static indexOfFavorite(s: PitchSetup): number{
        this.ensureFavoritesLoaded();
        for (const i in this._favorites) {
            const f = this._favorites[i];
            if(f.equals(s))
                return Number(i);
        }
        return -1;
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