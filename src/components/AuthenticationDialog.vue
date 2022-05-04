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
      <v-container class="pt-4 pt-sm-4 pb-8" fluid
                   :style="'max-width: 320px; ' + (contentHidden ? 'opacity: 0' : 'opacity: 1')">
        <div v-if="identity === null">
          <div class="text-body-1">
            In order to place pixels you need to link your Minecraft username. No e-mail-address or password required!
          </div>

          <div class="text-h6 text-center mt-2">How to authenticate?</div>

          <div v-if="authenticationServer === null" class="mt-2">
            <div class="text-body-1">
              It's simple! Just connect to one of the following Minecraft servers and message one of our bots!
            </div>
            <div class="d-flex align-center justify-center mt-3">
              <v-icon color="black" small>mdi-arrow-down</v-icon>
              <div class="text-body-2 text-center mx-2">
                Click on your preferred server
              </div>
              <v-icon color="black" small>mdi-arrow-down</v-icon>
            </div>

            <div class="d-flex flex-row pa-1 mt-4 server-element"
                 style="background-color: black; border: 2px solid #808080"
                 @click="selectAuthServer('archive')">
              <v-img src="@/assets/auth-servers/archive-logo.png" max-width="64" height="64" contain></v-img>
              <div class="d-flex flex-column flex-grow-1 pl-2 pt-1">
                <v-img src="@/assets/auth-servers/archive-domain.png" max-width="164" max-height="14" contain></v-img>
                <v-img src="@/assets/auth-servers/Minecraft-via.png" class="mt-2" max-width="180" max-height="14"
                       contain></v-img>
                <v-img src="@/assets/auth-servers/No-queue.png" class="mt-1" max-width="90" max-height="16"
                       contain></v-img>
              </div>
            </div>

            <div class="d-flex flex-row pa-1 mt-3 server-element"
                 style="background-color: black; border: 2px solid #808080"
                 @click="selectAuthServer('2b2t')">
              <v-img src="@/assets/auth-servers/2b2t-logo.png" max-width="64" height="64" contain></v-img>
              <div class="d-flex flex-column flex-grow-1 pl-2 pt-1">
                <v-img src="@/assets/auth-servers/2b2t-domain.png" max-width="82" max-height="16" contain
                       style="margin-bottom: -2px"></v-img>
                <v-img src="@/assets/auth-servers/Minecraft-1-12-2.png" class="mt-2" max-width="156" max-height="14"
                       contain></v-img>
                <v-img src="@/assets/auth-servers/Queue.png" class="mt-1" max-width="58" max-height="14"
                       contain></v-img>
              </div>
            </div>

            <div class="grey--text text--darken-3 text-caption mt-2 text-center">
              Note: all pixels will be placed on 2b2t, no matter which server you choose for authentication
            </div>

          </div>
          <div v-else>
            <div class="text-body-2 mt-2" style="text-decoration: underline">Step 1:</div>
            <div class="text-body-1">
              <span>Connect to the Minecraft server </span>
              <span v-if="authenticationServer === 'archive'" class="font-weight-medium">thearchive.world</span>
              <span v-if="authenticationServer === '2b2t'" class="font-weight-medium">2b2t.org</span>
              <span v-if="authenticationServer === '2b2t'"> with Minecraft version 1.12.2</span>
            </div>
            <v-img v-if="authenticationServer === 'archive'" src="@/assets/auth-servers/archive-address.png"
                   class="mt-2" contain></v-img>
            <v-img v-if="authenticationServer === '2b2t'" src="@/assets/auth-servers/2b2t-address.png"
                   class="mt-2" contain></v-img>

            <div class="text-body-2 mt-4" style="text-decoration: underline">Step 2:</div>

            <div v-if="pendingAuthExpired">
              <div class="text-body-1">Your authentication-code has expired. Please request a new one.</div>
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
              <div class="auth-command text-body-1 mt-1">/whisper {{ botName + " " + authCode }}</div>

              <div class="text-body-2 mt-4" style="text-decoration: underline">Step 3:</div>
              <div class="text-body-1">That's it! As soon as our bot receives your message, you can start placing
                pixels!
              </div>
              <div class="d-flex flex-row align-center justify-center mt-5">
                <v-progress-circular indeterminate color="grey darken-2" width="2" size="20"></v-progress-circular>
                <div class="text-body-1 ml-3">Waiting for your message...</div>
              </div>
              <div class="d-flex justify-center mt-6">
                <v-btn small outlined @click="closeDialog">Cancel</v-btn>
              </div>
            </div>

            <!-- begin: having trouble? discord! -->
            <div class="text-center grey--text text--darken-2 mt-5">Having trouble authenticating?</div>
            <div class="d-flex justify-center">
              <a href="https://discord.gg/AtkWp8DBtm" target="_blank" class="grey--text text--darken-3">
                <div class="d-flex align-baseline">
                  <div>
                    <v-icon small color="#7289da" class="mr-1">mdi-discord</v-icon>
                  </div>
                  <div>Contact us on Discord!</div>
                </div>
              </a>
            </div>
            <!-- end: having trouble? discord! -->

          </div>

        </div>

        <div v-else>
          <div class="d-flex flex-column align-center mt-2">
            <div class="logged-in-text">You are logged in as:</div>
            <v-img :src="playerSkinUrl" class="mt-5 player-skin" height="200" contain></v-img>
            <div v-text="identity" class="player-name mt-5"></div>
          </div>
          <div class="">
            <v-checkbox color="black" hide-details v-model="rememberInitiallyChecked" @change="checkboxChanged">
              <template v-slot:label>
                <div class="black--text text-body-1">Remember this browser</div>
              </template>
            </v-checkbox>
            <div class="grey--text text--darken-2 text-caption mt-1">
              The feature "Remember this browser" uses cookies to store your session info, so you won't have to
              authenticate everytime you visit this page.
            </div>
          </div>
          <div class="d-flex flex-row mt-8">
            <v-btn small outlined class="mr-2" color="red darken-3" :loading="loggingOut" @click="logOut">Log out
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn small color="grey darken-3" dark @click="dialogOpen = false">Continue</v-btn>
          </div>
        </div>

      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {useSound} from '@vueuse/sound';
import menuOpenFile from '@/assets/sounds/menu-open.mp3';
import authSoundFile from '@/assets/sounds/auth-success.mp3';
import logOutSoundFile from '@/assets/sounds/log-out.mp3';
import mitt from "mitt";
import Vue from "vue";
import {ref, reactive} from '@vue/composition-api'

window.mitt = window.mitt || new mitt();

export default {
  name: "AuthenticationDialog",
  data() {
    return {
      dialogOpen: false,
      authenticationServer: null,
      authCode: null,
      botName: null,
      pendingAuthExpired: false,
      pendingAuthExpiredTimeout: null,
      loggingOut: true,
      contentHidden: false,
      rememberInitiallyChecked: false
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
    const menuOpenSound = useSound(menuOpenFile)
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
      menuOpenSound, authSound, logOutSound, preloadSounds
    }
  },
  mounted() {
    if (this.identity !== null) {
      this.rememberInitiallyChecked = true;
    }
    window.mitt.on("openAuthenticationDialog", () => {
      this.contentHidden = false
      this.authenticationServer = null
      this.dialogOpen = true
      this.loggingOut = false
      this.menuOpenSound.play();
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
    selectAuthServer(server) {
      this.authenticationServer = server
      this.requestAuthCode();
    },
    requestAuthCode() {
      this.authCode = null
      this.botName = null
      this.pendingAuthExpired = false
      let payload = {
        sessionId: this.sessionId,
        authServer: this.authenticationServer
      }
      this.$store.dispatch("postRequest", ["authentication/request-auth-code", payload, this.requestAuthCodeCallback])
      this.preloadSounds()
    },
    requestAuthCodeCallback(data) {
      if (data) {
        this.authCode = data["authCode"];
        this.botName = data["botName"];
        let expirySeconds = data["expirySeconds"];
        // start timeout to show expiry of auth code
        let pendingAuthExpiredFunc = this.setPendingAuthExpired
        clearTimeout(this.pendingAuthExpiredTimeout)
        this.pendingAuthExpiredTimeout = setTimeout(function () {
          pendingAuthExpiredFunc(true)
        }, (expirySeconds - 3) * 1000);
      } else {
        // TODO
      }
    },
    setPendingAuthExpired(value) {
      this.pendingAuthExpired = value
    },
    logOut() {
      this.$store.dispatch("deleteCookies")
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
      this.rememberInitiallyChecked = false
      this.dialogOpen = false
      this.loggingOut = false
    },
    checkboxChanged(value) {
      if (value) {
        this.$store.dispatch("saveCookies")
      } else {
        this.$store.dispatch("deleteCookies")
      }
    }
  }
}
</script>

<style scoped>
.server-element {
  cursor: pointer;
  filter: drop-shadow(1px 1px 2px #222);
}

.server-element:hover {
  filter: contrast(0.9) brightness(1.2) drop-shadow(2px 2px 4px #222);
}

.text-highlight {
  font-size: 14pt;
  font-weight: bolder;
}

.logged-in-text {
  font-size: 14pt;
}

.auth-command {
  background-color: #333333;
  color: white;
  padding: 2px 0 2px 4px;
  font-size: 13pt !important;
  font-family: monospace !important;
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