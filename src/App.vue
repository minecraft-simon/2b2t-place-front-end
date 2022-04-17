<template>
  <v-app>
    <v-app-bar
      app
      color="transparent"
      dark
      flat
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          class="d-none2 d-sm-inline-flex" text tile v-if="!hideSizeHelper" v-on:click="hideSizeHelper = true">
        <span class="d-flex d-sm-none">XS</span>
        <span class="d-none d-sm-flex d-md-none">SM</span>
        <span class="d-none d-md-flex d-lg-none">MD</span>
        <span class="d-none d-lg-flex d-xl-none">LG</span>
        <span class="d-none d-xl-flex">XL</span>
      </v-btn>
    </v-app-bar>
    <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',

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
  methods: {

  }
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

</style>
