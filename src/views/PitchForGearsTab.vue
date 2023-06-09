<template>
    <div class="box">
        <div class="block">
            <p>{{ i18n.pfgTitle }}</p>
            <p class="help">{{ i18n.pfgSearchTip }}</p>
        </div>
      <div class="columns">
        <div class="column">
            <GearCombinationEditor v-model:gearA="ga" v-model:gearB="gb" v-model:gearC="gc" v-model:gearD="gd" v-model:isComboValid="isGearComboValid" :checkRequired="false" :hideModuleEditors="true" :defaultModule="defaultModule"/>
            <div class="block" >
                <p>{{ i18n.pfgCalculated }}</p>
                <PitchSetupTable :modelValue="exactMatch" v-model:selectedItem="selectedSetup" :isSortable="false" :hide-modules="true"/>
            </div>

            <div class="block" >
                <p>{{ i18n.pfgSimilar }}</p>
                <PitchSetupTable :modelValue="similarMatches" v-model:orderBy="orderBy" v-model:orderAscending="orderAscending" v-model:selectedItem="selectedSetup" 
                :isExportEnabled="true" :isPrintEnabled="true" :row-commands="rowCommands"/>
            </div>

            <div class="block" >
                <p>{{i18n.pfgPartial}}</p>
                <p class="help">{{i18n.pfgPartialTip}}</p>
                <PitchSetupTable v-model="combos" v-model:orderBy="orderBy" v-model:orderAscending="orderAscending" v-model:selectedItem="selectedSetup" 
                :filter="filter" :isExportEnabled="true" :isPrintEnabled="true" :itemsPerPage="20" :row-commands="rowCommands" :is-items-per-page-editable="true"/>
            </div>
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
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';
import CombinationFinder from '@/bll/combinationFinder';
import { Gear, GearModule } from '@/bll/gear';
import GearCombinationEditor from '@/components/Editors/GearCombinationEditor.vue';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(Gear.fromString("M1Z20"), undefined, undefined, Gear.fromString("M1Z80"), new Pitch(1, PitchType.Metric)),
            orderBy: "pm",
            orderAscending: true,
            isGearComboValid: true,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            comboFinder: new CombinationFinder(),
            defaultModule: GearModule.fromString("M1"),
            config: GlobalConfig.config,
            combos: GlobalConfig.combos,
            i18n: GlobalConfig.i18n,
        }
    },
    props: {
        gearA: {type: Gear},
        gearB: {type: Gear},
        gearC: {type: Gear},
        gearD: {type: Gear}
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    return (
                        ((t.ga == undefined || t.ga.teeth == v.gearA!.teeth) && (t.gc == undefined || t.gc.teeth == v.gearC!.teeth)) ||
                        ((t.ga == undefined || t.ga.teeth == v.gearC!.teeth) && (t.gc == undefined || t.gc.teeth == v.gearA!.teeth))
                     ) && (
                        ((t.gb == undefined || t.gb.teeth == v.gearB!.teeth) && (t.gd == undefined || t.gd.teeth == v.gearD!.teeth)) ||
                        ((t.gb == undefined || t.gb.teeth == v.gearD!.teeth) && (t.gd == undefined || t.gd.teeth == v.gearB!.teeth))
                     );
                }
            }
        },
        exactMatch(): PitchSetup[] {
            return this.isGearComboValid 
                ? [this.comboFinder.findMetricPitch(this.gearA,this.gearB,this.gearC,this.gearD, this.config.leadscrew)] 
                : [];
        },
        similarMatches(){
            const pitch = this.exactMatch[0]?.pitch;
            const thr = 1.003;
            return this.isGearComboValid
                ? this.combos.filter(p => p.pitch.value > pitch.value / thr && p.pitch.value < pitch.value * thr)
                : [];
        },
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
    },
    components: { GeartrainImg, PitchSetupTable, GearCombinationEditor }
}
</script>
<style scoped>
  td, th {
    text-align: right !important;
  }
</style>