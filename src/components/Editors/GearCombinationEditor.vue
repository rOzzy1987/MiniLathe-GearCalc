<template>
    <div class="columns">
        <div class="column">
            <GearEditor v-model="ga" label="A" :required="checkRequired" v-model:isValid="isGearAValid" :forceHideModuleEditor="hideModuleEditors" :defaultModule="defaultModule"/>
        </div>
        <div class="column">
            <GearEditor v-model="gb" label="B" :required="false" v-model:isValid="isGearBValid" :errorMessages="gearBValidationMessage" :forceHideModuleEditor="hideModuleEditors" :defaultModule="defaultModule"/>
        </div>
        <div class="column">
            <GearEditor v-model="gc" label="C" :required="false" v-model:isValid="isGearCValid" :errorMessages="gearCValidationMessage" :forceHideModuleEditor="hideModuleEditors" :defaultModule="defaultModule"/>
        </div>
        <div class="column">
            <GearEditor v-model="gd" label="D" :required="checkRequired" v-model:isValid="isGearDValid" :forceHideModuleEditor="hideModuleEditors" :defaultModule="defaultModule"/>
        </div>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';
import { Gear, GearModule } from '@/bll/gear';
import GearEditor from './GearEditor.vue';

export default {
    data() {
        return {
            isGearAValid: true,
            isGearBValid: true,
            isGearCValid: true,
            isGearDValid: true,
            i18n: GlobalConfig.i18n,
        }
    },
    props: {
        gearA: {type: Gear},
        gearB: {type: Gear},
        gearC: {type: Gear},
        gearD: {type: Gear},
        checkRequired: {type: Boolean, default: true},
        maxSize: {type:Number, default: 130},
        isValid: {type: Boolean, default: true},
        isComboValid: {type: Boolean, default: true},
        hideModuleEditors: { type: Boolean, default: false },
        defaultModule: { type: GearModule },
    },
    computed: {
        ga: {
            get() { return this.gearA; },
            set(v: number) { this.$emit("update:gearA", v); }
        },
        gb: {
            get() { return this.gearB; },
            set(v: number) { this.$emit("update:gearB", v); }
        },
        gc: {
            get() { return this.gearC; },
            set(v: number) { this.$emit("update:gearC", v); }
        },
        gd: {
            get() { return this.gearD; },
            set(v: number) { this.$emit("update:gearD", v); }
        },
        isGearBMissing() {
            return Number.isNaN(this.gb) && !Number.isNaN(this.gc);
        },
        isGearCMissing() {
            return Number.isNaN(this.gc) && !Number.isNaN(this.gb);
        },
        gearBValidationMessage(){
            if(this.isGearBMissing && this.checkRequired)
                return [this.i18n.genericGearBMissing];
            return [];
        },
        gearCValidationMessage(){
            if(this.isGearCMissing && this.checkRequired)
                return [this.i18n.genericGearCMissing];
            return [];
        }
    },
    methods: {
        validate(){
            const isValid = this.checkRequired 
                ? 
                    this.isGearAValid && 
                    this.isGearBValid && 
                    this.isGearCValid && 
                    this.isGearDValid && 
                    !this.isGearBMissing && 
                    !this.isGearCMissing
                :
                    this.isGearAValid && 
                    this.isGearBValid && 
                    this.isGearCValid && 
                    this.isGearDValid;

            if (this.isValid != isValid)
                this.$emit("update:isValid", isValid);
            const isComboValid = this.checkRequired
                ? isValid
                : 
                    !Number.isNaN(this.ga) &&
                    !Number.isNaN(this.gd) && 
                    !this.isGearCMissing &&
                    !this.isGearBMissing;
            if (this.isComboValid != isComboValid)
                this.$emit("update:isComboValid", isComboValid);

            return isValid;
        }
    },
    watch: {
        isGearAValid() { this.validate(); },
        isGearBValid() { this.validate(); },
        isGearCValid() { this.validate(); },
        isGearDValid() { this.validate(); },
        ga() { this.validate(); },
        gb() { this.validate(); },
        gc() { this.validate(); },
        gd() { this.validate(); },
    },
    mounted() {
      this.validate();
    },
    emits: [
        "update:isValid",
        "update:isComboValid",
        "update:gearA",
        "update:gearB",
        "update:gearC",
        "update:gearD",
    ],
    components: { GearEditor }
}
</script>