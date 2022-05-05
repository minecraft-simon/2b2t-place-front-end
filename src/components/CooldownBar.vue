<template>
<div v-if="false" class="d-flex flex-column align-sm-center" style="pointer-events: none">
  <v-sheet rounded elevation="4" class="ma-2 mb-md-3 mb-lg-4 mb-xl-5 align-self-start align-self-sm-auto" style="display: inline-block">
    <div class="mx-5 my-2 text-body-1 text-lg-h6 font-weight-regular">Cooldown: 20 seconds</div>
  </v-sheet>
  <v-progress-linear value="50" :height="progressBarHeight" color="#b5291f"></v-progress-linear>
</div>
</template>

<script>
export default {
  name: "CooldownBar",
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
    }
  }
}
</script>

<style scoped>

</style>