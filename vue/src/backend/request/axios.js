/* global localStorage */
import axios from 'axios';

export default axios.create({
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
  install(Vue) {
    Vue.mixin({
      data() {
        return {
        };
      }
    });
    Object.defineProperty(Vue.prototype, '$helper', {
      get() {
      },
    });
  },
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': "application/json",
    'Access-Control-Allow-Origin': '*'
  },
});
