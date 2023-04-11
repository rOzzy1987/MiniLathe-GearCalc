<template>
    <div class="field">
        <label v-if="label?.length ?? 0 > 0" class="label" :placeholder="placeholder ?? ''">{{ label }}</label>
        <numeric-field v-model="teeth" :required="required" :minValue="8" :maxValue="250" :decimals="0" v-model:isValid="teethValid" />
        <ul v-if="!teethValid" class="help is-danger">
            <li> {{ teethError }} </li>
        </ul>
        <div class="columns">
            <div class="column">
                <boolean-switch v-model="moduleMetric" :label1="'M'" :label2="'DP'" :size="60"/>
            </div>
            <div class="column">
                <numeric-field v-model="moduleNo" :required="required" :decimals="2" :min-value="moduleMetric ? .5 : 8 " :max-value="moduleMetric ? 3 : 50" v-model:is-valid="moduleValid"/>
                <ul v-if="!moduleValid" class="help is-danger">
                    <li> {{ moduleError }} </li>
                </ul>
            </div>
            <div class="column">
                <button class="button has-icon is-danger" @click.prevent="clearGear">
                    <i class="fas fa-delete"></i>
                </button>
            </div>
        </div>
        <ul v-if="!isValid" class="help is-danger">
            <li v-for="item of validationMessages" :key="item"> {{ item }} </li>
        </ul>
        <div v-if="tip?.length ?? 0 > 0" class="help is-info">
            {{ tip }}
        </div>
    </div>
</template>

<script lang="ts">
import { Gear, ModuleType } from '@/bll/gear'
import BooleanSwitch from '../InputFields/BooleanSwitch.vue'
import NumericField from '../InputFields/NumericField.vue'
export default {
    data () {
        return {
            isTeethValid: true,
            isModuleValid: true,
            teethError: "",
            moduleError: "",
        }
    },
    props: {
        modelValue: { type: Gear },
        label: { type: String },
        placeholder: { type: String },
        tip: { type: String },
        required: { type: Boolean, default: false },
        isValid: { type: Boolean, default: true },
        validationMessages: { type: Array<string> }
    },
    methods: {
        getOrCreateGear() {
            if (this.modelValue != undefined)
                return this.modelValue;
            const g = Gear.fromString("M1Z20")!;
            this.$emit("update:modelValue", g);
            return g;
        },
        clearGear() {
            if(this.modelValue == undefined)
                return;
            this.$emit("update:modelValue", undefined);
        },
        validate() {
            const v = this.isTeethValid && this.isModuleValid;
            if (this.isValid != v)
                this.$emit("update:isValid", v);
        }
    },
    computed: {
        moduleNo: {
            get(): number { return this.modelValue?.module.number ?? NaN; },
            set(v: number) { 
                if(Number.isNaN(v)){
                    this.clearGear();
                } else {
                    this.getOrCreateGear().module.number = v;
                }
            }
        },
        moduleMetric: {
            get(): boolean { return this.modelValue?.module.type == ModuleType.Metric ?? false; },
            set(v: boolean) { this.getOrCreateGear().module.type = v ? ModuleType.Metric : ModuleType.DiametralPitch;}
        },
        teeth: {
            get(): number { return this.modelValue?.teeth ?? NaN; },
            set(v: number) { 
                if(Number.isNaN(v)){
                    this.clearGear();
                } else {
                    this.getOrCreateGear().teeth = v;
                }
            }
        },
        teethValid: {
            get() { return this.isTeethValid; },
            set(v: boolean) { this.isTeethValid = v; this.validate(); }
        },
        moduleValid: {
            get() { return this.isModuleValid; },
            set(v: boolean) { this.isModuleValid = v; this.validate(); }
        }
    },

  components: { BooleanSwitch, NumericField },
}
</script>

<style>

</style>