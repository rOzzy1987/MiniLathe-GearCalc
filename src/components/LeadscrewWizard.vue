<template>
  <div>
    <div v-if="selectedPitch == null">
      <div v-if="knowPitch === null">
        <div class="field">
          <label class="label">Do you know your leadscrew pitch?</label>
          <div class="control buttons">
            <button class="button is-info" @click.prevent="knowPitch = true">Yes</button>
            <button class="button is-info" @click.prevent="knowPitch = false">
              No, help me find out!
            </button>
          </div>
        </div>
      </div>

      <div v-if="knowPitch">
        <PitchEditor v-model:pitch="pitch.value" v-model:pitchType="pitch.type" />
        <div class="buttons mt-4">
          <button class="button" @click.prevent="knowPitch = null">Go back</button>
          <button class="button is-primary" @click.prevent="selectedPitch = pitch">
            Save
          </button>
        </div>
      </div>

      <div v-if="knowPitch === false">
        <div v-if="estimation == null" class="columns">
          <div class="column">
            <div class="message">
              <article class="message-body">
                Please provide a sample gear setup for a known pitch. You'll most likely
                find some printed on the geartrain cover. Any one will do. It can be 4
                gears, or 2 gears.
              </article>
            </div>

            <PitchSetupEditor
              v-model:gearA="sampleSetup.gearA"
              v-model:gearB="sampleSetup.gearB"
              v-model:gearC="sampleSetup.gearC"
              v-model:gearD="sampleSetup.gearD"
              v-model:pitch="sampleSetup.pitch.value"
              v-model:type="sampleSetup.pitch.type"
              @validated="sampleSetupValid = $event"
            />

            <div class="buttons mt-4">
              <button class="button" @click.prevent="knowPitch = null">Go back</button>
              <button
                class="button is-info"
                @click.prevent="estimate"
                :disabled="!sampleSetupValid"
              >
                Find my pitch
              </button>
            </div>
          </div>

          <div class="column is-one-quarter box">
            <GeartrainImg
              :gear-a="sampleSetup.gearA"
              :gear-b="sampleSetup.gearB ?? 0"
              :gear-c="sampleSetup.gearC ?? 0"
              :gear-d="sampleSetup.gearD"
              :scale="1.5"
            />
          </div>
        </div>

        <div v-if="estimation != null">
          <div class="message is-info">
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
            <button class="button" @click.prevent="estimation = null">Go back</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
        <div class="field">
            <label class="label">Your selected leadscrew pitch</label>
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
                Edit leadscrew pitch
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
import GeartrainImg from "./GeartrainImg.vue";
import PitchEditor from "./PitchEditor.vue";
import PitchSetupEditor from "./PitchSetupEditor.vue";

export default {
  data() {
    return {
      knowPitch: null as boolean | null,
      pitch: new Pitch(16, PitchType.Imperial),
      sampleSetup: new PitchSetup(30, null, null, 60, new Pitch(0.75, PitchType.Metric)),
      sampleSetupValid: true,
      estimator: new PitchEstimator(),
      estimation: null as PitchAssumption | null,
      GcMath,
      PitchAssumptionResult,
    };
  },
  methods: {
    validNumber(val: number | null): boolean {
      return !GcMath.isNaN(val) && Math.round(val!) == val && val > 0;
    },
    estimate() {
      this.estimation = this.estimator.esitmate(this.sampleSetup);
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

      let result = "Your leadscrew pitch is likely ";
      switch (this.estimation.result) {
        case PitchAssumptionResult.LikelyMetric:
          result += "metric.";
          break;
        case PitchAssumptionResult.LikelyImperial:
          result += "imperial.";
          break;
        case PitchAssumptionResult.NoIdea:
          result = "We couldn't determine your leadscrew type confidently.";
          break;
      }
      result += " Review the calculated options and click the one you prefer:";
      return result;
    },
    selectedPitch: {
      get(): Pitch | null {
        return this.modelValue;
      },
      set(v: Pitch | null) {
        this.$emit("update:modelValue", v);
      },
    },
  },
  components: { PitchEditor, PitchSetupEditor, GeartrainImg },
};
</script>
