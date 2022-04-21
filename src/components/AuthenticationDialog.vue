<template>
  <v-dialog v-model="dialogOpen" max-width="400" :fullscreen="fullscreen"
            :transition="fullscreen ? 'dialog-bottom-transition' : 'dialog-transition'">
    <v-card>
      <v-toolbar dark color="gray" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title>Authentication</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="pt-4 pt-sm-8 pb-12" fluid style="max-width: 320px">
        <div class="text-body-1">
          In order to place pixels you need to link your Minecraft username. No e-mail-address or password required!
        </div>

        <div class="text-h6 text-center mt-2">How to authenticate?</div>

        <div class="text-body-2 mt-2" style="text-decoration: underline">Step 1:</div>
        <div class="text-body-1">Connect to the Minecraft server <strong>2b2t.org</strong> with Minecraft version 1.12.2
        </div>
        <v-img src="@/assets/2b2t-domain.png" class="mt-2" contain width="296" height="48"></v-img>

        <div class="text-body-2 mt-4" style="text-decoration: underline">Step 2:</div>

        <div v-if="!authCode && botName">
          <div class="d-flex flex-row align-start justify-center2 mt-1">
            <v-progress-circular indeterminate color="grey darken-2" width="2" size="20"></v-progress-circular>
            <div class="text-body-1 ml-3">Generating auth code...</div>
          </div>
        </div>
        <div v-else>
          <div class="text-body-1">
            Whisper
            <span v-text="authCode" class="text-highlight"></span>
            to the player
            <span v-text="botName" class="text-highlight"></span>
            using this command:
          </div>
          <div>/whisper {{ botName + " " + authCode }}</div>

          <div class="text-body-2 mt-4" style="text-decoration: underline">Step 3:</div>
          <div class="text-body-1">That's it! As soon as our bot receives your message, you can start placing pixels!</div>
          <div class="d-flex flex-row align-center justify-center mt-5">
            <v-progress-circular indeterminate color="grey darken-2" width="2" size="20"></v-progress-circular>
            <div class="text-body-1 ml-3">Waiting for your message...</div>
          </div>
        </div>

      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
  name: "AuthenticationDialog",
  data() {
    return {
      dialogOpen: false,
      authCode: null,
      botName: null
    }
  },
  mounted() {
    window.mitt.on("openAuthenticationDialog", () => {
      this.dialogOpen = true
      this.authCode = null
      this.botName = null
      this.requestAuthCode();
    })
  },
  computed: {
    fullscreen() {
      return this.$vuetify.breakpoint.xs
    },
    sessionId() {
      return this.$store.state.sessionId;
    }
  },
  methods: {
    closeDialog() {
      this.dialogOpen = false
    },
    requestAuthCode() {
      this.$store.dispatch("postRequest", ["authentication/request-auth-code/" + this.sessionId, null, this.requestAuthCodeCallback])
    },
    requestAuthCodeCallback(data) {
      if (data) {
        this.authCode = data["authCode"];
        this.botName = "minecraft_simon";
      }
    }
  }
}
</script>

<style scoped>
.text-highlight {
  font-size: 14pt;
  font-weight: bolder;
}
</style>