<template>
  <v-dialog v-model="dialogOpen" max-width="400">
    <v-card>
      <v-toolbar dark color="gray" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title>No Pixel Selected</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="py-4" fluid style="max-width: 380px">
        <div>You need to select a pixel before placing a color.</div>
        <div>Click or tap on the map to make a selection.</div>
        <div class="d-flex justify-center mt-4">
          <v-btn outlined @click="closeDialog">OK</v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SelectPixelDialog",
  data() {
    return {
      dialogOpen: false
    }
  },
  computed: {

  },
  mounted() {
    window.mitt.on("openSelectPixelDialog", () => {
      this.dialogOpen = true
    })
  },
  methods: {
    closeDialog() {
      this.dialogOpen = false
    }
  }
}
</script>

<style scoped>

</style>