<template>
    <div class="content" style="width: 100%; overflow-x: auto;" :style="{'user-select': selectionMode != GridSelectionMode.None ? 'none': 'initial'}">
        <div v-if="title != ''" class="control">
            {{ title }}
        </div>
        <div v-if="isColumnListOrderable || optionalColumns.length > 0" class="has-text-right">
            <div class="dropdown is-right column-customizer" :class="{'is-active': columnCustomization.selectorActive}" >
                <div class="dropdown-trigger" style="right: 0 !important">
                    <button ref="columnsButton" class="button has-icon is-small" aria-haspopup="true" aria-controls="dropdown-menu" @click.prevent="columnCustomization.selectorActive = !columnCustomization.selectorActive">
                        <i class="fas fa-table-columns"></i>
                    </button>
                </div>
                <div class="dropdown-menu" role="menu">
                    <div class="dropdown-content"
                        @mousemove="colOrderMoveItem($event, {x: $event.clientX, y: $event.clientY})"
                        @touchmove="colOrderMoveItem($event, {x: $event.touches[0].clientX, y: $event.touches[0].clientY})"
                        @mouseup="colOrderReleaseItem($event)"
                        @touchend="colOrderReleaseItem($event)" :key="columnCustomization.key">
                        <div v-for="col of _columns" :key="col.id" :name="col.id" class="dropdown-item has-text-left" @click.prevent="if (col.isOptional) col.isHidden = !col.isHidden;">
                            <span class="icon is-pulled-left">
                                <i :class="{'far fa-square-plus': col.isOptional && col.isHidden, 'fas fa-square-minus': col.isOptional && !col.isHidden}"></i>
                            </span>
                            <span class="icon is-pulled-right" v-if="isColumnListOrderable"
                                @mousedown="colOrderGrabItem($event, {x: $event.clientX, y: $event.clientY})"
                                @touchstart="colOrderGrabItem($event, {x: $event.touches[0].clientX, y: $event.touches[0].clientY})">
                                <i class="fas fa-bars"></i>
                            </span>
                            <span class="text">{{ col.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <table class="table is-narrow is-fullwidth is-striped is-hoverable" :key="columnCustomization.key">
                <thead>
                    
                    <tr>
                        <th v-for="col of displayedColumns" :key="col.idx" :title="col.column.tooltip ?? undefined" @click="setOrder(col.column.id)" :style="col.column.headerStyle" :class="col.column.headerCssClasses">
                            <span v-if="isSortable && _sortByColumn == col.column.id" class="icon is-small"><i class="fas" :class="{'fa-sort-up': _sortAscending, 'fa-sort-down': !_sortAscending}"></i></span>
                            {{ col.column.title }}
                        </th>
                        <th v-if="rowCommands.length > 0">
                         </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, j) of _pagedModelValue" :key="j" :class="{'is-selected': _selectedItems.indexOf(item) >= 0}" @click="itemClicked($event, j)">
                        <td v-for="col of displayedColumns" :key="col.idx" :style="col.column.style" :class="col.column.cssClasses" v-html="col.column.getHtml(item)"></td>
                        <td v-if="rowCommands.length > 0" class="no-print" >
                            <RowCommandButton class="is-small no-print" v-for="(cmd, i) in rowCommandsForItem(item)" :key="i" :css-class="cmd.cssClass" :icon-class="cmd.iconClass" :label="cmd.label" @click="cmd.command(item)"/>
                        </td>
                    </tr>
                    <tr v-if="_modelValue.length == 0">
                        <td :colspan="columnCount">{{ emptyText }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr v-if="isFooterEnabled">
                        <th v-for="col of displayedColumns" :key="col.idx" :title="col.column.tooltip ?? undefined" @click="setOrder(col.column.id)" :style="col.column.headerStyle" :class="col.column.headerCssClasses">
                            <span v-if="isSortable && _sortByColumn == col.column.id" class="icon is-small"><i class="fas" :class="{'fa-sort-up': _sortAscending, 'fa-sort-down': !_sortAscending}"></i></span>
                            {{ col.column.title }}
                        </th>
                        <th v-if="rowCommands.length > 0">
                         </th>
                    </tr>
                    <tr v-if="_itemsPerPage != Number.POSITIVE_INFINITY" class="no-print">
                        <td :colspan="columnCount">
                            <button class="button is-small has-icon" :disabled="_page == 0" @click.prevent="_page = 0"><i class="fas fa-angles-left"></i></button>
                            &nbsp;
                            <button class="button is-small has-icon" :disabled="_page == 0" @click.prevent="_page--"><i class="fas fa-angle-left"></i></button>
                            &nbsp;
                            <span v-for="i in pageButtons" :key="i">
                                <button class="button is-small" :class="{'is-primary': i == _page}" @click.prevent="_page = i">{{ i + 1 }}</button>
                                &nbsp;
                            </span>
                            <button class="button is-small has-icon" :disabled="_page == lastPage" @click.prevent="_page++"><i class="fas fa-angle-right"></i></button>
                            &nbsp;
                            <button class="button is-small has-icon" :disabled="_page == lastPage" @click.prevent="_page = lastPage"><i class="fas fa-angles-right"></i></button>
                            <div class="is-pulled-right is-size-7" v-if="pagingFooterText != undefined">{{ pagingFooterText.replace("{0}", "" + (_page + 1)).replace("{1}", "" + (lastPage + 1)) }}</div>
                        </td>
                    </tr>
                    <tr class="no-print">
                        <td :colspan="columnCount">
                            <div class="tile">
                                <div class="tile is-child buttons">
                                    <span v-for="(cmd, i) in commandsForSelectedItems(selectedItems)" :key="i">
                                        <CommandButton class="is-small" :css-class="cmd.cssClass" :icon-class="cmd.iconClass" :label="cmd.label" @click="cmd.command(selectedItems)"/>
                                        &nbsp;
                                    </span>
                                </div>
                                <div class="tile is-child is-size-7" v-if="isItemsPerPageEditable">
                                    {{ itemsPerPageSelectorText }}
                                    <span v-for="n of [10, 20, 50, 100, 200]" :key="n" :style="{'text-decoration': _itemsPerPage == n ? 'underline' : 'none'}" @click="_itemsPerPage = n">&nbsp;{{ n }}&nbsp;</span>
                                </div>
                                <div class="tile is-child has-text-right is-size-7" v-if="itemsFooterText != undefined">
                                    {{ itemsFooterText.replace("{0}", "" + modelValue.length ) }}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
    </div>
</template>
<script lang="ts">
import CommandButton from './CommandButton.vue';
import RowCommandButton from './RowCommandButton.vue';
export interface IGridColumnDefinition {
    readonly id: string;
    readonly title: string;
    readonly tooltip: string | null;
    readonly valueFn: (item: any) => any;
    readonly formatFn: (value: any) => string;
    readonly sortFn: ((val1:any, val2:any) => number) | null;
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
export interface IGridCommandDefinition {
    label: string | undefined;
    iconClass: string | undefined;
    cssClass: string | undefined;
    command: (selectedItems: any[]) => any;
    filter: (selectedItems: any[]) => boolean;
}
export interface IGridRowCommandDefinition {
    label: string | undefined;
    iconClass: string | undefined;
    cssClass: string | undefined;
    command: (item: any) => any;
    filter: (item: any) => boolean;
}
class __BaseCommandDefinition {
    protected _label: string | undefined = undefined;
    protected _iconClass: string | undefined = undefined;
    protected _cssClass: string | undefined = undefined;
    public get label() { return this._label; }
    public get iconClass() { return this._iconClass; }
    public get cssClass() { return this._cssClass; }
}
class BaseCommandDefinition<TDef extends __BaseCommandDefinition> extends __BaseCommandDefinition {
    public withLabel(label: string): TDef {
        this._label = label;
        return this as unknown as TDef;
    }
    
    public withIcon(iconClass: string): TDef {
        this._iconClass = iconClass;
        return this as unknown as TDef;
    }
    
    public withClass(cssClass: string): TDef {
        this._cssClass = cssClass;
        return this as unknown as TDef;
    }
}
export class GridCommandDefinition extends BaseCommandDefinition<GridCommandDefinition> implements IGridCommandDefinition{
    private _command: (selectedItems: any[]) => any;
    private _filter: (selectedItems: any[]) => boolean = _ => _==_;
    public get command() { return this._command; }
    public get filter() { return this._filter; }
    public constructor(command: (selectedItems: any[]) => any){
        super();
        this._command = command;
    }
    public withFilter(filterFn: (selectedItems: any[]) => boolean) : GridCommandDefinition {
        this._filter = filterFn;
        return this;
    }
}
export class GridRowCommandDefinition extends BaseCommandDefinition<GridRowCommandDefinition> implements IGridRowCommandDefinition {
    private _command: (item: any) => any;
    private _filter: (item: any) => boolean = _ => _==_;
    public get command() { return this._command; }
    public get filter() { return this._filter; }
    public constructor(command: (item: any) => any){
        super();
        this._command = command;
    }
    public withFilter(filterFn: (item: any) => boolean) : GridRowCommandDefinition {
        this._filter = filterFn;
        return this;
    }
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
            columnsField: props.columns,
            lastItemClicked: 0,
            pageField: props.page,
            itemsPerPageField: props.itemsPerPage,
            columnCustomization: {
                selectorActive: false,
                columnGrabbed: null as HTMLElement | null,
                origin: null as {x:number, y: number} | null,
                key: "rndKey"
            }, 
            GridSelectionMode: GridSelectionMode,
        };
    },
    props: {
        title: { type: String, default: null },
        columns: { type: Array<IGridColumnDefinition>, required: true },
        rowCommands: { type: Array<IGridRowCommandDefinition>, default: [] },
        gridCommands: { type: Array<IGridRowCommandDefinition>, default: [] },
        selectionMode: { type: Number, default: GridSelectionMode.None },
        selectedItems: { type: Array<any>, default: [] },
        modelValue: { type: Array<any>, required: true },
        // Sorting
        isSortable: { type: Boolean, default: false },
        sortByColumn: { type: String },
        sortAscending: { type: Boolean, default: true },
        // Misc. functions
        isColumnListOrderable: {type: Boolean, default: false },
        isFooterEnabled: { type: Boolean, default: false },
        isExportEnabled: { type: Boolean, default: false },
        isPrintEnabled: { type: Boolean, default: false },
        isItemsPerPageEditable: {type: Boolean, default: false },
        // Paging
        itemsPerPage: { type: Number, default: Number.POSITIVE_INFINITY },
        page: { type: Number, default: 0 },
        // Internationalization
        emptyText: { type: String, default: "- No data -" },
        exportText: {type: String, default: "Export to CSV"},
        printText: { type: String, default: "Print" },
        pagingFooterText: { type: String },
        itemsFooterText: { type: String },
        itemsPerPageSelectorText: {type: String, default: "Items per page: "},
    },
    methods: {
        colOrderGrabItem(event: Event, origin: {x:number, y: number}) {
            let item = event.target as HTMLElement  
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            let i = 0;
            while (!item.classList.contains('dropdown-item') && i < 3) {
                item = item.parentElement!;
            } 
            cc.columnGrabbed = item;
            cc.origin = origin;
            item.classList.add('grabbed');
            event.preventDefault();
        },
        colOrderMoveItem(event: Event, coord: {x:number, y: number}) {
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            const item = cc.columnGrabbed;
            if (item == null || cc.origin == null) 
                return;
            const container = item.parentElement!;
            const bounds = container.getBoundingClientRect();
            const itemBounds = item.getBoundingClientRect();
            item.style.top = Math.min(bounds.y + bounds.height - itemBounds.height,  Math.max(bounds.y - cc.origin.y, coord.y - cc.origin.y)) + "px";

            const allItems = [];
            let oldIdx = 0;
            for(let i = 0; i < container.children.length; i++){
                const current = container.children.item(i)!;
                allItems.push(current);
                if (current.getAttribute('name') == item.getAttribute('name')) {
                    oldIdx = i;
                }
            }
            allItems.sort((a,b) => {
                    const aPos = a?.getBoundingClientRect().y ?? 0;
                    const aOffset = Number(((a as HTMLElement | null)?.style.top ?? "0").replace("px", ""));
                    const bPos = b?.getBoundingClientRect().y ?? 0;
                    const bOffset = Number(((b as HTMLElement | null)?.style.top ?? "0").replace("px", ""));
                    return (aPos + aOffset) - (bPos + bOffset);
                }
            );

            const newIdx = allItems.findIndex(i => i.getAttribute('name') == item.getAttribute('name'));
            
            if (oldIdx !=  newIdx) {
                var c =  container.children.item(oldIdx)!;
                const oldY = c.getBoundingClientRect().y;
                c.remove();
                if (newIdx == 0){
                    container.children.item(0)?.before(c);
                } else {
                    container.children.item(newIdx - 1)?.after(c);
                }
                const newY = c.getBoundingClientRect().y;
                cc.origin.y += newY - oldY;
                item.style.top = Math.min(bounds.y + bounds.height - itemBounds.height,  Math.max(bounds.y - cc.origin.y, coord.y - cc.origin.y)) + "px";
            }

            event.preventDefault();
        },
        colOrderReleaseItem(event: Event) {
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            const item = cc.columnGrabbed!;
            if (item == null) 
                return;
            item.classList.remove('grabbed');
            item.style.top = '0';
            cc.columnGrabbed = null;

            const container = item.parentElement!;
            const allItems = [];
            for(let i = 0; i < container.children.length; i++){
                allItems.push(container.children.item(i)!);
            }
            
            const orderedColumns = [];
            for (const i of allItems) {
                const name = i.getAttribute('name');
                orderedColumns.push(this._columns.filter(c =>c.id == name)[0]);
            }
            this._columns = orderedColumns;
            cc.key = "rnd"+ Math.round(Math.random()* 10000);

            event.preventDefault();
        },
        setOrder(colId: string) {
            const col = this._columns.filter(c => c.id == colId)[0];
            if (col == null || col.sortFn == null) {
                return;
            }
            if (this._sortByColumn != colId) {
                this._sortByColumn = colId;
                this._sortAscending = true;
            }
            else {
                this._sortAscending = !this._sortAscending;
            }
            this.sort();
        },
        sort() {
            if (!this.isSortable || this._sortByColumn == undefined)
                return;
            const col = this._columns.filter(c => c.id == this._sortByColumn)[0];
            if(col == null || col.sortFn == null)
                return;
            const sortFn = this._sortAscending
                ? col.sortFn
                : (a: any, b: any) => -col.sortFn!(a, b);
            this._modelValue = this._modelValue.slice().sort(sortFn);
        },
        // Selection
        itemClicked(ev: MouseEvent, idx: number) {
            if (this.selectionMode == GridSelectionMode.None) {
                return;
            }
            idx = this._itemsPerPage == Number.POSITIVE_INFINITY 
                ? idx
                : (this.page * this._itemsPerPage) + idx
            
            if (this.selectionMode == GridSelectionMode.One) {
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
            }
            else {
                this.toggleItemSelection(this._modelValue[idx]);
                this.lastItemClicked = idx;
            }
        },
        toggleItemSelection(item: any) {
            const selIdx = this._selectedItems.indexOf(item);
            if (selIdx >= 0) {
                this.deselectItem(item, selIdx);
            }
            else {
                this.selectItem(item);
            }
        },
        selectItem(item: any) {
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
        },
        rowCommandsForItem(item:any): IGridRowCommandDefinition[]{
            const r = [];
            for (const i in this.rowCommands) {
                const cmd = this.rowCommands[i];
                if (cmd.filter(item))
                r.push(cmd);
            }
            return r;
        },
        commandsForSelectedItems(items: any[]): IGridCommandDefinition[]{
            const r = [];
            for (const i in this._gridCommands) {
                const cmd = this._gridCommands[i];
                if (cmd.filter(items))
                r.push(cmd);
            }
            return r;
        },
        export() {
            const data = [];
            for (const item of this._modelValue) {
                const row  = [];
                for (const col of this._columns) {
                    row.push(col.exportFn(col.valueFn(item)));
                }
                data.push(row);
            }
            return data;
        },
        exportCsv() {
            const data = this.export();
            let csv = "";
            const sep = 1.2.toFixed(1) == "1,2" ? ';' : ','; 
            function format(val: any) {
                return "\""+((val+"").replace("\"", "\"\""))+"\"";
            }
            for (const col of this._columns) {
                csv += format(col.title) + sep;
            }
            csv += "\n";
            for (const row of data) {
                for (const i in row) {
                    csv += format(row[i]) + sep;
                }
                csv += "\n";
            }
            this.download(csv, "export.csv");
        },
        download(content: string | Blob, filename: string){
            const element = document.createElement('a');
            
            const uri = content.constructor.name == 'Blob'
                ? window.URL.createObjectURL(content as Blob)
                : 'data:text/plain;charset=utf-8,' + encodeURIComponent(content as string);
            element.setAttribute('href', uri);
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        print() {
            const styles = document.head.getElementsByTagName("style");
            const links = document.head.getElementsByTagName("link");
            const printWindow = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0') as Window;
            
            const h = printWindow.document.createElement("html");
            const hh = printWindow.document.createElement("head");
            const b = printWindow.document.createElement("body");
            h.appendChild(hh);
            h.appendChild(b);
            let hTxt = "<style>.no-print{display: none !important;} thead{display: table-header-group !important;} tfoot{display: table-footer-group !important;}</style><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
            for (let i = 0; i < links.length; i++) {
                const l = links.item(i) as HTMLLinkElement;
                if(l.rel != "stylesheet") continue;
                hTxt += l.outerHTML;
            }
            for (let i = 0; i < styles.length; i++) {
                const s = styles.item(i) as HTMLStyleElement;
                hTxt += s.outerHTML;
            }
            hh.innerHTML = hTxt;
            let table = "<table class=\"table is-fullwidth\"><thead><tr>";
            for (const col of this._columns) {
                table += "<th class=\"" + col.headerCssClasses.join(" ") + "\" style=\"" + (col.headerStyle ?? "") + "\">"+col.title+"</th>";
            }
            table += "</tr></thead><tbody>";
            for (const row of this._modelValue) {
                table += "<tr>";
                for (const col of this._columns) {
                    table += "<td class=\"" + col.cssClasses.join(" ") + "\" style=\"" + (col.style ?? "") + "\">" +  col.getHtml(row) + "</td>"
                }
                table += "</tr>"
            }
            table += "</tbody>";
            
            if(this.isFooterEnabled) {
                table += "<tfoot><tr>";
                for (const col of this._columns) {
                    table += "<th>"+col.title+"</th>";
                }
                table += "</tr><tfoot>";
            }
            table += "</table>";
            b.innerHTML = table;
            let isPrinted = false;
            function printFn() {
                if(isPrinted) return;
                isPrinted = true;
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }

            printWindow.document.write(h.outerHTML);
            printWindow.document.onload = printFn;
            setTimeout(printFn, 500); // leave some time to load stylesheets
            printWindow.document.close();
        },
        getColumnStates(): {id: string, isHidden: boolean}[] {
            return this._columns.map(c=> ({id: c.id, isHidden: c.isOptional && c.isHidden}));
        },
        setColumnStates(val: {id: string, isHidden: boolean}[]){
            if(val == undefined) return;
            const newColumns = [];
            console.log("setColumnStates", val);
            for (const i of val) {
                const col = this._columns.filter(c => c.id == i.id)[0];
                col.isHidden = col.isOptional && i.isHidden;
                newColumns.push(col);
            }
            // those columns that are not received get placed at the end in original order
            for (const c of this._columns){
                if(val.findIndex(i => c.id == i.id) == -1) {
                    newColumns.push(c);
                }
            }
            this._columns = newColumns;
        }
    },
    computed: {
        _sortByColumn: {
            get(): string | undefined { return this.sortByColumnField; },
            set(v: string | undefined) { this.sortByColumnField = v; this.sort(); this.$emit("update:sortByColumn", v); }
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
                }
                else {
                    for (let i = 0; i < v.length; i++)
                        if (v[i] != this.modelValueField[i]) {
                            d = true;
                            i = v.length;
                        }
                }
                if (d) {
                    this.modelValueField = v;
                    this.sort();
                    this.$emit("update:modelValue", v);
                }
            }
        },
        _pagedModelValue() {
            if (this._itemsPerPage == Number.POSITIVE_INFINITY) {
                return this._modelValue;
            }
            const s = this._page * this._itemsPerPage;
            return this._modelValue.slice(s, s + this._itemsPerPage);
        },
        _page: {
            get(): number { return this.pageField; },
            set(v: number) { this.pageField = v; this.$emit("update:page", v); }
        },
        _itemsPerPage: {
            get(): number { return this.itemsPerPageField; },
            set(v: number) { this.itemsPerPageField = v; this.$emit("update:itemsPerPage", v); }
        },
        _gridCommands(): IGridCommandDefinition[] {
                const r = this.gridCommands.slice();
                if(this.isExportEnabled) {
                    const csvCmd = 
                        new GridCommandDefinition(() => this.exportCsv())
                        .withIcon("fas fa-download")
                        .withLabel(this.exportText);
                    r.push(csvCmd);
                }
                if(this.isPrintEnabled) {
                    const printCmd = 
                        new GridCommandDefinition(() => this.print())
                        .withIcon("fas fa-print")
                        .withLabel(this.printText);
                    r.push(printCmd);
                }
                return r;
            
        },
        _columns: {
            get(): IGridColumnDefinition[] { return this.columnsField; },
            set(v: IGridColumnDefinition[]) { this.columnsField = v; this.$emit("update:columns", v); }  
        },
        lastPage() {
            return Math.ceil(this._modelValue.length / this._itemsPerPage) - 1;
        },
        pageButtons(){
            const r = [];
            for (let i = Math.max(0, this._page-5); i <= Math.min(this._page + 5, this.lastPage); i++) {
                r.push(i);
            }
            return r;
        },
        displayedColumns(): {column: IGridColumnDefinition, idx: number}[] {
            return this._columns
            .map((c,i) => {return {column: c, idx: i};})
            .filter(c => !c.column.isOptional || !c.column.isHidden)
        },
        optionalColumns() {
            return this._columns.filter(c => c.isOptional);
        },
        columnCount() {
            let r = this.displayedColumns.length;
            return this.rowCommands.length > 0 
                    ? r + 1
                    : r;
        },
        columnsButton() {
            return this.$refs.columnsButton as HTMLButtonElement;
        }
    },
    watch: {
        modelValue: {
            handler(newVal) { this._modelValue = newVal; },
            deep: true
        },
        columns: {
            handler(newVal) { this._columns = newVal; },
            deep: true
        },
        sortByColumn(newVal) {
            this._sortByColumn = newVal;
        },
        sortAscending(newVal) {
            this._sortAscending = newVal;
        },
        selectedItems(newVal) {
            this._selectedItems = newVal;
        },
        page(newVal) {
            this._page = newVal;
        },
        itemsPerPage(newVal) {
            this._itemsPerPage = newVal;
            this._page = 0;
        }
    },
    components: { CommandButton, RowCommandButton }
}
</script>
<style scoped>
.column-customizer .dropdown-item {
    z-index: 10;
}

.column-customizer .dropdown-item.grabbed {
    z-index: 20;
    background-color: #FFF;
    box-shadow: 0 0.5em 1em -0.125em #0a0a0a1a, 0 0 0 1px #0a0a0a05;
    position: relative;
    opacity: .5;
}
</style>