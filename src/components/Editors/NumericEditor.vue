<template>
    <div class="field">
      <label v-if="label?.length > 0" class="label" :placeholder="placeholder">{{ label }}</label>
      <NumericField 
        v-model="_modelValue" 
        v-model:error-message="validationMessage" 
        v-model:is-valid="_isValid"
        :max-value="maxValue"
        :min-value="minValue"
        :decimals="decimals"
        :required="required"
        :use-mouse="useMouse"
        :use-touch="useTouch"
        :disabled="disabled"
        :placeholder="placeholder"
        @enter="$emit('enter')" />
      <div v-if="tip?.length ?? 0 > 0" class="help is-info">
        {{ tip }}
      </div>
      <ul v-if="!isValid" class="help is-danger">
        <li v-for="item of allMessages" :key="item"> {{ item }} </li>
      </ul>
    </div>
</template>
<script lang="ts">
import NumericField from '../InputFields/NumericField.vue';

export default {
    data() {
        return {
            validationMessage: "",
        };
    },
    emits: [
        "update:isValid",
        "enter",
        "update:modelValue"
    ],
    props: {
        modelValue: { type: Number, default: 0 },
        decimals: { type: Number, default: 2 },
        required: { type: Boolean, default: false },
        label: { type: String, default: "" },
        placeholder: { type: String, default: "" },
        errorMessages: { type: Array<string>, default: [] },
        minValue: { type: Number, default: Number.NEGATIVE_INFINITY },
        maxValue: { type: Number, default: Number.POSITIVE_INFINITY },
        useMouse: { type: Boolean, default: true },
        useTouch: { type: Boolean, default: true },
        disabled: { type: Boolean, default: false },
        tip: { type: String, deafult: "" },
        isValid: { type: Boolean, deafult: true },
    },
    methods: {
    },
    computed: {
        _modelValue: {
            get(): number { return this.modelValue; },
            set(v: number) { this.$emit("update:modelValue", v); }
        },
        _isValid: {
            get(): boolean { return this.isValid; },
            set(v: boolean) { this.$emit("update:isValid", v); }
        },
        allMessages() {
            let a: string[] = [];
            for (let i in this.errorMessages) {
                a.push(this.errorMessages[i]);
            }
            if (this.validationMessage.length > 0)
                a.push(this.validationMessage);
            return a;
        }
    },
    components: { NumericField }
}
</script>