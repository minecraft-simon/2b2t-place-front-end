<template>
    <v-app-bar app dark class="place-app-bar">
        <div class="d-flex align-center">
            <v-img class="elevation-1-drop-shadow" contain src="@/assets/logo_rounded.png" width="40"/>
            <v-img class="ml-3 elevation-1-drop-shadow" contain max-height="40" max-width="165" src="@/assets/place.svg"/>
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

        <div class="d-flex align-center player-head elevation-1-drop-shadow" @click="playerHeadClicked">
            <v-img v-if="identity === null" class="" contain src="@/assets/steve.png" width="40"/>
            <v-img v-else class="skin-player-head" contain :src="playerHeadUrl" width="40"/>
        </div>

    </v-app-bar>
</template>

<script>
import mitt from "mitt";

window.mitt = window.mitt || new mitt();

export default {
    name: "AppBar",
    data: () => ({
        hideSizeHelper: false
    }),
    computed: {
        helpersHidden: function () {
            return process.env.NODE_ENV !== "development";
        },
        identity() {
            return this.$store.state.identity;
        },
        playerHeadUrl() {
            return "https://mc-heads.net/avatar/" + this.identity
        }
    },
    methods: {
        playerHeadClicked() {
            window.mitt.emit("openAuthenticationDialog")
        }
    }
}
</script>

<style>

</style>

<style scoped>
.place-app-bar {
    background-color: rgba(0, 0, 0, 0.5) !important;
}

.player-head {
    cursor: pointer;
    min-width: 40px;
    min-height: 40px;
    border-radius: 4px;
    /*box-shadow: 0px 0px 4px 1px rgba(200, 200, 200, 0.8);*/
}

.player-head div {
    border-radius: 4px;
}


.skin-player-head {
    filter: saturate(0.9) brightness(0.9);
}
</style>