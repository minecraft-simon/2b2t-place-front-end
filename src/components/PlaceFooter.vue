<template>
  <v-footer app fixed padless style="background-color: transparent !important;">
    <div class="footer-container">
      <div
          class="button-container d-flex flex-row flex-lg-wrap justify-lg-center pl-4 pr-2 pb-2 pt-4 pb-lg-0 pt-lg-2"
          style="max-width: 1140px; overflow: auto; margin: auto;">
        <div v-for="colorId in colorOrder" :key="colorId" class="mr-4 mb-4 mr-lg-2 mb-lg-2">
          <v-btn tile color="black" :x-large="xLarge" class="grey lighten-2 px-3 px-md-3"
                 :style="'height: ' + buttonHeight + 'px'"
                 @click="colorClicked(colorId)">
            <v-img :src="getColorThumbnail(colors[colorId])" class="interpolation-nn mr-3 mr-lg-2" :width="thumbnailWidth"
                   contain></v-img>
            <div v-text="colors[colorId].replace('_', ' ')"></div>
          </v-btn>
        </div>
      </div>
      <div v-if="showScrollHint" id="scrollHintOverlay" class="d-flex d-lg-none align-center justify-center"
           @touchstart="showScrollHint = false" @touchmove="showScrollHint = false" @click="showScrollHint = false">
        <div class="mr-1">Swipe to see all colors</div>
        <v-icon color="white" size="50" class="mr-n3">mdi-gesture-swipe-horizontal</v-icon>
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
      colors: [
        "white", "orange", "magenta", "light_blue",
        "yellow", "lime", "pink", "gray",
        "light_gray", "cyan", "purple", "blue",
        "brown", "green", "red", "black"
      ],
      colorOrder: [14, 1, 4, 5, 13, 9, 3, 11, 10, 2, 6, 12, 15, 7, 8, 0],
      showScrollHint: true
    }
  },
  computed: {
    xLarge() {
      if (this.$vuetify.breakpoint.smAndDown) return true
      return false
    },
    buttonHeight() {
      if (this.$vuetify.breakpoint.mdAndUp) return 45
      if (this.$vuetify.breakpoint.smAndUp) return 60
      return 60
    },
    thumbnailWidth() {
      if (this.$vuetify.breakpoint.mdAndUp) return 32
      if (this.$vuetify.breakpoint.smAndUp) return 40
      return 40
    }
  },
  methods: {
    getColorThumbnail(color) {
      return require("../assets/blocks/" + color.replace(" ", "-") + ".png");
    },
    colorClicked(color) {
      window.mitt.emit("colorClicked", color)
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

#scrollHintOverlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 18pt;
}
</style>