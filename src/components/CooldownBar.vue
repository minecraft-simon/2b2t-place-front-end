<template>
<div class="d-flex flex-column align-sm-center cb-main" :style="'opacity: ' + (showCooldownBar ? 1 : 0)">
  <v-sheet rounded elevation="4" class="ma-2 mb-md-3 mb-lg-4 mb-xl-5 align-self-start align-self-sm-auto" style="display: inline-block">
    <div class="mx-5 my-2 text-body-1 text-lg-h6 font-weight-regular">Cooldown: {{ cooldownSecondsLeft }}s</div>
  </v-sheet>
  <v-progress-linear :value="progressBarValue" :height="progressBarHeight" :color="progressBarColor"></v-progress-linear>
</div>
</template>

<script>
import {useSound} from '@vueuse/sound';
import cooldownOverSoundFile from '@/assets/sounds/cooldown-over.mp3';
import mitt from "mitt";
window.mitt = window.mitt || new mitt();

export default {
  name: "CooldownBar",
  data() {
    return {
      cooldownSeconds: 60,
      cooldownEnd: new Date(),
      cooldownSecondsLeftFloat: 0.0,
      cooldownSecondsLeft: 0,
      progressBarValue: 100,
      showCooldownBar: false,
    }
  },
  computed: {
    progressBarHeight() {
      if (this.$vuetify.breakpoint.xlOnly) {
        return 12;
      }
      if (this.$vuetify.breakpoint.lgAndUp) {
        return 11;
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 10;
      }
      if (this.$vuetify.breakpoint.smAndUp) {
        return 9;
      }
      return 8;
    },
    progressBarColor() {
      /*
      #a22500, #b8b900, #098e00
      let val = this.progressBarValue

      let red = 0
      if (val <= ) */

      return "#b5291f"
    }
  },
  setup() {
    const cooldownOverSound = useSound(cooldownOverSoundFile)
    return {
      cooldownOverSound
    }
  },
  mounted() {
    window.mitt.on("setCooldown", cooldownData => {
      this.updateCooldownBarData(cooldownData)
    })
    setInterval(this.recalculateCooldownState, 100);
  },
  methods: {
    updateCooldownBarData(cooldownData) {
      if (!cooldownData) {
        return
      }
      let cooldownSeconds = cooldownData[0]
      let cooldownSecondsLeftPacket = cooldownData[1]
      if (cooldownSeconds <= 0) {
        cooldownSeconds = 60
      } else {
        cooldownSeconds++;
      }
      this.cooldownSeconds = cooldownSeconds

      let cooldownEnd = new Date() // by default, cooldown ends right now
      if (cooldownSecondsLeftPacket > 0) {
        cooldownSecondsLeftPacket++;
        cooldownEnd.setSeconds(cooldownEnd.getSeconds() + cooldownSecondsLeftPacket)
        let difference = Math.abs((cooldownEnd.getTime() - this.cooldownEnd.getTime()) / 1000);
        if (difference > 3) { // if new cooldown end time differs from old value by more than 3 seconds, update that value
          this.cooldownEnd = cooldownEnd
        }
      }
    },
    recalculateCooldownState() {
      let now = new Date()
      this.cooldownSecondsLeftFloat = Math.max((this.cooldownEnd.getTime() - now.getTime()) / 1000, 0)
      this.cooldownSecondsLeft = Math.ceil(this.cooldownSecondsLeftFloat)

      if (this.showCooldownBar) {
        this.progressBarValue = this.cooldownSecondsLeftFloat / parseFloat(this.cooldownSeconds) * 100
      }

      if (this.cooldownSecondsLeft > 0) {
        this.showCooldownBar = true
      } else if (this.showCooldownBar) {
        this.showCooldownBar = false
        setTimeout(this.resetProgressBarValue, 500)
        this.cooldownOverSound.play()
      }
    },
    resetProgressBarValue() {
      this.progressBarValue = 100
    }
  }
}
</script>

<style scoped>
.cb-main {
  pointer-events: none;
  transition: opacity 500ms;
}
</style>