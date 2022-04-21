<template>
  <v-dialog v-model="dialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card class="semi-transparent">
      <v-toolbar dark color="gray" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title>Choose Color</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="pa-0 pt-3 pl-1 pr-2 pb-4">
        <v-row no-gutters justify="center">
          <v-col v-for="colorId in colorOrder" :key="colorId"
                 class="col-6 col-sm-4 col-md-3 d-flex justify-center pl-2 pr-1 pb-3">
            <v-btn color="black" class="flex-grow-1 grey lighten-2 pl-3 pr-1"
                   :style="'height: ' + 50 + 'px'"
                   @click="colorClicked(colorId)">
              <v-img :src="getColorThumbnail(colors[colorId])" class="interpolation-nn mr-31 mr-lg-21" width="32"
                     :max-width="32"
                     contain></v-img>
              <div v-text="colors[colorId].replace('_', ' ').replace('light', 'l.')" class="flex-grow-1"></div>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
  name: "ColorChooserDialog",
  data() {
    return {
      dialogOpen: false,
      colors: [
        "white", "orange", "magenta", "light_blue",
        "yellow", "lime", "pink", "gray",
        "light_gray", "cyan", "purple", "blue",
        "brown", "green", "red", "black"
      ],
      colorOrder: [14, 1, 4, 5, 13, 9, 3, 11, 10, 2, 6, 12, 15, 7, 8, 0]
    }
  },
  mounted() {
    window.mitt.on("openColorDialog", () => {
      this.dialogOpen = true
    })
  },
  methods: {
    closeDialog() {
      this.dialogOpen = false
    },
    getColorThumbnail(color) {
      return require("../assets/blocks/" + color.replace(" ", "-") + ".png");
    },
    colorClicked(color) {
      this.dialogOpen = false
      window.mitt.emit("colorClicked", color)
      window.mitt.emit("addRecentColor", color)
    }
  }
}
</script>

<style scoped>
.semi-transparent2 {
  background-color: rgba(0, 0, 0, 0.75) !important;
}
</style>