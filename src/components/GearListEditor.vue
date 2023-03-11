<template>
    <div>
        <div v-if="isEditMode" class="columns">
            <NumericEditor class="column is-one-quarter" v-model="newGear" label="Add new gear" :decimals="0" :min-value="18" :max-value="120" :required="true" 
            @validated="newGearValid = $event" @enter="addGear()"/>
            <div class="field column is-one-quarter">
                <label class="label">&nbsp;</label>
                <div class="control buttons">
                    <button class="button is-info" :disabled="!newGearValid" @click.prevent="addGear()">+</button>
                </div>
            </div>
        </div>
        
        <div class="field">
        <label class="label">Existing gears</label>
        <div class="control">
            <div class="tags">
                <span class="tag is-link" v-for="(item,idx) in gears" :key="idx">
                    {{ item }}
                    <button v-if="isEditMode" class="delete is-small" @click.prevent="removeGear(item)"></button>
                </span>
            </div>
        </div>
        </div>
        
        <div class="field">
            <div class="control buttons">
                <button v-if="isEditMode" class="button is-success" @click.prevent="saveGears()">Save gears</button>
                <button v-if="!isEditMode" class="button is-danger" @click.prevent="editGears()">Edit gears</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import NumericEditor from './NumericEditor.vue';

export default {
    data(props) {
        return {
            newGear: 20,
            newGearValid: true,
            isEditMode: props.modelValue?.length == 0,
            gears: props.modelValue.slice()
        };
    },
    methods: {
        addGear() {
            if(!this.newGearValid)
                return;
            this.gears = this.gears.concat([this.newGear]).sort(); 
        },
        removeGear(num: number) {
            let idx = this.gears.findIndex((v) => v == num);
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
            type: Array<number>,
            default: []
        }
    },
    watch: {
        modelValue(n) {
            if(this.isEditMode)
                console.warn("model changed while editing");
            this.gears = n.slice();
        }
    },
    components: { NumericEditor }
}
</script>