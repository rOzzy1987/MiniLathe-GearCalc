<template>
    <div class="columns">
        <div class="column">
            <NumericEditor v-model="ga" label="A" :required="checkRequired" :minValue="18" :maxValue="100" :decimals="0" @validated="isGearAValid = $event"/>
        </div>
        <div class="column">
            <NumericEditor v-model="gb" label="B" :required="false" :minValue="18" :maxValue="100" :decimals="0" @validated="isGearBValid = $event;" :errorMessages="gearBValidationMessage"/>
        </div>
        <div class="column">
            <NumericEditor v-model="gc" label="C" :required="false" :minValue="18" :maxValue="100" :decimals="0" @validated="isGearCValid = $event;" :errorMessages="gearCValidationMessage"/>
        </div>
        <div class="column">
            <NumericEditor v-model="gd" label="D" :required="checkRequired" :minValue="18" :maxValue="100" :decimals="0" @validated="isGearDValid = $event"/>
        </div>
    </div>
</template>
<script lang="ts">
import NumericEditor from './NumericEditor.vue';

export default {
    data() {
        return {
            isGearAValid: true,
            isGearBValid: true,
            isGearCValid: true,
            isGearDValid: true,
        }
    },
    props: {
        gearA: {type: Number, default: 30},
        gearB: {type: Number, default: NaN},
        gearC: {type: Number, default: NaN},
        gearD: {type: Number, default: 60},
        checkRequired: {type: Boolean, default: true}
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
            return this.checkRequired 
                ? Number.isNaN(this.gb) && !Number.isNaN(this.gc)
                : false;
        },
        isGearCMissing() {
            return this.checkRequired
                ? Number.isNaN(this.gc) && !Number.isNaN(this.gb)
                : false;
        },
        gearBValidationMessage(){
            if(this.isGearBMissing)
                return ["Gear B is required if gear C is provided"];
            return [];
        },
        gearCValidationMessage(){
            if(this.isGearCMissing)
                return ["Gear C is required if gear B is provided"];
            return [];
        },
        isValid() {
            return this.isGearAValid
                && this.isGearBValid
                && this.isGearCValid
                && this.isGearDValid
                && !this.isGearBMissing
                && !this.isGearCMissing;
        }
    },
    watch: {
        isValid(n: boolean) {
            this.$emit("validated", n);
        }
    },
    emits: [
        "validated",
        "update:gearA",
        "update:gearB",
        "update:gearC",
        "update:gearD",
        "update:pitch",
        "update:type",
    ],
    components: { NumericEditor }
}
</script>