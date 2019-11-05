import store from '../backend/store';
import Token from "src/backend/models/Token.js";
import router from 'src/routes/router.js';

export function whereShouldIPoint() {

  if (window.location.hostname) {
    let URL = 'https://' + window.location.hostname;

    if (window.location.hostname === store.getters.getBackend.frontLocalhost) {
      store.commit(
        "setBackend",
        store.getters.getBackend.local
      );
    }

    else if (window.location.hostname === store.getters.getBackend.frontDev) {
      store.commit(
        "setBackend",
        store.getters.getBackend.development
      );
    }

    else {
      store.commit(
        'setBackend',
        `${URL}/back`
      );
    }

  }
}

export function getAllUrlParams() {  
  if (window.location.hostname) {
    // store.commit("setHREF", window.location.href);
    let url = window.location.href;
    var queryString = url ?
      url.split("?")[1] :
      window.location.search.slice(1);
    var obj = {};        
    if (queryString) {      
      queryString = queryString.split("#")[0];
      var arr = queryString.split("&");
      for (var i = 0; i < arr.length; i++) {
        var a = arr[i].split("=");
        var paramNum = undefined;
        var paramName = a[0].replace(/\[\d*\]/, function (v) {
          paramNum = v.slice(1, -1);
          return "";
        });
        var paramValue = typeof a[1] === "undefined" ? true : a[1];
        if (obj[paramName]) {
          if (typeof obj[paramName] === "string") {
            obj[paramName] = [obj[paramName]];
          }
          if (typeof paramNum === "undefined") {
            obj[paramName].push(paramValue);
          } else {
            obj[paramName][paramNum] = paramValue;
          }
        } else {
          obj[paramName] = paramValue;
        }
      }
    }
    // store.commit("setParamsURL", obj);    
    for (var key in obj) {           
      if (obj.hasOwnProperty(key)) store.commit("setIsEmpty", false);
      else store.commit("setIsEmpty", false);
    }        
    if (localStorage.getItem('w7yfbIUaAPsdPPN8mneM') && localStorage.getItem('IetE5EUk3MmpJbLljgBj') && localStorage.getItem('xtDCARAm5e0D9kH4odfi')){      
      var CryptoJS = require("crypto-js");

      // CLIENT ID DECODED      
      var w7yfbIUaAPsdPPN8mneMdecryptedBytes = CryptoJS.AES.decrypt(localStorage.getItem('w7yfbIUaAPsdPPN8mneM'), "jsk9SdF4TwsdlIbD5ciu");
      var w7yfbIUaAPsdPPN8mneM = w7yfbIUaAPsdPPN8mneMdecryptedBytes.toString(CryptoJS.enc.Utf8);

      // CLIENT SECRET DECODED    
      var IetE5EUk3MmpJbLljgBjdecryptedBytes = CryptoJS.AES.decrypt(localStorage.getItem('IetE5EUk3MmpJbLljgBj') , "5ZBh9NRdnNIM6sMOMRIh");
      var IetE5EUk3MmpJbLljgBj = IetE5EUk3MmpJbLljgBjdecryptedBytes.toString(CryptoJS.enc.Utf8);
      
      // REDIRECT URI DECODED      
      var xtDCARAm5e0D9kH4odfidecryptedBytes = CryptoJS.AES.decrypt(localStorage.getItem('xtDCARAm5e0D9kH4odfi'), "D1AoAbs64QqzqsXq6oKj");
      var reditectUri = xtDCARAm5e0D9kH4odfidecryptedBytes.toString(CryptoJS.enc.Utf8);
      
      // CODE CODED AND DECODED
      if (Object.values(obj)[0]) {        
        var code = Object.values(obj)[0]
        var D52rWcke3WtgTMUI6ZEz = CryptoJS.AES.encrypt(code, "2SxzC9DPRMxWExBFOtBI");
        localStorage.setItem("D52rWcke3WtgTMUI6ZEz", D52rWcke3WtgTMUI6ZEz);          
        store.commit("setCode", code);
        var clientIdSecretBase64 = btoa(w7yfbIUaAPsdPPN8mneM + ":" + IetE5EUk3MmpJbLljgBj);        
        Token.requestRefreshAndAccessTokens(code, clientIdSecretBase64, reditectUri)
          .then(result => {           
            var NHsqXAQ07bZ0FAyUPLHK = CryptoJS.AES.encrypt(result.access_token, "Br8saUZX9k723tq6tuLC");
            localStorage.setItem("NHsqXAQ07bZ0FAyUPLHK", NHsqXAQ07bZ0FAyUPLHK);          
            localStorage.setItem("token", result.access_token);          
            localStorage.setItem("refresh_token", result.refresh_token);          
            store.commit("setOAuthToken", result.access_token);           
            
            var m9kd0XZCmE6XPTbqy1d0 = CryptoJS.AES.encrypt(result.refresh_token, "0eIQfDoKkJqNJRq9oGBQ");
            localStorage.setItem("m9kd0XZCmE6XPTbqy1d0", m9kd0XZCmE6XPTbqy1d0);                               
            
            router.push({ path: "/home" })
          })
          .catch(e => {                    
        }) 
      }
    }   
    
    if (Object.values(obj)[1]) {
      store.getters.getFunctions.locales.forEach(element => {
        var str = Object.values(obj)[1];
        var n = str.includes(element);
        if (n) {
          if (element == "pt-Br") {
            element = "pt-br";
          }          
          store.commit("setLocale", element);
        }
      });
    }
    return obj;
  }
}

export default {
  whereShouldIPoint,
  getAllUrlParams,
};
