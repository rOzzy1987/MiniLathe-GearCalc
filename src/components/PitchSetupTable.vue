<template>
    <div>
      <DataGrid 
        v-model="filteredModel" 
        v-model:columns="cols" 
        v-model:sortByColumn="order" 
        v-model:sortAscending="ascending"
        v-model:selectedItems="selectedItems" 
        :isSortable="isSortable" 
        :selectionMode="GridSelectionMode.One"
        :isExportEnabled="isExportEnabled"
        :isPrintEnabled="isPrintEnabled && !isNativeApp"
        :isItemsPerPageEditable="isItemsPerPageEditable"
        :itemsPerPage="itemsPerPage"
        :rowCommands="rowCommands"
        :emptyText="i18n.genericEmpty"
        :exportText="i18n.genericExportCsv"
        :printText="i18n.genericPrint"
        :pagingFooterText="'{0}/{1}'"/>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';
import DataGrid, { GridSelectionMode } from '@/grid/DataGrid.vue';
import { PitchSetup } from '@/bll/pitchSetup';
import { GearHelper, PitchHelper } from './gridHelpers';
import { GridRowCommandDefinition, type IGridRowCommandDefinition } from '@/grid/GridCommandDefinition';
import { GridColumnDefinition } from '@/grid/GridColumnDefinition';
import { DeviceHelper } from '@/bll/device';

export class AddToFavoritesRowCommand extends GridRowCommandDefinition {
    public constructor(){
        super((item => GlobalConfig.addFavorite(item)));
        this.withIcon("far fa-heart")
            .withClass("is-small")
            .withLabel(GlobalConfig.i18n.genericAddToFavorites)
            .withFilter((item) => !GlobalConfig.isFavorite(item));
    }
}
export class RemoveFavoriteRowCommand extends GridRowCommandDefinition {
    public constructor(){
        super((item => GlobalConfig.removeFavorite(item)));
        this.withIcon("fas fa-heart")
            .withClass("is-small")
            .withLabel(GlobalConfig.i18n.genericRemoveFavorite)
            .withFilter((item) => GlobalConfig.isFavorite(item));
    }
}

export default {
    data() {
        const i18n = GlobalConfig.i18n;
        return {
            cols: [
                new GridColumnDefinition("a", "A", i => i.gearA)
                    .withFormat(g => GearHelper.formatFn(g, () => this.hideModules))
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("b", "B", i => i.gearB)
                    .withFormat(g => GearHelper.formatFn(g, () => this.hideModules))
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("c", "C", i => i.gearC)
                    .withFormat(g => GearHelper.formatFn(g, () => this.hideModules))
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("d", "D", i => i.gearD)
                    .withFormat(g => GearHelper.formatFn(g, () => this.hideModules))
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("pm", "Pm", i => i.pitch, i18n.genericPitch+' ('+i18n.genericMetric+')')
                    .withFormat(PitchHelper.formatFnShowMetric)
                    .withSortForValues(PitchHelper.sortFnPreferMetric)
                    .withStyle("width: 30%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("pi", "Pi", i => i.pitch, i18n.genericPitch+' ('+i18n.genericImperial+')')
                    .withFormat(PitchHelper.formatFnShowImperial)
                    .withSortForValues(PitchHelper.sortFnPreferImperial)
                    .withStyle("width: 30%").withAlignRight().withHeaderAlignRight(),
            ],
            isNativeApp: true,
            config: GlobalConfig.config,
            favorites: GlobalConfig.favorites,
            i18n,
            GridSelectionMode: GridSelectionMode
        };
    },
    props: {
        modelValue: { type: Array<PitchSetup>, required: true }, 
        orderBy: { type: String, default: undefined },
        orderAscending: { type: Boolean, default: true },
        filter: { type: Object, default: null },
        isSortable: {type: Boolean, default: true },
        isItemsPerPageEditable: {type: Boolean, default: false},
        selectedItem: {type: PitchSetup},
        isExportEnabled: {type: Boolean, default: false},
        isPrintEnabled: {type: Boolean, default: false},
        itemsPerPage: {type: Number, default: Number.POSITIVE_INFINITY},
        rowCommands: {type: Array<IGridRowCommandDefinition>, default: [] },
        hideModules: {type: Boolean, default: false},
    },
    computed: {
        filteredModel() {
            let src = [];
            if (this.filter == null)
                src = this.modelValue;
            else
                src = this.modelValue.filter(this.filter.filter);
            return src;
        },
        order: {
            get(): string | undefined { return this.orderBy; },
            set(v: string | undefined) { this.$emit("update:orderBy", v); }
        },
        ascending: {
            get(): boolean { return this.orderAscending; },
            set(v: boolean) { this.$emit("update:orderAscending", v); }
        },
        selectedItems: {
            get(): Array<any> { return [this.selectedItem]; },
            set(v: Array<any>) { this.$emit("update:selectedItem", v.length > 0 ? v[0] : null); }
        },        
        isMultiModule() {
            return this.config.isMultiModule;
        }
    },
    async created() {
        this.isNativeApp = await DeviceHelper.isNativeApp();
    },
    components: { DataGrid }
}
</script>