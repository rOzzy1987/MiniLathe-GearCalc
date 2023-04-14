<template>
    <div class="box">
        <div class="block">{{ i18n.gfpTitle }}</div>
      <div class="columns">
        <div class="column">
            <PitchEditor v-model="dp" v-model:isValid="isPitchValid"/>
            <PitchSetupTable 
                v-model="combos" 
                v-model:orderBy="orderBy" 
                v-model:orderAscending="orderAscending" 
                v-model:selectedItem="selectedSetup" 
                :filter="filter"
                :isExportEnabled="true"
                :isPrintEnabled="true"
                :row-commands="rowCommands"/>
        </div>
        <div class="column no-print">
            <GeartrainImg 
                :gear-a="selectedSetup?.gearA ?? undefined" 
                :gear-b="selectedSetup?.gearB ?? undefined" 
                :gear-c="selectedSetup?.gearC ?? undefined" 
                :gear-d="selectedSetup?.gearD ?? undefined"
                :min-teeth="config.minTeeth"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import { PitchSetup } from '@/bll/pitchSetup';
import GeartrainImg from '@/components/Graphics/GeartrainImg.vue';
import PitchEditor from '@/components/Editors/PitchEditor.vue';
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';
import { Gear } from '@/bll/gear';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(Gear.fromString("M1Z20"), undefined, undefined, Gear.fromString("M1Z80"), new Pitch(1, PitchType.Metric)),
            orderBy: "pm",
            orderAscending: true,
            threshold: 1.003,
            isPitchValid: true,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            config: GlobalConfig.config,
            combos: GlobalConfig.combos,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        desiredPitch: { type: Pitch, default: new Pitch(1, PitchType.Metric) }
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    var p = t.dp.type == v.pitch.type
                        ? v.pitch : v.pitch.convert();
                    return p.value > t.dp.value / t.threshold 
                        && p.value < t.dp.value * t.threshold 
                }
            }
        },
        dp: {
            get() { return this.desiredPitch; },
            set(v: Pitch) { this.$emit("update:desiredPitch", v); }
        },
    },
    components: { GeartrainImg, PitchSetupTable, PitchEditor }
}
</script>