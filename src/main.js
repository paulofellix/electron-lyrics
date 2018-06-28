import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {
    apiKey as ApiKey
}
from './apikey';

const apiKey = ApiKey


Vue.use(VueAxios, axios)

const app = new Vue({
    el: '#app',
    render: h => h(App)
})