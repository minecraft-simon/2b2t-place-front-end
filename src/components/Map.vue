<template>
  <div :style="divStyle" id="canvasContainer" ref="canvasContainer" class="interpolation-nn noselect">
    <img src="@/assets/map-background.png" id="mapBackground" ref="mapBackground" class="interpolation-nn">
    <canvas id="myCanvas" ref="myCanvas" :width="cols * cellSize" :height="rows * cellSize"
            class="interpolation-nn"></canvas>
  </div>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
  name: "Map",
  data() {
    return {
      rows: 128,
      cols: 128,
      cellSize: 10,
      colors: [
        "#cfd5d6", "#e06100", "#a9309f", "#2389c6",
        "#f1af15", "#5ea818", "#d5648e", "#36393d",
        "#7d7d73", "#157788", "#641f9c", "#2c2e8f",
        "#603b1f", "#495b24", "#8e2020", "#080a0f"
      ],
      canvasContext: null
    }
  },
  computed: {
    canvasWidth() {
      return this.cols * this.cellSize
    },
    canvasHeight() {
      return this.rows * this.cellSize
    },
    divStyle() {
      return {
        'width': this.cols * this.cellSize + 'px',
        'height': this.rows * this.cellSize + 'px'
      }
    }
  },
  mounted() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    this.canvasContext = ctx
    // draw chessboard pattern
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let color
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = "#f3f3f3";
        } else {
          ctx.fillStyle = "#fafafa";
        }
        ctx.fillStyle = color;
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    let canvasContainer = this.$refs.canvasContainer

    window.mitt.on("clickReceiverLocation", data => {
      let transform = canvasContainer.style.transform;
      transform = transform.replace("matrix(", "").replace(")", "")
      transform = transform.split(", ")
      let offsetX = transform[4]
      let offsetY = transform[5]
      let canvasX = Math.floor((data.x - offsetX) / transform[0] / this.cellSize)
      let canvasY = Math.floor((data.y - offsetY) / transform[0] / this.cellSize)

      if (canvasX < 0 || canvasX >= this.cols || canvasY < 0 || canvasY >= this.rows) {
        return
      }

      let pos = {
        x: canvasX,
        y: canvasY,
      }
      window.mitt.emit("pixelSelected", pos)
    });

    window.mitt.on("updatePixel", data => {
      this.drawPixel(data.x, data.y, data.color)
    })

    window.mitt.on("setPixelGrid", pixelString => {
      if (!this.canvasContext) return
      let ctx = this.canvasContext
      let s = this.cellSize
      let counter = 0
      for (let x = 0; x < this.cols; x++) {
        for (let y = 0; y < this.rows; y++) {
          let pixelColor = pixelString.charCodeAt(counter)
          if (pixelColor !== undefined && pixelColor < 16) {
            ctx.fillStyle = this.colors[pixelColor]
          } else {
            ctx.fillStyle = "white";
          }
          ctx.fillRect(x * s, y * s, s, s)
          counter++;
        }
      }
    })

    window.mitt.on("downloadMapArt", () => {
      this.downloadMapArt()
    })

    this.setBackgroundScale()
  },
  methods: {
    setBackgroundScale() {
      this.$refs.mapBackground.style.transform = "translate(-50%, -50%) translate(" + this.canvasWidth / 2 + "px, " + this.canvasHeight / 2 + "px) scale(" + this.cellSize * 0.88 + ")";
    },
    drawPixel(x, y, color) {
      let ctx = this.canvasContext
      let s = this.cellSize
      ctx.fillStyle = this.colors[color]
      ctx.fillRect(x * s, y * s, s, s)
    },
    downloadMapArt() {
      let canvas = document.getElementById("myCanvas")
      let image = canvas.toDataURL()
      let downloadLink = document.createElement('a')
      downloadLink.download = 'our_place_mapart.png'
      downloadLink.href = image
      downloadLink.click()
    }
  }
}
</script>

<style scoped>
#canvasContainer {
  position: relative;
}

#mapBackground {
  position: absolute;
  /*transform: translate(-16px, -16px) scale(0.88);*/
  /*transform: translate(-50%, -50%);*/
}

#myCanvas {
  /*transform: translate(-50%, -50%) scale(0.1) translate(50%, 50%);*/
  position: absolute;
  top: 0;
  left: 0;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

</style>

<style>
.vue-pan-zoom-scene {
  height: 100%;
}

</style>