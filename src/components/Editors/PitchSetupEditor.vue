<template>
    <div>
        <PitchEditor v-model="pv" v-model:isValid="isPitchValid" />

        <GearCombinationEditor 
            v-model:gearA="ga"
            v-model:gearB="gb"
            v-model:gearC="gc"
            v-model:gearD="gd"
            v-model:isValid="isGearsValid" />
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import GearCombinationEditor from './GearCombinationEditor.vue';
import PitchEditor from './PitchEditor.vue';
import { Gear } from '@/bll/gear';

export default {
    data() {
        return {
            isPitchValid: true,
            isGearsValid: true,
        }
    },
    props: {
        gearA: {type: Gear},
        gearB: {type: Gear},
        gearC: {type: Gear},
        gearD: {type: Gear},
        pitch: {type: Pitch, default: new Pitch(1.5, PitchType.Metric)},
        isValid: {type: Boolean, default: true}
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
        pv: {
            get() { return this.pitch; },
            set(v: number) { this.$emit("update:pitch", v); }
        },
    },
    methods: {
        validate() {
            const isValid =  this.isPitchValid 
                && this.isGearsValid;
            if(this.isValid != isValid)
                this.$emit("update:isValid", isValid);
        }

    },
    mounted(){
        this.validate();
    },
    watch: {
        isPitchValid() { this.validate(); },
        isGearsValid() { this.validate(); }
    },
    emits: [
        "update:isValid",
        "update:gearA",
        "update:gearB",
        "update:gearC",
        "update:gearD",
        "update:pitch",
    ],
    components: { PitchEditor, GearCombinationEditor }
}
</script>