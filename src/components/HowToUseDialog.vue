<template>
  <v-dialog v-model="dialogOpen" max-width="400" hide-overlay2 persistent :fullscreen="fullscreen">
    <v-card>
      <v-toolbar dark color="grey darken-4" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title>How to navigate the map</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="py-4" fluid style="max-width: 380px">
        <div class="text-overline grey--text text--darken-2">on desktop computers</div>
        <div class="d-flex">
          <v-icon color="black">mdi-cursor-default-click</v-icon>
          <div class="ml-2">Click on the map to select a pixel</div>
        </div>
        <div class="d-flex mt-4">
          <v-icon color="black">mdi-arrow-up-down</v-icon>
          <div class="ml-2">Scroll to zoom</div>
        </div>
        <div class="d-flex mt-4">
          <v-icon color="black">mdi-cursor-move</v-icon>
          <div class="ml-2">Click and drag to move</div>
        </div>

        <div class="text-overline mt-4 grey--text text--darken-2">on touch devices</div>
        <div class="d-flex">
          <v-icon color="black">mdi-gesture-tap</v-icon>
          <div class="ml-2">Tap on the map to select a pixel</div>
        </div>
        <div class="d-flex mt-4">
          <v-icon color="black">mdi-gesture-pinch</v-icon>
          <div class="ml-2">Pinch to zoom</div>
        </div>
        <div class="d-flex mt-4">
          <v-icon color="black">mdi-gesture-swipe-horizontal</v-icon>
          <div class="ml-2">Drag to move</div>
        </div>
        <div class="mt-8 d-flex justify-center">
          <v-btn dark color="grey darken-3" @click="closeDialog">OK</v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "HowToUseDialog",
  data() {
    return {
      dialogOpen: false
    }
  },
  computed: {
    fullscreen() {
      return this.$vuetify.breakpoint.xs
    },
    identity() {
      return this.$store.state.identity;
    }
  },
  mounted() {
    let openDialog = this.autoOpenDialog
    setTimeout(openDialog, 1000);
  },
  methods: {
    autoOpenDialog() {
      if (this.identity === null) {
        this.dialogOpen = true
      }
    },
    closeDialog() {
      this.dialogOpen = false
    }
  }
}
</script>

<style scoped>

</style>