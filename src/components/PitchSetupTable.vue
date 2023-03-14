<template>
    <div>
      <div class="table-container">
            <table class="table is-narrow is-fullwidth is-striped is-hoverable">
                <thead>
                    <tr>
                        <th @click="setOrder(OrderBy.A)">A</th>
                        <th @click="setOrder(OrderBy.B)">B</th>
                        <th @click="setOrder(OrderBy.C)">C</th>
                        <th @click="setOrder(OrderBy.D)">D</th>
                        <th @click="setOrder(OrderBy.P)" :title="i18n.genericPitch+'('+i18n.genericMetric+')'">Pm</th>
                        <th @click="setOrder(OrderBy.P, false)" :title="i18n.genericPitch+'('+i18n.genericImperial+')'">Pi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) of filteredModel" :key="idx" :class="{'is-active': selectedItem == item}" @click="$emit('update:selectedItem', item)">
                        <td>{{ format(item.gearA) }}</td>
                        <td>{{ format(item.gearB) }}</td>
                        <td>{{ format(item.gearC) }}</td>
                        <td>{{ format(item.gearD) }}</td>
                        <td>{{ item.pitch.toString() }}</td>
                        <td>{{ item.pitch.convert().toString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { PitchSetup } from '@/bll/pitchSetup';
import GlobalConfig from '@/bll/globalConfig';


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