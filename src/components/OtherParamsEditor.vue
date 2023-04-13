<template>
    <div>
        <div v-if="isEditMode">
            <NumericEditor v-model="distanceValue" :label="i18n.otherAxleDistance" :tip="i18n.otherAxleDistanceTip" :decimals="0" :min-value="50" :max-value="200" :required="true" 
            v-model:isValid="isDistanceValid" @enter="save()"/>
            <NumericEditor v-model="maxSizeValue" :label="i18n.otherMaxGearSize" :tip="i18n.otherMaxGearSizeTip" :decimals="0" :min-value="50" :max-value="200" :required="true" 
            v-model:isValid="isMaxSizeValid" @enter="save()"/>
        </div>
        
        
       <div v-else>
            <div class="field">
                <label class="label">{{ i18n.otherAxleDistance }}</label>
                <div class="control">
                    <div class="tags">
                        <span class="tag is-link">
                            {{ distance.toString() }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="field">
                <label class="label">{{ i18n.otherMaxGearSize }}</label>
                <div class="control">
                    <div class="tags">
                        <span class="tag is-link">
                            {{ maxSize.toString() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
&nbsp;
        <div class="field">
            <div class="control buttons">
                <button v-if="isEditMode" class="button is-success" @click.prevent="save()" :disabled="!isMaxSizeValid || !isDistanceValid">{{ i18n.genericSave }}</button>
                <button v-if="!isEditMode" class="button is-danger" @click.prevent="edit()">{{ i18n.genericEdit }}</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';
import NumericEditor from './Editors/NumericEditor.vue';

export default {
    data(props) {
        return {
            distanceValue: props.distance,
            maxSizeValue: props.maxSize,

            isDistanceValid: true,
            isMaxSizeValid: true,
            isEditMode: props.distance == null || props.maxSize == null,
            i18n: GlobalConfig.i18n
        };
    },
    methods: {
        save() {
            if(!this.isDistanceValid || !this.isMaxSizeValid)
                return;
            this.$emit("update:distance", this.distanceValue);
            this.$emit("update:maxSize", this.maxSizeValue);
            this.$emit("saved");
            this.isEditMode = false;
        },
        edit(){
            this.isEditMode = true;
            this.distanceValue = this.distance;
            this.maxSizeValue = this.maxSize;
        }
    },
    props: {
        distance: {
            type: Number,
            default: 85
        },
        maxSize: {
            type: Number,
            default: 130
        }
    },
    emits: ["update:distance", "update:maxSize", "saved" ],
    watch: {
        modelValue() {
            if(this.isEditMode)
                console.warn("model changed while editing");
        }
    },
    components: { NumericEditor }
}
</script>