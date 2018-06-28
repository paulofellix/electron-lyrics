import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {
    ApiKey
} from './apikey'

Vue.use(VueAxios, axios)

const apiKey = ApiKey

const app = new Vue({
    el: '#app',
    render: h => h(App)
})