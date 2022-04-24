<template>
  <v-dialog v-model="dialogOpen" max-width="400" :fullscreen="fullscreen">
    <v-card>
      <v-toolbar dark color="gray" @click="closeDialog">
        <v-spacer></v-spacer>
        <v-toolbar-title v-text="identity === null ? 'Authentication Required' : 'Authenticated'"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="pt-4 pt-sm-4 pb-8" fluid :style="'max-width: 320px; ' + (contentHidden ? 'opacity: 0' : 'opacity: 1')">
        <div v-if="identity === null">
          <div class="text-body-1">
            In order to place pixels you need to link your Minecraft username. No e-mail-address or password required!
          </div>

          <div class="text-h6 text-center mt-2">How to authenticate?</div>

          <div class="text-body-2 mt-2" style="text-decoration: underline">Step 1:</div>
          <div class="text-body-1">Connect to the Minecraft server <strong>2b2t.org</strong> with Minecraft version
            1.12.2
          </div>
          <v-img src="@/assets/2b2t-domain.png" class="mt-2" contain width="296" height="48"></v-img>

          <div class="text-body-2 mt-4" style="text-decoration: underline">Step 2:</div>

          <div v-if="pendingAuthExpired">
            <div class="text-body-1">Your auth code has expired. Please request a new one.</div>
            <v-btn small block outlined class="mt-1" @click="requestAuthCode">Request new auth code</v-btn>
          </div>
          <div v-else-if="!(authCode && botName)">
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
            <div class="text-body-1">That's it! As soon as our bot receives your message, you can start placing pixels!
            </div>
            <div class="d-flex flex-row align-center justify-center mt-5">
              <v-progress-circular indeterminate color="grey darken-2" width="2" size="20"></v-progress-circular>
              <div class="text-body-1 ml-3">Waiting for your message...</div>
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn outlined @click="closeDialog">Cancel</v-btn>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="d-flex flex-column align-center mt-2">
            <div class="logged-in-text">You are logged in as:</div>
            <v-img :src="playerSkinUrl" class="mt-5 player-skin" height="200" contain></v-img>
            <div v-text="identity" class="player-name mt-5"></div>
          </div>
          <div class="d-flex flex-row mt-10">
            <v-btn outlined class="mr-2" color="red darken-3" :loading="loggingOut" @click="logOut">Log out</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-3" dark @click="dialogOpen = false">Continue</v-btn>
          </div>
        </div>

      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {useSound} from '@vueuse/sound';
import authSoundFile from '@/assets/sounds/auth-success.mp3';
import logOutSoundFile from '@/assets/sounds/log-out.mp3';
import mitt from "mitt";
import Vue from "vue";
import { ref, reactive } from '@vue/composition-api'

window.mitt = window.mitt || new mitt();

export default {
  name: "AuthenticationDialog",
  data() {
    return {
      dialogOpen: false,
      authCode: null,
      botName: null,
      pendingAuthExpired: false,
      pendingAuthExpiredTimeout: null,
      loggingOut: true,
      contentHidden: false
    }
  },
  computed: {
    fullscreen() {
      return this.$vuetify.breakpoint.xs
    },
    sessionId() {
      return this.$store.state.sessionId;
    },
    identity() {
      return this.$store.state.identity;
    },
    playerSkinUrl() {
      return "https://mc-heads.net/player/" + this.identity
    }
  },
  setup() {
    const volume = ref(1)
    const authSound = useSound(authSoundFile, {volume})
    const logOutSound = useSound(logOutSoundFile, {volume})

    const preloadSounds = () => {
      volume.value = 0.01
      authSound.play()
      logOutSound.play()
      setTimeout(resetVolume, 700)
    }

    const resetVolume = () => {
      volume.value = 1
      authSound.stop()
      logOutSound.stop()
    }

    return {
      authSound, logOutSound, preloadSounds
    }
  },
  mounted() {
    window.mitt.on("openAuthenticationDialog", () => {
      this.contentHidden = false
      this.dialogOpen = true
      this.loggingOut = false
      if (this.identity === null) {
        this.requestAuthCode();
      }
    })
  },
  watch: {
    identity(value) {
      if (value != null) {
        this.authSound.play();
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialogOpen = false
    },
    requestAuthCode() {
      this.authCode = null
      this.botName = null
      this.pendingAuthExpired = false
      this.$store.dispatch("postRequest", ["authentication/request-auth-code/" + this.sessionId, null, this.requestAuthCodeCallback])
      this.preloadSounds()
    },
    requestAuthCodeCallback(data) {
      if (data) {
        this.authCode = data["authCode"];
        this.botName = "minecraft_simon";
        let expirySeconds = data["expirySeconds"];
        // start timeout to show expiry of auth code
        let pendingAuthExpiredFunc = this.setPendingAuthExpired
        clearTimeout(this.pendingAuthExpiredTimeout)
        this.pendingAuthExpiredTimeout = setTimeout(function () {
          pendingAuthExpiredFunc(true)
        }, expirySeconds * 1000);
      } else {
        // TODO
      }
    },
    setPendingAuthExpired(value) {
      this.pendingAuthExpired = value
    },
    logOut() {
      Vue.$cookies.remove("2b2t-our-place-identity");
      Vue.$cookies.remove("2b2t-our-place-token");
      this.$store.dispatch("deleteRequest", ["authentication/invalidate-pending-auth/" + this.sessionId, this.logOutCallback])
      this.loggingOut = true
    },
    logOutCallback() {
      setTimeout(this.logOutConfirm, 500);
    },
    logOutConfirm() {
      this.logOutSound.play();
      this.$store.dispatch("updateIdentityAndAuthToken", [null, null])
      this.contentHidden = true
      this.dialogOpen = false
      this.loggingOut = false
    },
    playSoundTest() {
      this.authSound.play()
    }
  }
}
</script>

<style scoped>
.full-width-dialog {
  margin-left: 0;
  margin-right: 0;
}
.text-highlight {
  font-size: 14pt;
  font-weight: bolder;
}
.logged-in-text {
  font-size: 14pt;
}

.player-name {
  /*background-color: grey;
  color: white; */
  /*font-family: "Minecraftia", "Roboto", sans-serif;*/

  font-size: 18pt;
  /*line-height: 1.2;
  padding: 5px 4px; */
}
.player-skin {
  /*-webkit-filter: drop-shadow(5px 5px 5px #222);*/
  filter: drop-shadow(2px 2px 4px #222);
}
</style>