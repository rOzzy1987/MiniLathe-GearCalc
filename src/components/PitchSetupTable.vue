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
        :itemsPerPage="itemsPerPage"/>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';
import GcMath from '@/bll/math';
import { Pitch, PitchType } from '@/bll/pitch';
import DataGrid, { GridColumnDefinition, GridSelectionMode } from '@/grid/DataGrid.vue';
import { PitchSetup } from '@/bll/pitchSetup';

export default {
    data() {
        const i18n = GlobalConfig.i18n;
        return {
            cols: [
                new GridColumnDefinition("A", i => i.gearA).asNumericColumn().withStyle("width: 10%").withHeaderCssClasses(['has-text-right']),
                new GridColumnDefinition("B", i => i.gearB).asNumericColumn().withStyle("width: 10%").withHeaderCssClasses(['has-text-right']),
                new GridColumnDefinition("C", i => i.gearC).asNumericColumn().withStyle("width: 10%").withHeaderCssClasses(['has-text-right']),
                new GridColumnDefinition("D", i => i.gearD).asNumericColumn().withStyle("width: 10%").withHeaderCssClasses(['has-text-right']),
                new GridColumnDefinition("Pm", i => i.pitch, i18n.genericPitch+' ('+i18n.genericMetric+')').withSort((a,b) => a.pitch.value - b.pitch.value)
                .withFormat(p => this.formatPitch(p)).withAlignRight().withStyle("width: 30%").withHeaderCssClasses(['has-text-right']),
                new GridColumnDefinition("Pi", i => i.pitch.convert(), i18n.genericPitch+' ('+i18n.genericImperial+')').withSort((a,b) => b.pitch.value - a.pitch.value)
                .withFormat(p => this.formatPitch(p)).withAlignRight().withStyle("width: 30%").withHeaderCssClasses(['has-text-right']),
            ],
            i18n,
            GridSelectionMode: GridSelectionMode
        };
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
        orderBy: { type: Number, default: null },
        orderAscending: { type: Boolean, default: true },
        filter: { type: Object, default: null },
        isSortable: {type: Boolean, default: true },
        selectedItem: {type: PitchSetup},
        isExportEnabled: {type: Boolean, default: false},
        itemsPerPage: {type: Number, default: Number.POSITIVE_INFINITY}
    },
    methods: {
        formatPitch(v: Pitch) {
            return GcMath.round(v.value, 0.001).toFixed(3) + " " + (v.type == PitchType.Metric ? "mm/rev" : "TPI");
        },
    },
    mounted() {
        GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
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
            get(): number { return this.orderBy; },
            set(v: number) { this.$emit("update:orderBy", v); }
        },
        ascending: {
            get(): boolean { return this.orderAscending; },
            set(v: boolean) { this.$emit("update:orderAscending", v); }
        },
        selectedItems: {
            get(): Array<any> { return [this.selectedItem]; },
            set(v: Array<any>) { this.$emit("update:selectedItem", v.length > 0 ? v[0] : null); }
        }
    },
    components: { DataGrid }
}
</script>