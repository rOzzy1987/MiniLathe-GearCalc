<template>
    <div class="field">
        <label v-if="label?.length ?? 0 > 0" class="label">{{ label }}</label>
        <label class="label is-small" v-if="isMultiModule">teeth</label>
        <numeric-field v-model="teeth" :required="required" :placeholder="placeholder ?? ''" :minValue="8" :maxValue="250" :decimals="0" v-model:isValid="teethValid" @enter="$emit('enter')"/>
        <ul v-if="!teethValid" class="help is-danger">
            <li> {{ teethError }} </li>
        </ul>
        &nbsp;
        <label class="label is-small" v-if="(isMultiModule || forceModuleEditor) && !forceHideModuleEditor">module</label>
        <div class="columns field" v-if="(isMultiModule || forceModuleEditor) && !forceHideModuleEditor">
            <div class="column">
                <boolean-switch :title="moduleMetric ? 'Metric' : 'Diametral Pitch'" v-model="moduleMetric" :label1="'M'" :label2="'DP'" :size="60"/>
            </div>
            <div class="column">
                <numeric-field v-model="moduleNo" :required="required" :decimals="2" :min-value="moduleMetric ? .5 : 8 " :max-value="moduleMetric ? 3 : 50" v-model:is-valid="moduleValid" @enter="$emit('enter')"/>
                <ul v-if="!moduleValid" class="help is-danger">
                    <li> {{ moduleError }} </li>
                </ul>
            </div>
            <div class="column" v-if="isDeleteButtonVisible">
                <button class="button has-icon is-danger" @click.prevent="clearGear">
                    <i class="fas fa-xmark"></i>
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
import { Gear, GearModule, ModuleType } from '@/bll/gear'
import BooleanSwitch from '../InputFields/BooleanSwitch.vue'
import NumericField from '../InputFields/NumericField.vue'
import { INCH } from '@/bll/math'
import GlobalConfig from '@/bll/globalConfig'
export default {
    data () {
        return {
            isTeethValid: true,
            isModuleValid: true,
            teethError: "",
            moduleError: "",
            config: GlobalConfig.config
        }
    },
    emits: [
        "update:modelValue",
        "update:isValid",
        "enter"
    ],
    props: {
        modelValue: { type: Gear },
        label: { type: String },
        placeholder: { type: String },
        tip: { type: String },
        required: { type: Boolean, default: false },
        isValid: { type: Boolean, default: true },
        validationMessages: { type: Array<string> },
        isDeleteButtonVisible: { type: Boolean, default: false },
        forceModuleEditor: { type: Boolean, default: false },
        forceHideModuleEditor: { type: Boolean, default: false },
        defaultModule: { type: GearModule }
    },
    methods: {
        getOrCreateGear() {
            if (this.modelValue != undefined)
                return this.modelValue;
            const g = new Gear(this.defaultModule == undefined ? this.config.sampleModule : this.defaultModule, 20)!;
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
            get(): boolean { return this.modelValue != undefined ? this.modelValue.module.type == ModuleType.Metric : true; },
            set(v: boolean) {
                const g = this.getOrCreateGear();
                const t = v ? ModuleType.Metric : ModuleType.DiametralPitch
                if (g.module.type != t)
                    g.module.number = INCH / g.module.number;
                g.module.type = t; }
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
        },
        isMultiModule () {
            return this.config.isMultiModule;
        }
    },

  components: { BooleanSwitch, NumericField },
}
</script>

<style>

</style>