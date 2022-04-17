import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {
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
            axios.put("/" + endpoint, data, { timeout: 5000 })
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
    },
    modules: {}
})
