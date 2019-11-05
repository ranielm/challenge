import http from '../request/http';
import axios from 'axios';
import store from '../store';
const qs = require('querystring')

const user = {

  obtainRefreshToken(user_id) {
    return http.postt(store.getters.getRoutes.user.get + '/' + user_id.toString());
  },

  post(body) {
    return http.post(store.getters.getRoutes.user, body);
  },

  requestRefreshAndAccessTokens(code, clientIdSecretBase64, redirectUri) {
  
    const requestBody = {
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code
    };

    const config = {
        headers: {
            'Authorization': 'Basic ' + clientIdSecretBase64,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': "*/*",
            "Access-Control-Allow-Origin": "*"
        }
    };

    return axios
      .post("https://cors-anywhere.herokuapp.com/" + "https://accounts.spotify.com/api/token", qs.stringify(requestBody),  config)
      .then(result => {        
        return result.data;
      })
  },

  putResetPassword(password) {
    return http.put(store.getters.getRoutes.user + "/change-password", encodeURIComponent(btoa(password)));
  },

  token() {
    return http.get(store.getters.getRoutes.token);
  },

  login() {
    const data = {
      locale: "adasdsa",
      username: "asdada"
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    return axios
      .get("http://localhost:8888/login", data, config)
      .then(result => {
        return result.data;
      })
  },

};
export default user;
