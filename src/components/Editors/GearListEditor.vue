<template>
    <div>
        <div v-if="isEditMode">
            <GearEditor class="column is-one-quarter" v-model="newGear" :label="i18n.gearsAddNew" :tip="i18n.gearsAddNewTip" :required="true" 
                v-model:isValid="newGearValid" @enter="addGear()" :forceModuleEditor="true"/>
            <div class="control buttons">
                <button class="button is-info has-icon" :disabled="!newGearValid" @click.prevent="addGear()"><i class="fas fa-plus"></i></button>
            </div>
            &nbsp;
        </div>
        
        <div class="field">
        <label class="label">{{ i18n.gearsExistingGears }}</label>
        <div class="control">
            <div class="tags">
                <span class="tag" :style="{'background-color': getBackgroundColor(item), 'color': getTextColor(item)}" v-for="(item,idx) in gears" :key="idx">
                    {{ item.toString() }}
                    <button v-if="isEditMode" class="delete is-small" @click.prevent="removeGear(item.toString())"></button>
                </span>
            </div>
        </div>
        </div>
        
        <div class="field">
            <div class="control buttons">
                <button v-if="isEditMode" class="button is-success" @click.prevent="saveGears()">{{ i18n.genericSave }}</button>
                <button v-if="!isEditMode" class="button is-danger" @click.prevent="editGears()">{{ i18n.genericEdit }}</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';
import { Gear, GearModule, Gears, ModuleType } from '@/bll/gear';
import GearEditor from './GearEditor.vue';
import { Color } from '@/bll/color'

export default {
    data(props) {
        return {
            newGear: Gear.fromString("M1Z20"),
            newGearValid: true,
            isEditMode: props.modelValue?.length == 0,
            gears: props.modelValue.slice(),
            i18n: GlobalConfig.i18n,
            moduleType: ModuleType
        };
    },
    methods: {
        addGear() {
            if(!this.newGearValid)
                return;
            this.gears.push(new Gear(new GearModule(this.newGear!.module.number, this.newGear!.module.type), this.newGear!.teeth));
            this.gears.sort((a,b) => Gears.compare(a,b)); 
        },
        removeGear(str: String) {
            let idx = this.gears.findIndex((v) => v.toString() == str);
            this.gears = this.gears.slice(0,idx).concat(this.gears.slice(idx+1));
        },
        saveGears(){
            this.$emit("update:modelValue", this.gears);
            if(this.gears.length > 0)
                this.$emit("saved");
            this.isEditMode = false;
        },
        editGears() {
            this.isEditMode = true;
        },
        getBackgroundColor(item: Gear) {
            return Color.fromHsl(this.getHue(item), .5, .6).toHex();
        },
        getTextColor(item:Gear){
            const h = this.getHue(item);
            const b = h > .1 && h < .2 ? 0 : 255;
            return new Color(b, b, b).toHex();
        },
        getHue(item: Gear){
            let h = ((item.teeth * item.module.toMetric().number) - 20) / 120;
            h = (h + 0.4) % 1;
            return Math.max(0, Math.min(1, 1-h));
        }
    },
    props: {
        modelValue: {
            type: Array<Gear>,
            default: []
        },
        maxSize: { type: Number }
    },
    emits: ["update:modelValue", "saved"],
    watch: {
        modelValue(n) {
            if(this.isEditMode)
                console.warn("model changed while editing");
            this.gears = n.slice();
        }
    },
    components: { GearEditor }
}
</script>