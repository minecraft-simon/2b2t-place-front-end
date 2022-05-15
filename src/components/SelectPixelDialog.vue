<template>
  <v-dialog v-model="dialogOpen" max-width="420">
    <v-card>
      <v-toolbar dark color="gray" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title>No Pixel Selected</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="py-4" fluid style="max-width: 400px">
        <div class="text-body-1">You need to select a pixel before placing a color.</div>
        <div class="text-body-1">Click or tap on the map to make a selection.</div>
        <div class="d-flex justify-center mt-4">
          <v-btn dark color="grey darken-3" @click="closeDialog">OK</v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {useSound} from '@vueuse/sound';
import noAuthSoundFile from '@/assets/sounds/no-auth.mp3';
import mitt from "mitt";
import {ref} from "@vue/composition-api";
import authSoundFile from "@/assets/sounds/auth-success.mp3";
import logOutSoundFile from "@/assets/sounds/log-out.mp3";
import menuCloseSoundFile from "@/assets/sounds/menu-close.mp3";

window.mitt = window.mitt || new mitt();

export default {
  name: "SelectPixelDialog",
  data() {
    return {
      dialogOpen: false
    }
  },
  computed: {

  },
  setup() {
    const noAuthSound = useSound(noAuthSoundFile)
    return {
      noAuthSound
    }
  },
  mounted() {
    window.mitt.on("openSelectPixelDialog", () => {
      this.dialogOpen = true
      this.noAuthSound.play()
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