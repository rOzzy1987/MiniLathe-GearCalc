<template>
    <div>
        <PitchEditor v-model:pitch="pv" v-model:pitchType="pt" @validated="isPitchValid = $event" />

        <GearCombinationEditor 
            v-model:gearA="ga"
            v-model:gearB="gb"
            v-model:gearC="gc"
            v-model:gearD="gd"
            @validated="isGearsValid = $event" />
    </div>
</template>
<script lang="ts">
import { PitchType } from '@/bll/pitch';
import GearCombinationEditor from './GearCombinationEditor.vue';
import PitchEditor from './PitchEditor.vue';

export default {
    setup() {
        return {
            isPitchValid: true,
            isGearsValid: true,
        }
    },
    props: {
        gearA: {type: Number, default: 30},
        gearB: {type: Number, default: NaN},
        gearC: {type: Number, default: NaN},
        gearD: {type: Number, default: 60},
        pitch: {type: Number, default: 1.5},
        type: {type: Number, default: PitchType.Metric},
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
        pt: {
            get() { return this.type; },
            set(v: number) { this.$emit("update:type", v); }
        },
        isValid() {
            return this.isPitchValid 
                && this.isGearsValid;
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
    components: { PitchEditor, GearCombinationEditor }
}
</script>