<template>
  <div style="pointer-events: initial">
    <v-overlay :value="speedDialOpened" z-index="10"></v-overlay>

    <v-speed-dial v-model="speedDialOpened" transition="slide-y-reverse-transition" style="z-index: 11">
      <template v-slot:activator>
        <v-btn fab style="z-index: 11">
          <v-icon v-if="speedDialOpened">mdi-close</v-icon>
          <v-icon v-else>mdi-open-in-new</v-icon>
        </v-btn>
      </template>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small @click="externalTargetClicked('mapart')">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <div class="text-body-1 black--text" data-target="mapart">Download the Mapart</div>
      </v-tooltip>

      <!--
      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small @click="externalTargetClicked('reddit')">
            <v-icon color="#FF4500">mdi-reddit</v-icon>
          </v-btn>
        </template>
        <div class="text-body-1 black--text text-center" data-target="reddit"
             style="width: 154.86px; letter-spacing: 0.04em !important;">
          Visit our Subreddit
        </div>
      </v-tooltip> -->

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small @click="externalTargetClicked('discord')">
            <v-icon color="#7289da">mdi-discord</v-icon>
          </v-btn>
        </template>
        <div class="text-body-1 black--text" data-target="discord">Join our Discord server</div>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small @click="externalTargetClicked('github')">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <div class="text-body-1 black--text text-center" data-target="github"
             style="width: 193.85px">
          View our code on GitHub
        </div>
      </v-tooltip>

      <v-tooltip v-model="showTooltip" left color="#f5f5f5" transition="slide-x-reverse-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab small @click="externalTargetClicked('twitch')">
            <v-icon color="#9146FF">mdi-twitch</v-icon>
          </v-btn>
        </template>
        <div class="text-body-1 black--text" data-target="twitch">Spectate the bots on Twitch</div>
      </v-tooltip>

    </v-speed-dial>
  </div>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

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
        setTimeout(showTooltipsMethod, 400)
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
      process.nextTick(() => {
        this.initToolTipClickListeners()
      })
    },
    initToolTipClickListeners() {
      const tooltipElements = document.querySelectorAll('.v-tooltip__content')
      tooltipElements.forEach(el => el.addEventListener('click', () => {
        let div = el.querySelector('div')
        let target = div.dataset.target
        this.externalTargetClicked(target)
      }));
    },
    externalTargetClicked(target) {
      if (target === 'mapart') {
        window.mitt.emit("downloadMapArt")
        //console.log("emit")
        return
      }

      let url = null
      switch (target) {
        case 'twitch':
          url = "https://www.twitch.tv/rules_off";
          break
        case 'github':
          url = "https://github.com/minecraft-simon";
          break
        case 'discord':
          url = "https://discord.gg/AtkWp8DBtm";
          break
        case 'reddit':
          url = "https://www.google.com/";
          break
      }
      if (url) {
        window.open(url, '_blank').focus();
      }
    }
  }
}
</script>

<style scoped>
.v-tooltip__content {
  pointer-events: initial !important;
  cursor: pointer;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}
</style>