
export interface IGridColumnDefinition {
    readonly id: string;
    readonly title: string;
    readonly tooltip: string | null;
    readonly valueFn: (item: any) => any;
    readonly formatFn: (value: any) => string;
    readonly sortFn: ((val1:any, val2:any, asc?: boolean) => number) | null;
    readonly cssClasses: Array<string>;
    readonly style: string | undefined;
    readonly headerCssClasses: Array<string>;
    readonly headerStyle: string | undefined;
    readonly exportFn: (value: any) => any;
    readonly isOptional: boolean;
    isHidden: boolean;
    readonly isHtml: boolean;
    getHtml(item: any): string;
}

export class GridColumnDefinition implements IGridColumnDefinition {
    private _id: string;
    private _title: string;
    private _tooltip: string | null = null;
    private _valueFn: (item: any) => any;
    private _formatFn: (value: any) => string = v=> v;
    private _sortFn: ((val1:any, val2:any) => number) | null = null;
    private _cssClasses: Array<string> = [];
    private _style: string | undefined = undefined;
    private _headerCssClasses: Array<string> = [];
    private _headerStyle: string | undefined = undefined;
    private _exportFn: (value: any) => any = this.formatFn;
    private _isHtml = false;
    private _isOptional = false;
    public isHidden = false;

    public get id() {
        return this._id;
    }

    public get title() {
        return this._title;
    }
    public get valueFn() {
        return this._valueFn;
    }
    public get formatFn() {
        return this._formatFn;
    }
    public get exportFn() {
        return this._exportFn;
    }
    public get cssClasses() {
        return this._cssClasses;
    }
    public get style() {
        return this._style;
    }
    public get sortFn() {
        return this._sortFn;
    }
    public get tooltip() {
        return this._tooltip;
    }
    public get headerCssClasses() {
        return this._headerCssClasses;
    }
    public get headerStyle() {
        return this._headerStyle;
    }
    public get isHtml() {
        return this._isHtml;
    }
    public get isOptional() {
        return this._isOptional;
    }

    public constructor(id: string, title: string, valueFn: (item: any) => any, tooltip: string | null = null) {
        this._id = id;
        this._title = title;
        this._valueFn = valueFn;
        this._tooltip = tooltip;
    }

    public getHtml(item: any): string {
        const txt = this.formatFn(this.valueFn(item));
        return this.isHtml ? txt : txt?.replace("<", "&lt;").replace(">", "&gt;");
    }

    public asNumericColumn(fractionDigits: number | undefined = undefined) {
        return this.withSortForNumerics().withAlignRight().withFormatAsNumeric(fractionDigits).withExportAsIs();
    }
    public withAlignLeft(){
        this._cssClasses.push('has-text-left');
        return this;
    }
    public withAlignCenter(){
        this._cssClasses.push('has-text-center');
        return this;
    }
    public withAlignRight(){
        this._cssClasses.push('has-text-right');
        return this;
    }
    public withHeaderAlignLeft(){
        this._headerCssClasses.push('has-text-left');
        return this;
    }
    public withHeaderAlignCenter(){
        this._headerCssClasses.push('has-text-center');
        return this;
    }
    public withHeaderAlignRight(){
        this._headerCssClasses.push('has-text-right');
        return this;
    }
    public withFormat(formatFn: (v: any) => string){
        this._formatFn = formatFn;
        return this;
    }
    public withFormatAsNumeric(fractionDigits: number | undefined = undefined) {
        this._formatFn = a => Number.isNaN(a) ? '-' : a.toFixed(fractionDigits);
        return this;
    }
    public withExportAsIs(){
        this._exportFn = (a) => a;
        return this;
    }
    public withSort(sortFn: (a: any, b: any, asc?:boolean) => number) {
        this._sortFn = sortFn;
        return this;
    }
    public withSortForValues(sortFn: (a: any, b: any, asc?: boolean) => number) {
        this._sortFn = (a:any, b:any, asc?:boolean) => sortFn(this.valueFn(a), this.valueFn(b), asc);
        return this;
    }
    public withSortForNumerics() {
        this._sortFn = (a,b) => this.valueFn(a) - this.valueFn(b);
        return this;
    }
    public withSortForStrings() {
        this._sortFn = (a,b) => (this.valueFn(a)+"").localeCompare(this.valueFn(b)+"");
        return this;
    }
    public withStyle(style: string | undefined) {
        this._style = style;
        return this;
    }
    public withCssClasses(cssClasses: Array<string>) {
        this._cssClasses = cssClasses;
        return this;
    }
    public withHeaderStyle(style: string | undefined) {
        this._headerStyle = style;
        return this;
    }
    public withHeaderCssClasses(cssClasses: Array<string>) {
        this._headerCssClasses = cssClasses;
        return this;
    }
    public withExportFn(exportFn: (value: any) => any){
        this._exportFn = exportFn;
        return this;
    }
    public withHtml(isHtml = true){
        this._isHtml = isHtml;
        return this;
    }
    public withOptional(isOptional = true){
        this._isOptional = isOptional;
        return this;
    }
    public withHidden(isHidden = true){
        this.isHidden = isHidden;
        return this;
    }
}