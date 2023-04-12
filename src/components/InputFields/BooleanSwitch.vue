<template>
  <div class="switch-container input" :style="{'width': size + 2 + 'px'}" @click="_modelValue = !_modelValue">
    <div class="caret" :style="{'left': modelValue ? 0 : '-'+(size - 30) + 'px', width: size*2+'px'}">
        <div class="value value1" :style="{'width': (size - 15) +'px'}">{{ label1 }}</div>
        <div class="knob-container"><div class="knob"><div class="knob-inset"></div></div></div>
        <div class="value value2" :style="{'width': (size - 15) +'px'}">{{ label2 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    data(props) {
        return {
            modelValueField: props.modelValue
        }
    },
    props: {
        modelValue: { type: Boolean, default: true },
        label1: { type: String, default: "On" },
        label2: { type: String, default: "Off" },
        size: { type: Number, default: 100 }
    },
    computed: {
        _modelValue: {
            get(): boolean { return this.modelValueField; },
            set(v: boolean) { this.modelValueField = v; this.$emit("update:modelValue", v); }
        }
    },
    watch: {
        modelValue() {
            this.modelValueField = this.modelValue;
        },
    }
}
</script>

<style lang="scss" scoped>
.switch-container{
    overflow: hidden;
    height: 32px;
    border: 1px solid #AAA;
    border-radius: 8px;
    transition: left .5s;
    position: relative;
    margin: 3px;

    div {
        float: left;
    }

    .caret {
        position: absolute;
        transition: left .5s;
    }
    .value{
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        padding: 9px 3px;
        box-sizing: border-box;
        box-shadow: inset 3px 3px 10px rgba(0,0,0,0.3);
        overflow: hidden;
    }
    .value1 {
        background: #ACA;
        color: #484;
    }
    .value2 {
        background: #CAA;
        color: #844;
        text-align: right;
    }
    .knob-container {
        width: 0px;
        overflow: visible;
    }
    .knob {
        width: 32px;
        height: 32px;
        position: relative;
        left: -16px;
        top: -1px;
        border: 1px solid #AAA;
        border-radius: 8px;
        background: #FFF;
        box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
    }
    .knob-inset{
        box-shadow: inset -8px -8px 10px rgba(0,0,0,0.3);
        width: 100%;
        height: 100%;
        border-radius: 7px;
    }
}

</style>