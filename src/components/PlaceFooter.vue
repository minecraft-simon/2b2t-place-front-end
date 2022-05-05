<template>
  <v-footer app fixed padless style="background-color: transparent !important;">
    <div class="footer-container d-flex flex-column">
      <div v-if="false" class="d-flex justify-space-between align-end pa-2 pa-sm-3 pa-md-4">
        <v-progress-circular size="50" value="10" rotate="270" class="circular-countdown">
          <div class="text-h6" style="transform: scaleX(-1)">50</div>
        </v-progress-circular>
        <FloatingActionButton></FloatingActionButton>
      </div>
      <div class="button-main-container d-flex">
        <!-- start mobile color menu -->
        <div
            class="button-container d-flex d-lg-none flex-row flex-lg-wrap align-center px-3 flex-grow-0"
            style="height: 80px; overflow: auto; margin: auto;">
          <v-btn depressed color="black" class="grey lighten-2" style="height: 50px"
                 @click="requestOpenColorDialog">
            <v-icon left>mdi-dots-vertical</v-icon>
            Colors
          </v-btn>
          <div v-for="(colorId, i) in recentColors" :key="colorId" class="d-flex flex-row">
            <v-btn icon style="height: 64px; width: 64px" @click="recentColorClicked(colorId)">
              <v-img :src="getColorThumbnail(colorId)" class="color-mini-thumbnail" max-width="36" max-height="36"
                     contain></v-img>
            </v-btn>
            <v-divider v-if="i < recentColors.length - 1" vertical dark class="my-2"></v-divider>
          </div>
        </div>
        <!-- end mobile color menu -->

        <!-- start desktop color menu -->
        <div
            class="button-container d-none d-lg-flex flex-row flex-lg-wrap justify-lg-center pl-4 pr-2 pb-2 pt-4 pb-lg-0 pt-lg-2"
            style="max-width: 1140px; overflow: auto; margin: auto;">
          <div v-for="colorId in colorOrder" :key="colorId" class="mr-4 mb-4 mr-lg-2 mb-lg-2">
            <v-btn color="black" class="grey lighten-2 px-3 px-md-3"
                   :style="'height: ' + 45 + 'px'"
                   @click="colorClicked(colorId)">
              <v-img :src="getColorThumbnail(colorId)" class="mr-3 mr-lg-2" :width="32" :height="32"
                     contain></v-img>
              <div v-text="colorNames[colorId].replace('_', ' ')"></div>
            </v-btn>
          </div>
        </div>
        <!-- end desktop color menu -->
      </div>
    </div>
  </v-footer>
</template>

<script>
import mitt from "mitt";
import FloatingActionButton from "@/components/FloatingActionButton";
import CooldownBar from "@/components/CooldownBar";

window.mitt = window.mitt || new mitt();

export default {
  name: "PlaceFooter",
  components: {CooldownBar, FloatingActionButton},
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
      this.addRecentColor(colorId);
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
  width: 100%;
}

.button-main-container {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.color-mini-thumbnail {
  filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.8));
}

.circular-countdown {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  transform: scaleX(-1);
}

</style>