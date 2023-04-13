import { PitchSetup } from './pitchSetup';
import LatheConfig from "./latheConfig";
import type TranslationsBase from '@/i18n/lang';
import { EnTranslations } from '@/i18n/lang';
import HuTranslations from '@/i18n/hu';

export default class GlobalConfig {
    private static _config: LatheConfig | null = null;
    
    public static get config(): LatheConfig {
        return this._config ?? this.loadConfig();
    }

    public static set config(v: LatheConfig) {
        this._config = v;
        this.saveConfig();
    }

    private static loadConfig(): LatheConfig {
        try {
            const a = localStorage.getItem("latheConfig") ?? "null";
            const b = JSON.parse(a!);
            this._config = LatheConfig.fromPlainObject(b);
        }
        catch{
            this._config = new LatheConfig();
        }
        return this._config;
    }

    private static saveConfig() {
        localStorage.setItem("latheConfig", JSON.stringify(this._config?.toPlainObject()));
    }

// Combos

    private static _combos: PitchSetup[] | null = null;

    public static get combos(): PitchSetup[] {
        return this._combos ?? this.loadCombos();
    }

    public static set combos(v: PitchSetup[]) {
        this._combos = v;
        this.saveCombos();
    }

    private static loadCombos() : PitchSetup[]{
        try {
            const a = localStorage.getItem("gearCombos")?? "null";
            const b = JSON.parse(a!);
            this._combos = (b as Array<any>).map(v => PitchSetup.fromPlainObject(v));
        } catch {
            this._combos = [];
        }
        return this._combos;
    }

    private static saveCombos() {
        localStorage.setItem("gearCombos", JSON.stringify(this._combos?.map(v => v.toPlainObject())));
    }

// Favorites

    private static _favorites: PitchSetup[];
    public static get favorites(): PitchSetup[] {
        this.ensureFavoritesLoaded();
        return this._favorites;
    }

    public static addFavorite(s: PitchSetup) {
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
        localStorage.setItem("favorites", JSON.stringify(this._favorites.map(i => i.toPlainObject())))
    }

    private static ensureFavoritesLoaded(){
        if (this._favorites ==  null) {
            this.loadFavorites();
        }
    }

    private static loadFavorites() {
        try {
            this._favorites = (JSON.parse(localStorage.getItem("favorites") ?? "null") ?? [])
                .map((i: any) => PitchSetup.fromPlainObject(i));
        } catch {
            this._favorites = [];
        }
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

    private static _i18n: TranslationsBase | undefined;

    public static get i18n(): TranslationsBase {
        return this._i18n == undefined ? this.loadLanguage() : this._i18n;
    };
    public static set i18n(value: TranslationsBase){
        this._i18n = value;
        this.saveLanguage();
        
        window.location.reload();
    }

    public static readonly availableLanguages: TranslationsBase[] = [
        new EnTranslations(),
        new HuTranslations(),
    ]

    private static loadLanguage() : TranslationsBase{
        const langCode = localStorage.getItem("language");
        const x = this.availableLanguages.find(l => l.langCode == langCode);
        this._i18n = x ?? this.availableLanguages[0];
        return this._i18n;
    }

    private static saveLanguage(){
        localStorage.setItem("language", this.i18n.langCode);
    }
}