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
        <div id="selectedPixelDiv" ref="selectedPixelDiv"></div>
        <div v-for="pos in 20" :key="pos" class="selection-highlight"></div>
      </div>
    </v-main>
    <PlaceFooter></PlaceFooter>
    <ColorChooserDialog></ColorChooserDialog>
  </div>
</template>

<script>
import mitt from "mitt";
import PlaceFooter from "@/components/PlaceFooter";
import Map from "@/components/Map";
import ColorChooserDialog from "@/components/ColorChooserDialog";

window.mitt = window.mitt || new mitt();

export default {
  name: "Place.vue",
  data() {
    return {
      instance: null,
      selectedPixelPos: null,
      canvasScale: 10,
      randomId: null,
      selectionHighlights: []
    }
  },
  components: {ColorChooserDialog, Map, PlaceFooter},
  mounted() {
    this.generateRandomId();
    this.initListeners();
    this.sendStatusUpdate();
  },
  methods: {
    initListeners() {
      this.$refs.clickReceiver.addEventListener("click", ev => {
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

      window.mitt.on("pixelSelected", pos => {
        this.selectedPixelPos = pos
        this.refreshOverlays();
      })
      window.mitt.on("colorClicked", color => {
        this.colorClicked(color)
      })
    },
    initPanZoom(instance) {
      this.instance = instance

    },
    generateRandomId() {
      let length = 32;
      let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      this.randomId = result
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
    },
    refreshOverlays() {
      // selected pixel
      let selectedPixelDiv = this.$refs.selectedPixelDiv;
      if (this.instance && this.selectedPixelPos) {
        let panZoomTransform = this.instance.getTransform()
        let scale = this.canvasScale * panZoomTransform["scale"]
        let x = panZoomTransform.x + this.selectedPixelPos.x * scale
        let y = panZoomTransform.y + this.selectedPixelPos.y * scale
        selectedPixelDiv.style.left = x + 'px';
        selectedPixelDiv.style.top = y + 'px';
        selectedPixelDiv.style.width = scale + 'px';
        selectedPixelDiv.style.height = scale + 'px';
        selectedPixelDiv.style.display = "block";
      } else {
        selectedPixelDiv.style.display = "none";
      }

      // highlights (only display 20 at a time)
      let highlightElements = document.getElementsByClassName("selection-highlight");
      for (let i = 0; i < highlightElements.length; i++) {
        let element = highlightElements[i]
        element.style.display = 'none'
      }

      for (let i = 0; i < this.selectionHighlights.length; i++) {
        let selection = this.selectionHighlights[i]
        let element = highlightElements[i]
        if (element) {
          let panZoomTransform = this.instance.getTransform()
          let scale = this.canvasScale * panZoomTransform["scale"]
          let x = panZoomTransform.x + selection.x * scale
          let y = panZoomTransform.y + selection.y * scale
          element.style.left = x + 'px';
          element.style.top = y + 'px';
          element.style.width = scale + 'px';
          element.style.height = scale + 'px';
          element.style.display = 'block'
        }
      }
    },
    sendStatusUpdate() {
      let statusUpdate = {
        userId: this.randomId,
        highlightPos: this.selectedPixelPos
      }
      this.$store.dispatch("putRequest", ["status", statusUpdate, this.statusUpdateCallback])
    },
    statusUpdateCallback(data) {
      let pollingTimeout = 1000
      if (data) {
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
        this.$store.dispatch("putRequest", ["pixel-grid", pixel, this.sendPixelCallback])
      } else {
        alert("No pixel selected")
      }
    },
    sendPixelCallback(pixel) {
      if (pixel) {
        window.mitt.emit("updatePixel", pixel)
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
  animation: breathe 1.5s ease-in-out infinite;

  background-color: rgba(255, 255, 255, 0.3);
  border: 3px dashed dimgray;
}

.selection-highlight {
  position: absolute;
  display: none;
  pointer-events: none;

  background-color: rgba(255, 255, 255, 0.3);
  border: 2px dashed dimgray;
}

@keyframes breathe {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>

<style>

</style>