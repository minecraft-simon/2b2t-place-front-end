<template>
  <div id="placePage" class="fill-height">
    <v-main class="fill-height">
      <div id="placeContainer" ref="clickReceiver">
        <div id="panZoomContainer" ref="panZoomContainer">
          <panZoom :options="{minZoom: 0.18, maxZoom: 6, initialZoom2: 1, bounds: true, boundsPadding: 0.1}"
                   style2="background-color: yellow" class="fill-height"
                   @init="initPanZoom" @transform="panZoomTransform">
            <Map></Map>
          </panZoom>
        </div>
        <div id="selectedPixelDiv" ref="selectedPixelDiv">
          <v-img :src="pixelHighlightImage" class="selected-pixel-image"
                 :style="'transform: scale(' + pixelHighlightImageScale + ')'"></v-img>
        </div>
        <div v-for="pos in 50" :key="pos" class="selection-highlight">
          <v-img :src="pixelHighlightImage" class="highlight-image"
                 :style="'transform: scale(' + pixelHighlightImageScale + ')'"></v-img>
        </div>
        <div class="d-none">
          <v-img src="@/assets/pixel-highlight/1.png" ref="highlight1Loader"></v-img>
          <v-img src="@/assets/pixel-highlight/2.png" ref="highlight2Loader"></v-img>
          <v-img src="@/assets/pixel-highlight/3.png" ref="highlight3Loader"></v-img>
        </div>
      </div>
    </v-main>
    <PlaceFooter></PlaceFooter>
    <ColorChooserDialog></ColorChooserDialog>
    <SelectPixelDialog></SelectPixelDialog>
    <AuthenticationDialog></AuthenticationDialog>
  </div>
</template>

<script>
import { useSound } from '@vueuse/sound';
import pixelSoundFile from '@/assets/sounds/pixel-selected.mp3';
import colorSoundFile from '@/assets/sounds/color-placed.mp3';
import mitt from "mitt";
import PlaceFooter from "@/components/PlaceFooter";
import Map from "@/components/Map";
import ColorChooserDialog from "@/components/ColorChooserDialog";
import AuthenticationDialog from "@/components/AuthenticationDialog";
import SelectPixelDialog from "@/components/SelectPixelDialog";

window.mitt = window.mitt || new mitt();

export default {
  name: "Place.vue",
  data() {
    return {
      instance: null,
      selectedPixelPos: null,
      canvasScale: 10,
      selectionHighlights: [],
      pixelHighlightImage: "",
      pixelHighlightImageScale: 1
    }
  },
  components: {SelectPixelDialog, AuthenticationDialog, ColorChooserDialog, Map, PlaceFooter},
  computed: {
    identity() {
      return this.$store.state.identity;
    },
    sessionId() {
      return this.$store.state.sessionId;
    }
  },
  setup() {
    const pixelSound = useSound(pixelSoundFile)
    const colorSound = useSound(colorSoundFile)
    return {
      pixelSound, colorSound
    }
  },
  mounted() {
    this.$store.dispatch("generateSessionId")
    this.initEventListeners();
    this.initMittListeners();
    this.sendStatusUpdate();
  },
  methods: {
    initEventListeners() {
      this.$refs.clickReceiver.addEventListener("mousedown", ev => {
        let clientX = ev.clientX;
        let clientY = ev.clientY;
        this.locationSelected(clientX, clientY)
      })

      this.$refs.clickReceiver.addEventListener("touchend", ev => {
        if (ev.touches.length > 1) return;
        let clientX = ev.changedTouches[0].clientX;
        let clientY = ev.changedTouches[0].clientY;
        this.locationSelected(clientX, clientY)
      })
    },
    initMittListeners() {
      window.mitt.on("pixelSelected", pos => {
        this.selectedPixelPos = pos

        // reset the highlight animation
        let selectedPixelDiv = this.$refs.selectedPixelDiv;
        selectedPixelDiv.style.animation = 'none';
        selectedPixelDiv.offsetHeight;
        selectedPixelDiv.style.animation = null;
        // enable the highlight transition
        selectedPixelDiv.style.transition = 'all 0.1s ease-out';
        //play the pop sound
        this.pixelSound.stop()
        this.pixelSound.play()
        this.refreshOverlays();
      })
      window.mitt.on("colorClicked", color => {
        this.colorClicked(color)
      })
      window.mitt.on("requestOpenColorDialog", () => {
        if (this.selectedPixelPos) {
          window.mitt.emit("openColorDialog")
        } else {
          window.mitt.emit("openSelectPixelDialog")
        }
      })
    },
    initPanZoom(instance) {
      this.instance = instance
    },
    locationSelected(x, y) {
      let barHeight = 64;
      let data = {
        x: x,
        y: y - barHeight
      }
      window.mitt.emit("clickReceiverLocation", data)
    },
    panZoomTransform() {
      this.refreshOverlays()
      // cancel highlight transition effect
      let selectedPixelDiv = this.$refs.selectedPixelDiv;
      selectedPixelDiv.style.transition = 'none'
    },
    refreshOverlays() {
      if (this.instance) {
        let panZoomTransform = this.instance.getTransform()
        let panZoomScale = panZoomTransform["scale"]
        let scale = this.canvasScale * panZoomScale
        let baseX = panZoomTransform.x
        let baseY = panZoomTransform.y

        this.updateSelectedPixelHighlight(baseX, baseY, scale)
        this.updateSelectionHighlights(baseX, baseY, scale)
        this.configPixelHighlightImage(panZoomScale)
      }
    },
    updateSelectedPixelHighlight(baseX, baseY, scale) {
      let selectedPixelDiv = this.$refs.selectedPixelDiv;
      if (!this.selectedPixelPos) {
        selectedPixelDiv.style.display = "none";
        return;
      }
      let x = baseX + this.selectedPixelPos.x * scale
      let y = baseY + this.selectedPixelPos.y * scale
      selectedPixelDiv.style.left = x + 'px';
      selectedPixelDiv.style.top = y + 'px';
      selectedPixelDiv.style.width = scale + 'px';
      selectedPixelDiv.style.height = scale + 'px';
      selectedPixelDiv.style.display = "block";
    },
    updateSelectionHighlights(baseX, baseY, scale) {
      // hide all highlights
      let highlightElements = document.getElementsByClassName("selection-highlight");
      for (let i = 0; i < highlightElements.length; i++) {
        let element = highlightElements[i]
        element.style.display = 'none'
      }

      // draw max. 50 selection highlights
      for (let i = 0; i < this.selectionHighlights.length; i++) {
        let selection = this.selectionHighlights[i]
        let element = highlightElements[i]
        if (element) {
          let x = baseX + selection.x * scale
          let y = baseY + selection.y * scale
          element.style.left = x + 'px';
          element.style.top = y + 'px';
          element.style.width = scale + 'px';
          element.style.height = scale + 'px';
          element.style.display = 'block'
        }
      }
    },
    configPixelHighlightImage(scale) {
      if (scale > 3) {
        this.pixelHighlightImage = this.$refs.highlight1Loader.src
        this.pixelHighlightImageScale = 1.09
      } else if (scale > 0.8) {
        this.pixelHighlightImage = this.$refs.highlight2Loader.src
        this.pixelHighlightImageScale = 1.2
      } else {
        this.pixelHighlightImage = this.$refs.highlight3Loader.src
        this.pixelHighlightImageScale = 1.5
      }

    },
    sendStatusUpdate() {
      let statusUpdate = {
        sessionId: this.sessionId,
        highlightPos: this.selectedPixelPos
      }
      this.$store.dispatch("putRequest", ["status", statusUpdate, this.statusUpdateCallback])
    },
    statusUpdateCallback(data) {
      let pollingTimeout = 1000
      if (data) {
        // handle player auth data
        let identity = data["identity"];
        let authToken = data["authToken"];
        if (identity && authToken) {
          this.$store.dispatch("updateIdentityAndAuthToken", [identity, authToken])
        }

        this.selectionHighlights = data["highlights"]
        let pixelString = window.atob(data["pixelGrid"]["pixels"])
        window.mitt.emit("setPixelGrid", pixelString)
        pollingTimeout = data["pollingDelay"]
        this.refreshOverlays()
      } else {
        pollingTimeout = 5000
      }
      setTimeout(this.sendStatusUpdate, pollingTimeout);
    },
    colorClicked(color) {
      if (this.selectedPixelPos) {
        let pixel = {
          x: this.selectedPixelPos.x,
          y: this.selectedPixelPos.y,
          color: color
        }
        if (this.identity !== null) {
          this.$store.dispatch("putRequest", ["pixels", pixel, this.sendPixelCallback])
        } else {
          window.mitt.emit("openAuthenticationDialog")
        }
      } else {
        window.mitt.emit("openSelectPixelDialog")
      }
    },
    sendPixelCallback(pixel) {
      if (pixel) {
        window.mitt.emit("updatePixel", pixel)
        this.colorSound.play();
      }
    }
  }
}
</script>

<style scoped>
#placePage {
  background-size: cover;
  background: radial-gradient(ellipse, transparent 30%, rgba(0, 0, 0, 0.6) 100%),
    /*linear-gradient(transparent 60%, rgba(0, 0, 0, 0.75) 95%),*/ linear-gradient(rgba(100, 100, 100, 0.4), rgba(100, 100, 100, 0.4)),
  url('~@/assets/spawn-render.jpg') right;
}

#placeContainer {
  position: relative;
  height: 100%;
}

#panZoomContainer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: calc(100% - 100px);
}

#selectedPixelDiv {
  position: absolute;
  display: none;
  pointer-events: none;
  transition: all 1s ease-out;
  animation: breathe 1.5s ease-in-out infinite;
}

.selected-pixel-image {
  width: 100%;
  height: 100%;
  opacity: 0.75;
}

.highlight-image {
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.selection-highlight {
  position: absolute;
  display: none;
  pointer-events: none;
}

@keyframes breathe {
  0% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>

<style>

</style>