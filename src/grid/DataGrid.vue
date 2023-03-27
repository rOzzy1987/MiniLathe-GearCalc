<template>
    <div>
        <div v-if="title != ''" class="control">
            {{ title }}
        </div>
      <div class="table-container">
            <table class="table is-narrow is-fullwidth is-striped is-hoverable">
                <thead>
                    <tr>
                        <th v-for="(col, i) of columns" :key="i" :title="col.tooltip ?? undefined" @click="setOrder(i)" :style="col.headerStyle" :class="col.headerCssClasses">
                            <span v-if="isSortable && _sortByColumn == i" class="icon is-small"><i class="fas" :class="{'fa-sort-up': _sortAscending, 'fa-sort-down': !_sortAscending}"></i></span>
                            {{ col.title }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, j) of _modelValue" :key="j" :class="{'is-selected': _selectedItems.indexOf(item) >= 0}" @click="itemClicked($event, j)">
                        <td v-for="(col, i) of columns" :key="i" :style="col.style" :class="col.cssClasses">
                            {{ col.formatFn(col.valueFn(item)) }}
                        </td>
                    </tr>
                    <tr v-if="_modelValue.length == 0">
                        <td :colspan="columns?.length">{{ emptyText }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">

export interface IGridColumnDefinition {
    readonly title: string;
    readonly tooltip: string | null;
    readonly valueFn: (item: any) => any;
    readonly formatFn: (value: any) => string;
    readonly sortFn: ((val1:any, val2:any) => number) | null;
    readonly cssClasses: Array<string>;
    readonly style: string | undefined;
    readonly headerCssClasses: Array<string>;
    readonly headerStyle: string | undefined;
}

export class GridColumnDefinition implements IGridColumnDefinition {

    private _title: string;
    private _tooltip: string | null = null;
    private _valueFn: (item: any) => any;
    private _formatFn: (value: any) => string = v=> v;
    private _sortFn: ((val1:any, val2:any) => number) | null = null;
    private _cssClasses: Array<string> = [];
    private _style: string | undefined = undefined;
    private _headerCssClasses: Array<string> = [];
    private _headerStyle: string | undefined = undefined;

    public get title() {
        return this._title;
    }

    public get valueFn() {
        return this._valueFn;
    }

    public get formatFn() {
        return this._formatFn;
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

    public constructor(title: string, valueFn: (item: any) => any, tooltip: string | null = null) {
        this._title = title;
        this._valueFn = valueFn;
        this._tooltip = tooltip;
    }

    public asNumericColumn(fractionDigits: number | undefined = undefined) {
        return this.withSortForNumerics().withAlignRight().withFormatAsNumeric(fractionDigits);
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

    public withFormat(formatFn: (v: any) => string){
        this._formatFn = formatFn;
        return this;
    }

    public withFormatAsNumeric(fractionDigits: number | undefined = undefined) {
        this._formatFn = a => Number.isNaN(a) ? '-' : a.toFixed(fractionDigits);
        return this;
    }

    public withSort(sortFn: (a: any, b: any) => number) {
        this._sortFn = sortFn;
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
}

export enum GridSelectionMode {
    None,
    One,
    Multi
}

export default {
    data(props) {
        return {
            sortByColumnField: props.sortByColumn,
            sortAscendingField: props.sortAscending,
            selectedItemsField: props.selectedItems,
            modelValueField: props.modelValue,
            lastItemClicked: 0
        }
    },
    props: {
        title: { type: String, default: null },
        columns: { type: Array<IGridColumnDefinition>, required: true },
        selectionMode: { type: Number, default: GridSelectionMode.None },
        selectedItems: { type: Array<any>, default: [] },
        modelValue: { type: Array<any>, required: true },
        isSortable: { type: Boolean, default: false },
        sortByColumn: { type: Number, default: null },
        sortAscending: { type: Boolean, default: true },
        emptyText: {type: String, default: "No data"}
    },
    methods: {
        setOrder(colIdx: number) {
            const col = this.columns[colIdx];
            if(col.sortFn == null){
                return;
            }
            
            if(this._sortByColumn != colIdx ) {
                this._sortByColumn = colIdx;
                this._sortAscending = true;
            } else {
                this._sortAscending = !this._sortAscending;
            }
            this.sort();
        },
        sort() {
            if (!this.isSortable || this._sortByColumn === null || this._sortByColumn < 0 || this._sortByColumn >= this.columns.length)
                return;
            const col = this.columns[this._sortByColumn];
            if(col.sortFn == null)
                return;
            
            const sortFn = this._sortAscending
                ? col.sortFn 
                : (a:any,b:any) => -col.sortFn!(a,b);

            this._modelValue = this._modelValue.slice().sort(sortFn);
        },
        // Selection
        itemClicked(ev: MouseEvent, idx: number){
            if (this.selectionMode == GridSelectionMode.None) {
                return;
            } else if (this.selectionMode == GridSelectionMode.One) {
                this.deselectAll();
                this.selectItem(this._modelValue[idx]);
                return;
            }

            if (!ev.ctrlKey) {
                this.deselectAll();
            }
            if (ev.shiftKey) {
                const l = Math.min(idx, this.lastItemClicked);
                const h = Math.max(idx, this.lastItemClicked);
                if (l != h)
                    ev.preventDefault();
                for (let i = l; i <= h; i++) {
                    this.selectItem(this._modelValue[i]);
                }
            } else {
                this.toggleItemSelection(this._modelValue[idx]);
                this.lastItemClicked = idx;
            }
        },
        toggleItemSelection(item: any){
            const selIdx = this._selectedItems.indexOf(item);
            if (selIdx >= 0) {
                this.deselectItem(item, selIdx);
            } else {
                this.selectItem(item);
            }
        },
        selectItem(item: any){
            const a = this._selectedItems.slice();
            a.push(item);
            this._selectedItems = a;
        },
        deselectItem(item: any, selIdx: number | null = null) {
            selIdx = selIdx == null ? this._selectedItems.indexOf(item) : selIdx;
            this._selectedItems = this._selectedItems.slice(0, selIdx).concat(this._selectedItems.slice(selIdx + 1));
        },
        deselectAll() {
            this._selectedItems = [];
        }
    },
    computed: {
        _sortByColumn: {
            get(): number { return this.sortByColumnField; },
            set(v: number) { this.sortByColumnField = v; this.sort(); this.$emit("update:sortByColumn", v); }
        },
        _sortAscending: {
            get(): boolean { return this.sortAscendingField; },
            set(v: boolean) { this.sortAscendingField = v; this.sort(); this.$emit("update:sortAscending", v); }
        },
        _selectedItems: {
            get(): Array<any> { return this.selectedItemsField; },
            set(v: Array<any>) { this.selectedItemsField = v; this.$emit("update:selectedItems", v); }
        },
        _modelValue: {
            get(): Array<any> { return this.modelValueField; },
            set(v: Array<any>) { 
                let d = false;
                if (v.length != this.modelValueField.length) {
                    d = true;
                } else {
                    for(let i = 0; i < v.length; i++)
                        if(v[i] != this.modelValueField[i]) {
                            d = true;
                            i = v.length;
                        }
                }

                if(d) {
                    this.modelValueField = v; 
                this.sort();
                    this.$emit("update:modelValue", v);
                }
             }
        },
    },
    watch: {
        modelValue: {
            handler(newVal) { this._modelValue = newVal; },
            deep: true
        },
        sortByColumn(newVal) {
            this._sortByColumn = newVal;
        },
        sortAscending(newVal) {
            this._sortAscending = newVal;
        },
        selectedItems(newVal) {
            this.selectedItemsField = newVal;            
        }
    }
}
</script>

<style>

</style>