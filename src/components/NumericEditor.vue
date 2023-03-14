<template>
    <div class="field">
      <label v-if="label?.length > 0" class="label" :placeholder="placeholder">{{ label }}</label>
      <div class="control">
        <input class="input" :class="{'is-danger': !isValid}" type="text" v-model="strVal" :disabled="disabled"  pattern="[0-9]*" inputmode="numeric"
        @input="updateStrVal(($event.target as any).value)" 
        @keydown="handleKey($event)"
        @wheel="handleMouse($event)"/>
      </div>
      <div v-if="tip?.length ?? 0 > 0" class="help is-info">
        {{ tip }}
      </div>
      <ul v-if="!isValid" class="help is-danger">
        <li v-for="item of allMessages" :key="item"> {{ item }} </li>
      </ul>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';

export default {
    data(props) {
        
        let roundingMultiplier = 1;
        let roundingSteps = 1;
        for (let i = 0; i < props.decimals; i++){
            roundingMultiplier *= 10;
            roundingSteps /= 10;
        }

        return {
            roundingMultiplier,
            roundingStep: roundingSteps,
            errorMessage: "",
            strVal: this.displayValue(props.modelValue),
            i18n: GlobalConfig.i18n
        }
    },
    emits: [
        "validated",
        "enter",
        "update:modelValue"
    ],
    props: {
        modelValue: {type: Number, default: 0},
        decimals: {type: Number, default: 2},
        required: {type: Boolean, default: false},
        label: {type: String, default: ""},
        placeholder: {type: String, default: ""},
        errorMessages: {type: Array<string>, default: []},
        minValue: {type: Number, default: Number.NEGATIVE_INFINITY},
        maxValue: {type: Number, default: Number.POSITIVE_INFINITY},
        useMouse: {type: Boolean, default: true},
        disabled: {type: Boolean, default: false},
        tip: {type: String, deafult: ""}
    },
    methods: {
        numValue(str: string) : number{
            if (str === "")
                return NaN;
            return Math.round(Number(str) * this.roundingMultiplier) * this.roundingStep;
        },
        displayValue(num: number): string{
            if(Number.isNaN(num))
                return "";
            let result = num.toFixed(this.decimals);
            let i = result.indexOf('.');
            if (i == -1)
                i = result.indexOf(',');
            if (i!= -1)
            {
                while(result.substring(result.length-1, result.length) === '0'){
                    result = result.substring(0, result.length-1)
                }
                if(result.substring(result.length-1, result.length) === ',' || result.substring(result.length-1, result.length) === '.'){
                    result = result.substring(0, result.length-1)
                }
            }
            return result;
        },
        updateStrVal(val: string, forced: boolean = false){
            if(this.disabled && !forced)
                return;
            this.strVal = val;
            const nval = this.numValue(val);
            this.validate(val, nval); 
            if((nval != this.modelValue || 
                (!Number.isNaN(nval) && Number.isNaN(this.modelValue)) || 
                (Number.isNaN(nval) && !Number.isNaN(this.modelValue))) && 
                this.errorMessage == "")
                this.$emit("update:modelValue", nval);
            
        },
        validate(val: string, nval: number){
            if (val != this.displayValue(nval))
                this.errorMessage = this.i18n.numericInvalid;
            else if (val === "" && this.required)
                this.errorMessage = this.i18n.numericRequired;
            else if (!Number.isNaN(nval) && (nval < this.minValue || nval > this.maxValue)){
                var s = "";
                if(this.minValue != Number.NEGATIVE_INFINITY && this.maxValue != Number.POSITIVE_INFINITY)
                    s = this.i18n.numericShouldBeBetween(this.minValue, this.maxValue);
                else if(this.minValue != Number.NEGATIVE_INFINITY)
                    s = this.i18n.numericShouldBeGreaterThan(this.minValue);
                else if(this.maxValue != Number.POSITIVE_INFINITY)
                    s =  this.i18n.numericShouldBeLessThan(this.maxValue);
                this.errorMessage = s;
            } else {
                this.errorMessage = "";
            }
            this.$emit("validated", this.errorMessage == "");
        },
        handleKey(event: KeyboardEvent){
            const val = (event.target as any).value;
            if (event.code == 'Enter' || event.code == 'Return')
                this.$emit("enter");
            let i = 0;
            if (event.code == 'ArrowUp')
                i = 1;
            if (event.code == 'ArrowDown')
                i = -1;

            if(i != 0) {
                event.preventDefault();
                this.updateStrVal(this.displayValue(this.numValue(val) + i*this.roundingStep));
            }
        },
        handleMouse(event: WheelEvent){
            if (!this.useMouse)
                return;
            const val = (event.target as any).value;
            let i = 0;
            console.log(event.deltaY);
            if (event.deltaY > 0)
                i = -1;
            if (event.deltaY < 0)
                i = 1;

            if(i != 0) {
                event.preventDefault();
                this.updateStrVal(this.displayValue(this.numValue(val) + i*this.roundingStep));
            }
        }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    watch: {
        decimals(n: number) {
            this.roundingMultiplier = this.roundingStep = 1;
            for (let i = 0; i < n; i++){
                this.roundingMultiplier *= 10;
                this.roundingStep /= 10;
            }
        },
        modelValue(n: number) {
            this.updateStrVal(this.displayValue(n), true);
        }
    },
    computed: {
        isValid() {
            return this.allMessages.length == 0;
        },
        allMessages() {
            let a: string[] = [];
            for(let i in this.errorMessages){
                a.push(this.errorMessages[i]);
            }
            if(this.errorMessage.length > 0)
                a.push(this.errorMessage);
            return a;
        }
    }
}
</script>