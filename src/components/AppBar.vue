<template>
  <v-app-bar app dark flat class="place-app-bar">
    <div class="d-flex align-center">
      <v-img class="" contain src="@/assets/logo.png" width="40"/>
      <v-img class="ml-2" contain height="36" max-width="160" src="@/assets/place.png"/>
    </div>

    <v-spacer></v-spacer>

    <v-btn
        class="d-none2 d-sm-inline-flex" text tile v-if="!(helpersHidden || hideSizeHelper)"
        v-on:click="hideSizeHelper = true">
      <span class="d-flex d-sm-none">XS</span>
      <span class="d-none d-sm-flex d-md-none">SM</span>
      <span class="d-none d-md-flex d-lg-none">MD</span>
      <span class="d-none d-lg-flex d-xl-none">LG</span>
      <span class="d-none d-xl-flex">XL</span>
    </v-btn>

    <div class="d-flex align-center player-head" @click="playerHeadClicked" style="min-width: 40px; min-height: 40px; background-color: grey">
      <v-img v-if="identity === null" class="" contain src="@/assets/steve.png" width="40"/>
      <v-img v-else class="skin-player-head" contain :src="playerHeadUrl" width="40"/>
    </div>

  </v-app-bar>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
  name: "AppBar",
  data: () => ({
    hideSizeHelper: false
  }),
  computed: {
    helpersHidden: function () {
      return process.env.NODE_ENV !== "development";
    },
    identity() {
      return this.$store.state.identity;
    },
    playerHeadUrl() {
      return "https://mc-heads.net/avatar/" + this.identity
    }
  },
  methods: {
    playerHeadClicked() {
      window.mitt.emit("openAuthenticationDialog")
    }
  }
}
</script>

<style scoped>
.place-app-bar {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.player-head {
  cursor: pointer;
  box-shadow: 0px 0px 4px 1px rgba(200, 200, 200, 0.8);
}

.skin-player-head {
  filter: saturate(0.9) brightness(0.9);
}
</style>