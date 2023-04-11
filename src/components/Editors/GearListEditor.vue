<template>
    <div>
        <div v-if="isEditMode" class="columns">
            <GearEditor class="column is-one-quarter" v-model="newGear" :label="i18n.gearsAddNew" :tip="i18n.gearsAddNewTip" :required="true" 
            v-model:isValid="newGearValid" @enter="addGear()"/>
            <div class="field column is-one-quarter">
                <label class="label">&nbsp;</label>
                <div class="control buttons">
                    <button class="button is-info" :disabled="!newGearValid" @click.prevent="addGear()">+</button>
                </div>
            </div>
        </div>
        
        <div class="field">
        <label class="label">{{ i18n.gearsExistingGears }}</label>
        <div class="control">
            <div class="tags">
                <span class="tag is-link" v-for="(item,idx) in gears" :key="idx">
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
import { Gear, GearModule } from '@/bll/gear';
import GearEditor from './GearEditor.vue';

export default {
    data(props) {
        return {
            newGear: Gear.fromString("M1Z20"),
            newGearValid: true,
            isEditMode: props.modelValue?.length == 0,
            gears: props.modelValue.slice(),
            i18n: GlobalConfig.i18n
        };
    },
    methods: {
        addGear() {
            if(!this.newGearValid)
                return;
            this.gears.push(new Gear(new GearModule(this.newGear!.module.number, this.newGear!.module.type), this.newGear!.teeth));
            this.gears.sort((a,b) => a.toString().localeCompare(b.toString())); 
        },
        removeGear(str: String) {
            let idx = this.gears.findIndex((v) => v.toString() == str);
            this.gears = this.gears.slice(0,idx).concat(this.gears.slice(idx+1)).sort();
        },
        saveGears(){
            this.$emit("update:modelValue", this.gears);
            this.isEditMode = false;
        },
        editGears() {
            this.isEditMode = true;
        }
    },
    props: {
        modelValue: {
            type: Array<Gear>,
            default: []
        },
        maxSize: { type: Number }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
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