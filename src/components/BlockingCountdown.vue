<template>
  <v-dialog v-model="dialogOpen" max-width="400" persistent>
    <v-card>
      <v-toolbar dark color="grey darken-4">
        <v-spacer></v-spacer>
        <v-toolbar-title>Get Ready!</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container class="pt-6 pb-8" fluid style="max-width: 380px">
        <div class="d-flex flex-column justify-center">
          <div class="text-center text-h4">our/place</div>
          <div class="text-center text-h5 font-weight-light mt-1">will launch in</div>
          <div class="d-flex flex-row justify-center text-h4 mt-2">
            <div class="">0</div>
            <div class="ml-2 font-weight-light">hours</div>
          </div>
          <div class="d-flex flex-row justify-center text-h4 mt-2">
            <div class="">0</div>
            <div class="ml-2 font-weight-light">minutes</div>
          </div>
          <div class="d-flex flex-row justify-center text-h4 mt-2">
            <div class="">0</div>
            <div class="ml-2 font-weight-light">seconds</div>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import mitt from "mitt";
window.mitt = window.mitt || new mitt();

export default {
  name: "BlockingCountdown",
  data() {
    return {
      dialogOpen: false,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  computed: {

  },
  mounted() {
    window.mitt.on("setLaunchTimestamp", timestamp => {

    })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>