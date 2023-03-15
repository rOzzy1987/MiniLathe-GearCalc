<template>
    <div class="field">
      <label v-if="label?.length > 0" class="label" :placeholder="placeholder">{{ label }}</label>
      <div class="control has-icons-right">
        <input :id="'input'+id" class="input" :class="{'is-danger': !isValid}" type="text" v-model="strVal" :disabled="disabled"  pattern="[0-9]*" inputmode="decimal" 
        @keydown="handleKey($event)"
        @wheel="handleMouse($event)" @touchstart="handleScroll" @touchmove="handleScroll" @touchend="handleScroll"/>
        <span :id="'updown'+id" v-if="touchSupported" class="icon is-small is-right">
            <i class="fas fa-up-down"></i>
        </span>
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
            id: Math.round(Math.random() * 1000),
            roundingMultiplier,
            roundingStep: roundingSteps,
            validationMessage: "",
            strVal: this.displayValue(props.modelValue),
            touchY: 0,
            touchSensitivity: 10,
            inTouch: false,
            touchSupported: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || ((navigator as any).msMaxTouchPoints > 0)),
            i18n: GlobalConfig.i18n,
        }
    },
    emits: [
        "update:isValid",
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
        useTouch: {type: Boolean, default: true},
        disabled: {type: Boolean, default: false},
        tip: {type: String, deafult: ""},
        isValid: {type: Boolean, deafult: true},
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
        
        validate(): boolean {
            const val = this.strVal;
            const nval = this.numValue(val);
            const reconv = this.displayValue(nval);
            if (val != reconv)
                this.validationMessage = this.i18n.numericInvalid;
            else if (val === "" && this.required)
                this.validationMessage = this.i18n.numericRequired;
            else if (!Number.isNaN(nval) && (nval < this.minValue || nval > this.maxValue)){
                if(this.minValue != Number.NEGATIVE_INFINITY && this.maxValue != Number.POSITIVE_INFINITY)
                    this.validationMessage = this.i18n.numericShouldBeBetween(this.minValue, this.maxValue);
                else if(this.minValue != Number.NEGATIVE_INFINITY)
                    this.validationMessage = this.i18n.numericShouldBeGreaterThan(this.minValue);
                else if(this.maxValue != Number.POSITIVE_INFINITY)
                    this.validationMessage =  this.i18n.numericShouldBeLessThan(this.maxValue);
            } else {
                this.validationMessage = "";
            }
            const isValid = this.validationMessage == "";
            if (this.isValid != isValid)
                this.$emit("update:isValid", isValid);
            return isValid;
        },

        setValue(val: number | null) {
            this.strVal = val == null || Number.isNaN(val) 
                ? "" 
                : this.displayValue(val)
        },

        handleKey(event: KeyboardEvent){
            
            const val = this.strVal;
            if (event.code == 'Enter' || event.code == 'Return')
                this.$emit("enter");
            let i = 0;
            if (event.code == 'ArrowUp')
                i = 1;
            if (event.code == 'ArrowDown')
                i = -1;
            if(i != 0) {
                event.preventDefault();
                this.setValue(this.numValue(val) + i*this.roundingStep);
            }


            // Support for cultures where they use comma as decimal symbol
            // decimal keyboard on phones sometimes don't include point buttons in thee cases
            if (event.code == 'Comma'){
                event.preventDefault();
                const ss = this.inputElement.selectionStart ?? val.length;
                const se = this.inputElement.selectionEnd ?? ss;

                const sub1 = val.substring(0, ss);
                const sub2 = val.substring(se);

                this.strVal = sub1 + '.' + sub2;
            }

        },
        handleMouse(event: WheelEvent){
            if (!this.useMouse)
                return;
            const val = this.strVal;
            let i = 0;
            console.log(event)
            if (event.deltaY > 0)
                i = -1;
            if (event.deltaY < 0)
                i = 1;

            if(i != 0) {
                event.preventDefault();
                this.setValue(this.numValue(val) + i*this.roundingStep);
            }
        },
        handleScroll(event: TouchEvent) {
            if (!this.useTouch || !this.touchSupported)
                return;

            const touch = event.touches[0];
            const icon = this.iconElement.getBoundingClientRect();

            const inBounds = touch.clientX > icon.x &&touch.clientX < icon.x + icon.width &&
                touch.clientY > icon.y && touch.clientY < icon.y + icon.height;
            if (!inBounds && !this.inTouch)
                return;
            

            if(event.type == "touchstart") {
                this.touchY = touch.clientY;
                this.inTouch = true;
            } else if (event.type == "touchmove") {
                event.preventDefault();
                const newY = touch.clientY
                const i = Math.round((this.touchY - newY) / this.touchSensitivity);

                if (i == 0)
                    return;
                    
                const val = this.strVal;
                this.setValue(this.numValue(val) + i*this.roundingStep);
                this.touchY = newY;
            } else if (event.type == "touchend") {
                this.inTouch = false;
            }
        }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
      this.validate();
    },
    watch: {
        decimals(n: number) {
            this.roundingMultiplier = this.roundingStep = 1;
            for (let i = 0; i < n; i++){
                this.roundingMultiplier *= 10;
                this.roundingStep /= 10;
            }
        },
        strVal() {
            const isValid = this.validate();
            let val = this.numValue(this.strVal);
            if (!isValid)
                return;
            if (this.inTouch)
                return;
            if (this.modelValue != val || 
                (Number.isNaN(this.modelValue) && !Number.isNaN(val)) ||
                (!Number.isNaN(this.modelValue) && Number.isNaN(val)))
                this.$emit("update:modelValue", val ?? NaN);
        },
        modelValue(n: number) {
            this.setValue(n);
        }
    },
    computed: {
        allMessages() {
            let a: string[] = [];
            for(let i in this.errorMessages){
                a.push(this.errorMessages[i]);
            }
            if(this.validationMessage.length > 0)
                a.push(this.validationMessage);
            return a;
        },
        inputElement(): HTMLInputElement {
            return document.getElementById('input'+ this.id) as HTMLInputElement;
        },
        iconElement(): HTMLElement {
            return document.getElementById('updown'+ this.id)!;
        }
    }
}
</script>