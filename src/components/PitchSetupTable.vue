<template>
    <div>
      <div class="table-container">
            <table class="table is-narrow is-fullwidth is-striped is-hoverable">
                <thead>
                    <tr>
                        <th @click="setOrder(OrderBy.A)" style="width: 10%">
                            <span v-if="orderBy == OrderBy.A" class="icon is-small"><i class="fas" :class="{'fa-sort-up': orderAscending, 'fa-sort-down': !orderAscending}"></i></span>
                            A
                        </th>
                        <th @click="setOrder(OrderBy.B)" style="width: 10%">
                            <span v-if="orderBy == OrderBy.B" class="icon is-small"><i class="fas" :class="{'fa-sort-up': orderAscending, 'fa-sort-down': !orderAscending}"></i></span>
                            B
                        </th>
                        <th @click="setOrder(OrderBy.C)" style="width: 10%">
                            <span v-if="orderBy == OrderBy.C" class="icon is-small"><i class="fas" :class="{'fa-sort-up': orderAscending, 'fa-sort-down': !orderAscending}"></i></span>
                            C
                        </th>
                        <th @click="setOrder(OrderBy.D)" style="width: 10%">
                            <span v-if="orderBy == OrderBy.D" class="icon is-small"><i class="fas" :class="{'fa-sort-up': orderAscending, 'fa-sort-down': !orderAscending}"></i></span>
                            D
                        </th>
                        <th @click="setOrder(OrderBy.P)" style="width: 30%" :title="i18n.genericPitch+'('+i18n.genericMetric+')'">
                            <span v-if="orderBy == OrderBy.P" class="icon is-small"><i class="fas" :class="{'fa-sort-up': orderAscending, 'fa-sort-down': !orderAscending}"></i></span>
                            Pm
                        </th>
                        <th @click="setOrder(OrderBy.P, false)" style="width: 30%" :title="i18n.genericPitch+'('+i18n.genericImperial+')'">
                            <span v-if="orderBy == OrderBy.P" class="icon is-small"><i class="fas" :class="{'fa-sort-up': !orderAscending, 'fa-sort-down': orderAscending}"></i></span>
                            Pi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) of filteredModel" :key="idx" :class="{'is-selected': selectedItem.toString() == item.toString()}" @click="$emit('update:selectedItem', item)">
                        <td>{{ format(item.gearA) }}</td>
                        <td>{{ format(item.gearB) }}</td>
                        <td>{{ format(item.gearC) }}</td>
                        <td>{{ format(item.gearD) }}</td>
                        <td>{{ formatPitch(item.pitch) }}</td>
                        <td>{{ formatPitch(item.pitch.convert()) }}</td>
                    </tr>
                    <tr v-if="filteredModel.length == 0">
                        <td colspan="6">{{ i18n.pitchTableNoResults }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { PitchSetup } from '@/bll/pitchSetup';
import GlobalConfig from '@/bll/globalConfig';
import GcMath from '@/bll/math';
import { Pitch, PitchType } from '@/bll/pitch';


export enum OrderBy {
    A, B, C, D, P, N
}

export default {
    data(){
        return {
            OrderBy : OrderBy,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
        orderBy: { type: Number, default: OrderBy.P},
        orderAscending: {type: Boolean, default: true},
        selectedItem: {type: PitchSetup, default: null},
        filter: { type: Object, default: null }
    },
    methods:{
        format(v: number){
            return Number.isNaN(v) ? "-" : v.toString();
        },
        formatPitch(v: Pitch){
            return GcMath.round(v.value, 0.001).toFixed(3) + " " + (v.type == PitchType.Metric ? "mm/rev" : "TPI");
        },
        setOrder(val: OrderBy, ascending: boolean = true){
            if (this.order == val)
                this.ascending = !this.ascending;
            else {
                this.order = val;
                this.ascending = ascending;
            }
        }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    computed:{
        filteredModel() {
            let src = [];
            if(this.filter == null)
                src = this.modelValue;
            else
                src = this.modelValue.filter(this.filter.filter);

            switch(this.order){
                case OrderBy.A:
                    return src.sort(this.ascending 
                        ? (a,b) => a.gearA - b.gearA 
                        : (a,b) => b.gearA - a.gearA);
                case OrderBy.B:
                    return src.sort(this.ascending 
                        ? (a,b) => a.gearB - b.gearB 
                        : (a,b) => b.gearB - a.gearB);
                case OrderBy.C:
                    return src.sort(this.ascending 
                        ? (a,b) => a.gearC - b.gearC 
                        : (a,b) => b.gearC - a.gearC);
                case OrderBy.D:
                    return src.sort(this.ascending 
                        ? (a,b) => a.gearD - b.gearD 
                        : (a,b) => b.gearD - a.gearD);
                case OrderBy.P:
                    return src.sort(this.ascending 
                        ? (a,b) => a.pitch.value - b.pitch.value 
                        : (a,b) => b.pitch.value - a.pitch.value);
                case OrderBy.N:
                    return src;
            }

            return src;
        },
        order: {
            get(): OrderBy { return this.orderBy; },
            set(v: OrderBy) { this.$emit("update:orderBy", v); }
        },
        ascending: {
            get(): boolean { return this.orderAscending; },
            set(v: boolean) { this.$emit("update:orderAscending", v); }
        }
    }
}
</script>
<style scoped>
  td, th {
    text-align: right !important;
} 
</style>