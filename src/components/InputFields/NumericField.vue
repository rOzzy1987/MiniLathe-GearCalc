<template>
    <div class="control has-icons-right">
        <input ref="inputField" class="input" :class="{'is-danger': !isValid}" type="text" 
            :value="strVal" @input="inputUpdated($event)" 
            :disabled="disabled"  pattern="[0-9]*" 
            inputmode="decimal" 
            @keydown="handleKey($event)"
            @wheel="handleMouse($event)" 
            @touchstart="handleTouch" @touchmove="handleTouch" @touchend="handleTouch"/>
        <span ref="updown" v-if="touchSupported" class="icon is-small is-right">
            <i class="fas fa-up-down"></i>
        </span>
    </div>
</template>
<script lang="ts">
import GlobalConfig from '@/bll/globalConfig';

export default {
    data(props) {
        return {
            strValField: this.displayValue(props.modelValue),
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
        "update:modelValue",
        "update:errorMessage",
    ],
    mounted() {
      this.validate();
    },
    props: {
        modelValue: {type: Number, default: 0},
        decimals: {type: Number, default: 2},
        required: {type: Boolean, default: false},
        placeholder: {type: String, default: ""},
        minValue: {type: Number, default: Number.NEGATIVE_INFINITY},
        maxValue: {type: Number, default: Number.POSITIVE_INFINITY},
        errorMessage: {type: String, default: ""},
        useMouse: {type: Boolean, default: true},
        useTouch: {type: Boolean, default: true},
        disabled: {type: Boolean, default: false},
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
                result = result.substring(0, i + this.decimals + 1);
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
                this._errorMessage = this.i18n.numericInvalid;
            else if (val === "" && this.required)
                this._errorMessage = this.i18n.numericRequired;
            else if (!Number.isNaN(nval) && (nval < this.minValue || nval > this.maxValue)){
                if(this.minValue != Number.NEGATIVE_INFINITY && this.maxValue != Number.POSITIVE_INFINITY)
                    this._errorMessage = this.i18n.numericShouldBeBetween(this.minValue, this.maxValue);
                else if(this.minValue != Number.NEGATIVE_INFINITY)
                    this._errorMessage = this.i18n.numericShouldBeGreaterThan(this.minValue);
                else if(this.maxValue != Number.POSITIVE_INFINITY)
                    this._errorMessage =  this.i18n.numericShouldBeLessThan(this.maxValue);
            } else {
                this._errorMessage = "";
            }
            const isValid = this._errorMessage == "";
            if (this.isValid != isValid)
                this.$emit("update:isValid", isValid);
            return isValid;
        },
        inputUpdated(event: Event){
            this.strVal = (event.target as HTMLInputElement).value;
        },
        setValue(val: number | null) {
            this.strVal = val == null || Number.isNaN(val) 
                ? "" 
                : this.displayValue(val)
        },
        updateModelValue(isValid: boolean | null = null){
            let val = this.numValue(this.strVal);
            isValid = isValid ?? this.isValid;

            if (!isValid)
                return;

            if (this.inTouch)
                return;

            if (this.modelValue != val || 
                (Number.isNaN(this.modelValue) && !Number.isNaN(val)) ||
                (!Number.isNaN(this.modelValue) && Number.isNaN(val)))
                this.$emit("update:modelValue", val ?? NaN);
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
            if (event.deltaY > 0)
                i = -1;
            if (event.deltaY < 0)
                i = 1;

            if(i != 0) {
                event.preventDefault();
                this.setValue(this.numValue(val) + i*this.roundingStep);
            }
        },
        handleTouch(event: TouchEvent) {
            if (!this.useTouch || !this.touchSupported)
                return;

            const touch = event.touches[0];
            const icon = this.iconElement.getBoundingClientRect();
            const inBounds = event.type == "touchend" ? false : 
                touch.clientX > icon.x &&touch.clientX < icon.x + icon.width &&
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
                this.touchY = newY;
                this.setValue(this.numValue(val) + i * this.roundingStep);
            } else if (event.type == "touchend") {
                this.inTouch = false;
                this.updateModelValue();
            }
        }
    },
    watch: {
        modelValue(v: number){
            this.strVal = this.displayValue(v); 
        }
    },
    computed: {
        _errorMessage: {
            get(): string | undefined { return this.errorMessage; },
            set(v: string | undefined) { this.$emit("update:errorMessage", v); }
        },
        inputElement(): HTMLInputElement {
            return this.$refs.inputField as HTMLInputElement;
        },
        iconElement(): HTMLElement {
            return this.$refs.updown as HTMLElement;
        },
        roundingMultiplier() {
            let a = 1;
            for(let i = 0; i < this.decimals; i++)
                a*=10;
            return a;
        },
        roundingStep() {
            let a = 1;
            for(let i = 0; i < this.decimals; i++)
                a/=10;
            return a;
        },
        strVal: {
            get(): string { return this.strValField; },
            set(v: string) { 
                this.strValField = v; 
                let isValid = this.validate();
                this.updateModelValue(isValid);
            }
        }
    }
}
</script>