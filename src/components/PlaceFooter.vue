<template>
  <v-footer app fixed padless style="background-color: transparent !important;">
    <div class="footer-container d-flex">
      <div
          class="button-container d-flex d-lg-none flex-row flex-lg-wrap align-center px-3 flex-grow-0"
          style="height: 80px; overflow: auto; margin: auto;">
        <v-btn tile depressed color="black" class="grey lighten-1" style="height: 50px" @click="requestOpenColorDialog">
          <v-icon left>mdi-dots-vertical</v-icon>
          Colors
        </v-btn>
        <div v-for="(colorId, i) in recentColors" :key="colorId" class="d-flex flex-row">
          <v-btn icon style="height: 64px; width: 64px" @click="recentColorClicked(colorId)">
            <v-img :src="getColorThumbnail(colorId)" class="color-mini-thumbnail" max-width="36" max-height="36" contain></v-img>
          </v-btn>
          <v-divider v-if="i < recentColors.length - 1" vertical dark class="my-2"></v-divider>
        </div>
      </div>

      <div
          class="button-container d-none d-lg-flex flex-row flex-lg-wrap justify-lg-center pl-4 pr-2 pb-2 pt-4 pb-lg-0 pt-lg-2"
          style="max-width: 1140px; overflow: auto; margin: auto;">
        <div v-for="colorId in colorOrder" :key="colorId" class="mr-4 mb-4 mr-lg-2 mb-lg-2">
          <v-btn tile color="black" class="grey lighten-2 px-3 px-md-3"
                 :style="'height: ' + 45 + 'px'"
                 @click="colorClicked(colorId)">
            <v-img :src="getColorThumbnail(colorId)" class="mr-3 mr-lg-2" :width="32" :height="32"
                   contain></v-img>
            <div v-text="colorNames[colorId].replace('_', ' ')"></div>
          </v-btn>
        </div>
      </div>
    </div>

  </v-footer>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
  name: "PlaceFooter",
  data() {
    return {
      colorNames: [
        "white", "orange", "magenta", "light_blue",
        "yellow", "lime", "pink", "gray",
        "light_gray", "cyan", "purple", "blue",
        "brown", "green", "red", "black"
      ],
      colorOrder: [14, 1, 4, 5, 13, 9, 3, 11, 10, 2, 6, 12, 15, 7, 8, 0],
      recentColors: []
    }
  },
  computed: {},
  mounted() {
    window.mitt.on("addRecentColor", colorId => {
      this.addRecentColor(colorId);
    })
  },
  methods: {
    requestOpenColorDialog() {
      window.mitt.emit("requestOpenColorDialog", null)
    },
    getColorThumbnail(colorId) {
      let colorName = this.colorNames[colorId].replace(" ", "-")
      return require("../assets/blocks/" + colorName + ".png");
    },
    recentColorClicked(colorId) {
      window.mitt.emit("colorClicked", colorId)
    },
    colorClicked(colorId) {
      window.mitt.emit("colorClicked", colorId)
      this.addRecentColor(colorId);
    },
    addRecentColor(colorId) {
      let newArray = []
      newArray.push(colorId)
      for (let recentColor of this.recentColors) {
        if (recentColor !== colorId) {
          newArray.push(recentColor)
        }
      }
      this.recentColors = newArray
    }
  }
}
</script>

<style scoped>
.footer-container {
  position: relative;
  width: 100%;
  /*background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.82) 100%) !important;*/
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.button-container {

}

.color-mini-thumbnail {
  filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.8));
}
</style>