import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './router/routes';
import { store } from './store/store';
import axios from 'axios';
import * as firebase from 'firebase';

Vue.use(VueRouter);

axios.defaults.baseURL = 'https://vegan-tauarlary.firebaseio.com/';

const router = new VueRouter({
  routes,
  mode: 'history'
});

var filter = function (text, length, clamp) {
  clamp = clamp || '...';
  var node = document.createElement('div');
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
      firebase.initializeApp({
        apiKey: "AIzaSyDgSqzhpJ310KCm780kdHVGqRCZHVawlUA",
        authDomain: "vegan-tauarlary.firebaseapp.com",
        databaseURL: "https://vegan-tauarlary.firebaseio.com",
        projectId: "vegan-tauarlary",
        storageBucket: "vegan-tauarlary.appspot.com",
      });
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch('autoSignIn', user)
        }
      })
      this.$store.dispatch('loadProducts');
  }
})
