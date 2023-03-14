<template>
    <g :transform="'translate('+cx+' '+cy+')'">
        <path :d="path" />
        
        <g v-if="sizeText && size >= 30" :transform="'rotate(' + textRotation + ')'" >
        <path :id="'curve'+id" stroke="none" fill="none" :d="'M '+(-(r - 3))+' 0 A '+(r - 3)+' '+(r - 3)+' 0 0 0 '+(r - 3)+' 0'" />
        <text width="100" style="font-size: 8px; letter-spacing: 2px;" stroke="none" fill="#888">
            <textPath alignment-baseline="baseline" :xlink:href="'#curve'+id">
            M1 Z{{ size }}
            </textPath>
        </text>
        </g>
    </g>
</template>
<script lang="ts">
import { Vector } from '@/bll/math';

export default {
    data() {
        return {id: Math.round(Math.random()*10000)}
    },
    props: {
        cx: {type: Number, default: 0},
        cy: {type: Number, default: 0},
        size: {type: Number, default: 20},
        sizeText: {type: Boolean, default: false},
        textRotation: {type: Number, default: 0}
    },
    methods: {
        getPoint(cog: number, point: number, angleStep: number, rootR: number, outsideR: number){

            let angle = cog*angleStep;
            switch (point) {
                case 0:
                    break;
                case 1:
                    angle += angleStep/3;
                    break;
                case 2:
                    angle += angleStep/2;
                    break;
                case 3:
                    angle += angleStep*5/6;
                    break;
            }
            return Vector.fromAngle(angle, point ==2 || point == 3 ? outsideR : rootR )
        }
    },
    computed: {
        r() { return this.size / 2},
        path(){
            const rootR = (this.size / 2) - 1.5;
            const outerR = (this.size / 2) + 1;
            const angleStep = Math.PI*2/this.size;

            var start = this.getPoint(-1, 3, angleStep,rootR, outerR);
            let p = "M "+ start.x +" "+start.y+" ";

            for(let i = 0; i< this.size; i++){
                for(let j = 0; j< 4; j++)
                {
                    var v = this.getPoint(i,j,angleStep,rootR,outerR);
                    p+= "L "+v.x+" "+v.y+" ";
                }
            }

            return p;
        }
    }
}
</script>