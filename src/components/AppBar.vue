<template>
  <v-app-bar app dark flat class="place-app-bar">
    <div class="d-flex align-center">
      <v-img class="" contain src="@/assets/2b2t.png" width="40"/>
      <v-img class="" contain height="36" max-width="120" src="@/assets/place.png"/>
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
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  data: () => ({
    hideSizeHelper: false
  }),
  computed: {
    helpersHidden: function () {
      return process.env.NODE_ENV !== "development";
    }
  }
}
</script>

<style scoped>
.place-app-bar {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>