<template>
  <div id="placePage" class="fill-height">

    <div v-show="maintenanceMode || sessionExpired || noConnection" class="fill-height">
      <div class="d-flex justify-center align-center fill-height">
        <v-sheet rounded elevation="5" class="pa-4">
          <div class="d-flex flex-column align-center">
            <div v-text="blockingOverlayTitle" class="text-h5 text-center"></div>
            <div v-if="sessionExpired" class="text-body-1 mt-4">Please reload the page.</div>
            <v-btn v-if="sessionExpired" class="mt-4" color="grey darken-3" dark @click="reloadPage">
              <v-icon left>mdi-reload</v-icon>
              Reload
            </v-btn>
            <div v-if="(maintenanceMode || noConnection) && !sessionExpired" class="text-body-1 mt-4">Please wait.</div>
            <div v-if="maintenanceMode && !sessionExpired" class="text-body-1 mt-2 text-center">
              The web page will automatically refresh as soon as maintenance is over.
            </div>
            <div v-if="noConnection && !sessionExpired" class="text-body-1 mt-2 text-center">
              This message will automatically disappear as soon as the server responds again.
            </div>
          </div>
        </v-sheet>
      </div>
    </div>

    <div v-show="!(maintenanceMode || sessionExpired || noConnection)" class="fill-height">
      <AppBar></AppBar>
      <v-main class="fill-height">
        <div id="placeContainer" ref="clickReceiver">
          <div id="panZoomContainer" ref="panZoomContainer">
            <panZoom :options="{minZoom: 0.18, maxZoom: 6, initialZoom2: 1, bounds: true, boundsPadding: 0.1}"
                     style2="background-color: yellow" class="fill-height"
                     @init="initPanZoom" @transform="panZoomTransform">
              <Map></Map>
            </panZoom>
          </div>
          <div v-for="highlight in selectionHighlights" :key="highlight.identifier" class="selection-highlight"
               :style="highlight">
            <v-img :src="pixelHighlightImage" class="highlight-image"
                   :style="'transform: scale(' + pixelHighlightImageScale + ')'"></v-img>
          </div>
          <div style="opacity: 0; pointer-events: none; width: 10px; height: 10px">
            <v-img src="@/assets/pixel-highlight/1.png" ref="highlight1Loader"></v-img>
            <v-img src="@/assets/pixel-highlight/2.png" ref="highlight2Loader"></v-img>
            <v-img src="@/assets/pixel-highlight/3.png" ref="highlight3Loader"></v-img>
          </div>
          <div v-for="(value, name) in botPositions" :key="name" class="map-marker map-marker-transition" :style="value">
            <v-img v-if="value['onMap']" src="@/assets/map-markers/on-map.png" class="interpolation-nn on-map-marker"></v-img>
            <v-img v-else src="@/assets/map-markers/outside.png" class="interpolation-nn outside-marker"></v-img>
          </div>
          <div id="selectedPixelDiv" ref="selectedPixelDiv">
            <v-img :src="pixelHighlightImage" class="selected-pixel-image"
                   :style="'transform: scale(' + pixelHighlightImageScale + ')'"></v-img>
          </div>
          <div v-if="false" class="selected-pixel-label" style="font-size: 12pt">
            <v-sheet rounded elevation="4" class="ma-2 mb-md-3 mb-lg-4 mb-xl-5 align-self-start align-self-sm-auto" style="display: inline-block">
              <div class="mx-5 my-2 font-weight-regular">Cooldown</div>
            </v-sheet>
          </div>
        </div>
      </v-main>
      <PlaceFooter ref="placeFooter"></PlaceFooter>
      <HowToUseDialog v-if="!(maintenanceMode || noConnection || sessionExpired)"></HowToUseDialog>
      <ColorChooserDialog></ColorChooserDialog>
      <SelectPixelDialog></SelectPixelDialog>
      <AuthenticationDialog></AuthenticationDialog>
    </div>

    <CooldownBar ref="cooldownBar" style="position: absolute; left: 0; right: 0"></CooldownBar>
    <FloatingActionButton ref="floatingActionButton" style="position: absolute"></FloatingActionButton>

  </div>
</template>

<script>
import {useSound} from '@vueuse/sound';
import pixelSoundFile from '@/assets/sounds/pixel-selected.mp3';
import colorSoundFile from '@/assets/sounds/color-placed.mp3';
import placeCooldownSoundFile from '@/assets/sounds/place-cooldown.mp3';
import mitt from "mitt";
import PlaceFooter from "@/components/PlaceFooter";
import Map from "@/components/Map";
import ColorChooserDialog from "@/components/ColorChooserDialog";
import AuthenticationDialog from "@/components/AuthenticationDialog";
import SelectPixelDialog from "@/components/SelectPixelDialog";
import AppBar from "@/components/AppBar";
import HowToUseDialog from "@/components/HowToUseDialog";
import {ref} from "@vue/composition-api";
import FloatingActionButton from "@/components/FloatingActionButton";
import CooldownBar from "@/components/CooldownBar";

window.mitt = window.mitt || new mitt();

export default {
  name: "Place.vue",
  data() {
    return {
      instance: null,
      selectedPixelPos: null,
      canvasScale: 10,
      selectionHighlightsRaw: [],
      selectionHighlights: [],
      selectedPixelLabel: {},
      pixelHighlightImage: "",
      pixelHighlightImageScale: 1,
      botPositionsRaw: {},
      botPositions: {},
      maintenanceMode: false,
      sessionExpired: false,
      noConnection: false
    }
  },
  components: {
    CooldownBar,
    FloatingActionButton,
    HowToUseDialog, AppBar, SelectPixelDialog, AuthenticationDialog, ColorChooserDialog, Map, PlaceFooter
  },
  computed: {
    identity() {
      return this.$store.state.identity;
    },
    sessionId() {
      return this.$store.state.sessionId;
    },
    blockingOverlayTitle() {
      if (this.sessionExpired) {
        return "Your Session has Expired"
      }
      if (this.maintenanceMode) {
        return "our/place is in maintenance mode"
      }
      if (this.noConnection) {
        return "No connection to the server..."
      }
    }
  },
  setup() {
    const playbackRate = ref(1)
    const pixelSound = useSound(pixelSoundFile)
    const colorSound = useSound(colorSoundFile, {playbackRate})
    const placeCooldownSound = useSound(placeCooldownSoundFile)

    const playPixelSound = () => {
      pixelSound.stop()
      pixelSound.play()
    }

    const playColorSound = () => {
      playbackRate.value = Math.random() / 2 + 0.75
      colorSound.play()
    }

    return {
      pixelSound, colorSound, placeCooldownSound, playPixelSound, playColorSound
    }
  },
  watch: {
    maintenanceMode(newValue) {
      if (!newValue) {
        location.reload()
      }
    }
  },
  created() {

  },
  mounted() {
    this.$store.dispatch("generateSessionId")
    this.initEventListeners();
    this.initMittListeners();
    this.sendStatusUpdate();

    window.addEventListener("resize", this.triggerReposition)
    this.triggerReposition()
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

        this.resetHighlightAnimation()

        //play the pop sound
        this.playPixelSound()
        this.refreshOverlays()
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

      let markers = document.querySelectorAll('.map-marker-transition');
      markers.forEach(function(el) {
        el.classList.remove("map-marker-transition")
      });
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
        this.updateBotPositions(baseX, baseY, scale)
      }
    },
    resetHighlightAnimation() {
      let selectedPixelDiv = this.$refs.selectedPixelDiv;
      selectedPixelDiv.style.animation = 'none';
      selectedPixelDiv.offsetHeight;
      selectedPixelDiv.style.animation = null;
      // enable the highlight transition
      selectedPixelDiv.style.transition = 'all 0.1s ease-out';
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
      this.selectionHighlights = []
      let length = Math.min(this.selectionHighlightsRaw.length, 50);
      for (let i = 0; i < length; i++) {
        let selection = this.selectionHighlightsRaw[i]
        let highlight = {
          left: baseX + selection.x * scale + 'px',
          top: baseY + selection.y * scale + 'px',
          width: scale + 'px',
          height: scale + 'px',
          identifier: selection.x + "_" + selection.y
        }
        this.selectionHighlights.push(highlight);
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
    updateBotPositions(baseX, baseY, scale) {
      this.botPositions = {}
      let posRaw = this.botPositionsRaw

      let markers = document.querySelectorAll('.map-marker');
      markers.forEach(function(el) {
        el.classList.add("map-marker-transition")
      });

      for (let key in posRaw) {
        if (posRaw.hasOwnProperty(key)) {
          let posRawEntry = posRaw[key]

          let imageScale = scale
          if (scale >= 8) {
            imageScale = 4 + scale * 0.5
          }
          if (!isNaN(posRawEntry["rotation"])) {
            let rotation = Math.round((posRawEntry["rotation"] + 180) / 30) * 30
            let pos = {
              left: baseX + posRawEntry.x * scale + 'px',
              top: baseY + posRawEntry.y * scale + 'px',
              width: imageScale * 5 + 'px',
              height: imageScale * 7 + 'px',
              transform: "translate(-50%, -50%) rotate(" + rotation + "deg)",
              onMap: true
            }
            this.botPositions[key] = pos;
          } else {
            let pos = {
              left: baseX + posRawEntry.x * scale + 'px',
              top: baseY + posRawEntry.y * scale + 'px',
              width: imageScale * 6 + 'px',
              height: imageScale * 6 + 'px',
              transform: "translate(-50%, -50%)",
              onMap: false
            }
            this.botPositions[key] = pos;
          }

        }
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
        this.sessionExpired = data["sessionExpired"]
        if (this.sessionExpired) {
          return;
        }

        this.noConnection = false

        // handle player auth data
        let identity = data["identity"];
        let authToken = data["authToken"];
        if (identity && authToken) {
          this.$store.dispatch("updateIdentityAndAuthToken", [identity, authToken])
        }

        this.selectionHighlightsRaw = data["highlights"]
        this.botPositionsRaw = data["botPositions"]
        let pixelString = window.atob(data["pixelGrid"]["pixels"])
        window.mitt.emit("setPixelGrid", pixelString)
        window.mitt.emit("setCooldown", [data["cooldownSeconds"], data["cooldownSecondsLeft"]])
        this.maintenanceMode = data["maintenanceMode"]

        pollingTimeout = data["pollingDelay"]
        this.refreshOverlays()
      } else {
        this.noConnection = true
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
          if (!this.$store.state.cooldownActive) {
            this.$store.dispatch("putRequest", ["pixels", pixel, this.sendPixelCallback])
          } else {
            this.placeCooldownSound.play();
          }
        } else {
          window.mitt.emit("openAuthenticationDialog", true)
        }
      } else {
        window.mitt.emit("openSelectPixelDialog")
      }
    },
    sendPixelCallback(pixel) {
      if (pixel) {
        window.mitt.emit("updatePixel", pixel)
        let cooldownSeconds = pixel["cooldownSeconds"]
        if (cooldownSeconds > 0) {
          window.mitt.emit("setCooldown", [cooldownSeconds, cooldownSeconds])
        }
        this.playColorSound();
      } else {
        this.placeCooldownSound.play();
      }
    },
    reloadPage() {
      location.reload()
    },
    triggerReposition() {
      let method = this.repositionFloatingElements
      setTimeout(method, 1000)
      method()
    },
    repositionFloatingElements() {
      let footerBB = this.$refs.placeFooter.$el.getBoundingClientRect()

      let fab = this.$refs.floatingActionButton.$el
      let fabBB = fab.getBoundingClientRect()
      let fabStyle = fab["style"]
      let padding = 8 + Math.min(Math.max((footerBB.width - 320) * 0.01, 0), 16)
      fabStyle.top = footerBB.y - fabBB.height - padding + 'px'
      fabStyle.right = padding + 'px'

      let cooldownBar = this.$refs.cooldownBar.$el
      let cbBB = cooldownBar.getBoundingClientRect()
      let cbStyle = cooldownBar["style"]
      cbStyle.top = footerBB.y - cbBB.height + 'px'
    }
  }
}
</script>

<style scoped>
#placePage {
  background: radial-gradient(ellipse, transparent 30%, rgba(0, 0, 0, 0.6) 100%),
    /*linear-gradient(transparent 60%, rgba(0, 0, 0, 0.75) 95%),*/ linear-gradient(rgba(100, 100, 100, 0.4), rgba(100, 100, 100, 0.4)),
  url('~@/assets/spawn-render.jpg') no-repeat right;
  background-size: cover;
  position: relative;
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
  height: calc(100% - 0px);
}

#selectedPixelDiv {
  position: absolute;
  display: none;
  pointer-events: none;
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
  pointer-events: none;
}

.map-marker {
  position: absolute;
  pointer-events: none;
  /*transform-origin: top center;*/
}

.map-marker-transition {
  transition: left 1.2s linear, top 1.2s linear; /*, transform 500ms linear;*/
}

.on-map-marker {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.outside-marker {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

@keyframes breathe {
  0% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.3);
  }
}

</style>

<style>

</style>