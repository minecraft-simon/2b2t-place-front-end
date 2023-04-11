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


@font-face {
  font-family: "Minecraftia";
  src: url(./assets/fonts/Minecraftia.ttf) format("truetype");
}
</style>
