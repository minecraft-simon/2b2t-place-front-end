<template>
  <div>
    <v-overlay :value="speedDialOpened" z-index="1"></v-overlay>

    <v-speed-dial v-model="speedDialOpened" transition="slide-y-reverse-transition">
      <template v-slot:activator>
        <v-btn fab :small2="$vuetify.breakpoint.xs">
          <v-icon v-if="speedDialOpened">mdi-close</v-icon>
          <v-icon v-else>mdi-open-in-new</v-icon>
        </v-btn>
      </template>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small>
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span class="text-body-1 black--text">Mapart Download</span>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="#FF4500">
            <v-icon>mdi-reddit</v-icon>
          </v-btn>
        </template>
        <span class="text-body-1 black--text">Visit our Subreddit</span>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="#7289da">
            <v-icon>mdi-discord</v-icon>
          </v-btn>
        </template>
        <span class="text-body-1 black--text">Contact us on Discord</span>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark fab small>
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span class="text-body-1 black--text">View our code on GitHub</span>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="#9146FF">
            <v-icon>mdi-twitch</v-icon>
          </v-btn>
        </template>
        <span class="text-body-1 black--text">Spectate the bots on Twitch</span>
      </v-tooltip>

    </v-speed-dial>
  </div>
</template>

<script>
export default {
  name: "FloatingActionButton",
  data() {
    return {
      speedDialOpened: false,
      showTooltip: false
    }
  },
  watch: {
    speedDialOpened(newValue) {
      if (newValue) {
        let showTooltipsMethod = this.showTooltips
        setTimeout(showTooltipsMethod, 300)
      } else {
        this.showTooltip = false
      }
    }
  },
  mounted() {

  },
  methods: {
    showTooltips() {
      this.showTooltip = true
    }
  }
}
</script>

<style scoped>

.v-tooltip__content {
  pointer-events: initial !important;
  cursor: pointer;
}

</style>