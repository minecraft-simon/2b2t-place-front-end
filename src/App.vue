<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data: () => ({
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
  methods: {

  }
};
</script>

<style>
html {
  overflow-y: hidden !important;
}

body {
  overflow: hidden;
}

.interpolation-nn {
  image-rendering: pixelated;
}

.vue-pan-zoom-scene {
  outline: none;
}

.elevation-1-drop-shadow {
    filter: drop-shadow(0px 2px 1px rgba(0, 0, 0, 0.2)) drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.14)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.12)) !important;
}

@font-face {
  font-family: "Minecraftia";
  src: url(./assets/fonts/Minecraftia.ttf) format("truetype");
}
</style>
