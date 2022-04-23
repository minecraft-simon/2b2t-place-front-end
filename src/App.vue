<template>
  <v-app>
    <AppBar></AppBar>
    <router-view/>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar";

export default {
  name: 'App',
  components: {AppBar},
  data: () => ({
    hideSizeHelper: false
  }),
  mounted() {
    const $body = document.querySelector('body');
    let scrollPosition = 0;
    scrollPosition = window.pageYOffset;
    $body.style.overflow = 'hidden';
    $body.style.position = 'fixed';
    $body.style.top = `-${scrollPosition}px`;
    $body.style.width = '100%';
  },
  methods: {}
};
</script>

<style>
body {
  overflow: hidden;
}

.interpolation-nn {
  /* IE, only works on <img> tags */
  /*-ms-interpolation-mode: nearest-neighbor;*/
  /* Firefox */
  /*image-rendering: crisp-edges;*/
  /* Chromium + Safari */
  image-rendering: pixelated;
}


@font-face {
  font-family: "Minecraftia";
  src: url(./assets/fonts/Minecraftia.ttf) format("truetype");
}
</style>
