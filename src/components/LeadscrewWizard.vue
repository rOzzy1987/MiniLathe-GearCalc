<template>
  <div>
    <div v-if="selectedPitch == null">
      <div v-if="knowPitch === null">
        <div class="field">
          <label class="label">{{ i18n.leadscrewDoYouKnowPitch }}</label>
          <div class="control buttons">
            <button class="button is-info" @click.prevent="knowPitch = true">
                <span class="icon"><i class="fas fa-check"></i></span>
                <span>{{ i18n.leadscrewKnowPitch }}</span>
              </button>
            <button class="button is-info" @click.prevent="knowPitch = false">
                <span class="icon"><i class="fas fa-question"></i></span>
                <span>{{ i18n.leadscrewDontKnowPitch }}</span>
              </button>
          </div>
        </div>
      </div>

      <div v-if="knowPitch">
        <PitchEditor v-model="pitch" v-model:isValid="directPitchValid" />
        <div class="buttons mt-4">
          <button class="button" @click.prevent="knowPitch = null">
              <span class="icon"><i class="fas fa-caret-left"></i></span>
              <span>{{ i18n.genericBack }}</span>
            </button>
          <button class="button is-primary" @click.prevent="selectedPitch = pitch" :disabled="!directPitchValid">
              <span class="icon"><i class="fas fa-check"></i></span>
              <span>{{ i18n.genericSave }}</span>
            </button>
        </div>
      </div>

      <div v-if="knowPitch === false">
        <div v-if="estimation == null" class="columns">
          <div class="column">
            <div class="message">
              <article class="message-body">
                {{ i18n.leadscrewSampleTip }}
              </article>
            </div>

            <PitchSetupEditor
              v-model:gearA="sampleSetup.gearA"
              v-model:gearB="sampleSetup.gearB"
              v-model:gearC="sampleSetup.gearC"
              v-model:gearD="sampleSetup.gearD"
              v-model:pitch="sampleSetup.pitch"
              v-model:isValid="sampleSetupValid"
            />

            <div class="buttons mt-4">
              <button class="button" @click.prevent="knowPitch = null">
                <span class="icon"><i class="fas fa-caret-left"></i></span>
                <span>{{ i18n.genericBack }}</span>
              </button>
              <button
                class="button is-info"
                @click.prevent="estimate"
                :disabled="!sampleSetupValid"
              >
                <span class="icon"><i class="fas fa-crosshairs"></i></span>
                <span>{{ i18n.leadscrewFind }}</span>
              </button>
            </div>
          </div>

          <div class="column is-one-quarter box">
            <GeartrainImg
              v-model:gear-a="sampleSetup.gearA"
              :gear-b="sampleSetup.gearB"
              :gear-c="sampleSetup.gearC"
              :gear-d="sampleSetup.gearD"
            />
          </div>
        </div>

        <div v-if="estimation != null">
          <div :id="'estimation'+id" class="message is-info">
            <div class="message-body">{{ estimationText }}</div>
          </div>
          <div class="buttons">
            <button
              class="button is-primary"
              :class="{
                'is-light': estimation.result == PitchAssumptionResult.LikelyImperial,
              }"
              @click.prevent="selectedPitch = estimation?.metricAssumption ?? null"
            >
              {{ estimation?.metricAssumption.toString() }}
            </button>
            <button
              class="button is-primary"
              :class="{
                'is-light': estimation.result == PitchAssumptionResult.LikelyMetric,
              }"
              @click.prevent="selectedPitch = estimation?.imperialAssumption ?? null"
            >
              {{ estimation?.imperialAssumption.toString() }}
            </button>
          </div>
          <div class="buttons">
            <button class="button" @click.prevent="estimation = null">
                <span class="icon"><i class="fas fa-caret-left"></i></span>
                <span>{{ i18n.genericBack }}</span>
              </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
        <div class="field">
            <label class="label">{{ i18n.leadscrewSelectedPitch }}</label>
            <div class="control">
                <div class="tags">
                    <span class="tag is-link">
                        {{ selectedPitch.toString() }}
                    </span>
                </div>
            </div>
        </div>

        <div class="field">
            <div class="control buttons">
                <button class="button is-danger" @click.prevent="selectedPitch = null">
                <span class="icon"><i class="fas fa-pen"></i></span>
                <span>{{ i18n.genericEdit }}</span>
              </button>
            </div>
        </div>

    </div>
  </div>
</template>
<script lang="ts">
import GcMath from "@/bll/math";
import { Pitch, PitchType } from "@/bll/pitch";
import PitchEstimator, {
  PitchAssumption,
  PitchAssumptionResult,
} from "@/bll/pitchEstimator";
import { PitchSetup } from "@/bll/pitchSetup";
import GeartrainImg from "./Graphics/GeartrainImg.vue";
import PitchEditor from "./Editors/PitchEditor.vue";
import PitchSetupEditor from "./Editors/PitchSetupEditor.vue";
import GlobalConfig from '@/bll/globalConfig';
import { Gear } from '@/bll/gear';

export default {
  data() {
    return {
      knowPitch: null as boolean | null,
      pitch: new Pitch(16, PitchType.Imperial),
      sampleSetup: new PitchSetup(Gear.fromString("M1Z30"), undefined, undefined, Gear.fromString("M1Z60"), new Pitch(0.75, PitchType.Metric)),
      sampleSetupValid: true,
      estimator: new PitchEstimator(),
      estimation: null as PitchAssumption | null,
      GcMath,
      PitchAssumptionResult,
      i18n: GlobalConfig.i18n,
      id: Math.round(Math.random() * 1000),
      directPitchValid: true,
    };
  },
  methods: {
    validNumber(val: number | null): boolean {
      return !GcMath.isNaN(val) && Math.round(val!) == val && val > 0;
    },
    estimate() {
      this.estimation = this.estimator.esitmate(this.sampleSetup);
      setTimeout(() => document.getElementById('estimation'+this.id)?.scrollIntoView(), 100);
      return false;
    },
  },
  props: {
    modelValue: {
      type: Pitch,
      default: null,
      required: false,
    },
  },
  computed: {
    estimationText() {
      if (this.estimation == null) return "";

      let result:string;

      switch (this.estimation.result) {
        case PitchAssumptionResult.LikelyMetric:
          result = this.i18n.leadscrewLikelyMetric;
          break;
        case PitchAssumptionResult.LikelyImperial:
          result = this.i18n.leadscrewLikelyImperial;
          break;
        case PitchAssumptionResult.NoIdea:
          result = this.i18n.leadscrewNoIdea;
          break;
      }
      result += " " + this.i18n.leadscrewReviewOptions;
      return result;
    },
    selectedPitch: {
      get(): Pitch | null {
        return this.modelValue;
      },
      set(v: Pitch | null) {
        this.$emit("update:modelValue", v);
        if (v != null)
          this.$emit("saved");
      },
    },
  },
  emits: ["update:modelValue", "saved"],
  components: { PitchEditor, PitchSetupEditor, GeartrainImg },
};
</script>
