import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

export default new Vuex.Store({
    state: {
        sessionId: null,
        identity: null,
        authToken: null,
        cooldownSecondsLeft: 0,
        cooldownActive: false,
        availableChatBots: {},
        cloudflareBlock: false
    },
    mutations: {
        setSessionId(state, sessionId) {
            state.sessionId = sessionId;
        },
        setIdentity(state, identity) {
            state.identity = identity
        },
        setAuthToken(state, authToken) {
            state.authToken = authToken
        },
        resetIdentity(state) {
            Vue.$cookies.remove("2b2t-our-place-identity")
            Vue.$cookies.remove("2b2t-our-place-token")
            state.identity = null
            state.authToken = null
            axios.defaults.headers.common["Authorization"] = null;
        },
        setCloudflareBlock(state, cloudflareBlock) {
            state.cloudflareBlock = cloudflareBlock
        }
    },
    actions: {
        loadCookies({commit}) {
            let identity = Vue.$cookies.get("2b2t-our-place-identity");
            let authToken = Vue.$cookies.get("2b2t-our-place-token");
            if (identity !== null && identity !== "null" && authToken !== null && authToken !== "null") {
                commit("setIdentity", identity)
                commit("setAuthToken", authToken)
                axios.defaults.headers.common["Authorization"] = authToken;
            }
        },
        saveCookies({commit, state}) {
            let identity = state.identity
            let authToken = state.authToken
            if (identity !== null && authToken !== null) {
                Vue.$cookies.set("2b2t-our-place-identity", identity, -1);
                Vue.$cookies.set("2b2t-our-place-token", authToken, -1);
            }
        },
        deleteCookies({commit}) {
            Vue.$cookies.remove("2b2t-our-place-identity");
            Vue.$cookies.remove("2b2t-our-place-token");
        },
        updateIdentityAndAuthToken({commit}, [identity, authToken]) {
            commit("setIdentity", identity)
            commit("setAuthToken", authToken)
            axios.defaults.headers.common["Authorization"] = authToken;

        },
        generateSessionId({commit}) {
            let length = 64;
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = '';
            for (let i = length; i > 0; --i) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            commit("setSessionId", result)
        },
        getRequest({commit}, [endpoint, callback]) {
            axios.get("/" + endpoint)
                .then(response => {
                    if (callback) {
                        callback(response.data)
                    }
                })
                .catch(reason => {

                });
        },
        putRequest({commit}, [endpoint, data, callback]) {
            axios.put("/" + endpoint, data, {timeout: 10000})
                .then(response => {
                    commit("setCloudflareBlock", false)
                    if (callback) {
                        callback(response.data);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 401 && endpoint === "status") {
                        commit("resetIdentity")
                    }
                    if (error.response && error.response.status === 403 && error.response.data.includes("We are checking your browser")) {
                        commit("setCloudflareBlock", true)
                    }
                    if (callback) {
                        callback(null);
                    }
                });
        },
        postRequest({commit}, [endpoint, data, callback]) {
            axios.post("/" + endpoint, data)
                .then(response => {
                    if (callback) {
                        callback(response.data);
                    }
                })
                .catch(reason => {
                    if (callback) {
                        callback(null);
                    }
                });
        },
        deleteRequest({commit}, [endpoint, callback]) {
            axios.delete("/" + endpoint)
                .then(response => {
                    if (callback) {
                        callback(response.data);
                    }
                })
                .catch(reason => {
                    if (callback) {
                        callback(null);
                    }
                });
        }
    },
    modules: {}
})
