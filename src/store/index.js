import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

export default new Vuex.Store({
    state: {
        sessionId: null
    },
    mutations: {
        setSessionId(state, sessionId) {
            state.sessionId = sessionId;
        }
    },
    actions: {
        generateSessionId({commit}) {
            let length = 32;
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
            axios.put("/" + endpoint, data, {timeout: 5000})
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
        }
    },
    modules: {}
})
