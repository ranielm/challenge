<template>
  <div id="main">
    <div id="container-login">
      <div class="item left">
        <div class="item">                         
        </div>
        <div class="content-info">
          <div class="item last-update"></div>
        </div>
      </div>
      <div class="item middle">
        <div class="content-middle">
          <div class="middle-logo-tm2">
            <icon name="spotify-logo" widthValue="60" extension="png" id="spotify-logo"/>     
          </div>
          <div class="line-middle"></div>
          <div class="middle-text-comercial">BEYOND CHALLENGE</div>
          <form name="loginForm" class="form" @submit.prevent=login v-if="!toggleResetPassword">
            <div class="middle-inputs">
              <div v-show="error" class="error-login">
                <span class>{{ msgError }}</span>
              </div>
             <div class="username">
                <img src="/static/icons/login/icon_username_dark.svg" style="opacity: 0.5;" />
                <input
                  name="clientId"
                  v-model="clientId"
                  type="text"
                  class="input-style"
                  placeholder="ID do Cliente"
                  @click="interaction"
                />
              <div class="mr-3"></div>
                <img src="/static/icons/login/icon_username_dark.svg" style="opacity: 0.5;" />
                <input
                  name="clientSecret"
                  v-model="clientSecret"
                  type="text"
                  class="input-style"
                  placeholder="Segredo do Cliente"
                  @click="interaction"
                />
              </div>
              <div class="password mb-4">
                <icon name="external-link" widthValue="26" extension="svg"/>                     
                <input
                  name="redirectUri"
                  v-model="redirectUri"
                  class="input-style"
                  type="text"
                  placeholder="URI para redirecionamento"
                />
              </div>             
              <div class="margin-25-tb center middle-text-comercial">
                
                  <a
                    class="button-login button-green"
                    :href="this._authorizeURL()+this.clientIdFormated+this.redirectUriFormated+this.scopes+finalUrl"
                    value="LOGIN"
                    @click="login()"                     
                  >OBTER TOKEN</a>                  
                  <!-- <button                   
                    :href="this._authorizeURL()+this.clientIdFormated+this.redirectUriFormated+this.scopes+finalUrl"
                    value="LOGIN" 
                    class="button-login button-green
                  "></button> -->
                </div>
                <!-- <div class="division"></div>
                <div class="group-forgot-contact">
                  <div
                    class="text-forgot-pass"
                    @click="toggleResetPassword=!toggleResetPassword"
                  >{{ $t('login.forgotPassword') }}</div>
                </div> -->
              
            </div>
          </form>
          <form name="resetForm" class="form" @submit.prevent="resetPassword" v-else>
            <div class="middle-inputs">
              <div class="title">{{ $t('login.resetPassword') }}</div>
              <div class="description">{{ $t('login.description') }}</div>
              <div v-if="success" class="success-login">
                <span>{{ $t('login.success') }}</span>
              </div>
              <div v-else-if="error" class="error-login">
                <span>{{ $t('login.noSuccess') }}</span>
              </div>
              <div class="username">
                <img src="/static/icons/login/icon_username_dark.svg" class="opacity05" />
                <input
                  name="username"
                  v-model="username"
                  type="text"
                  class="form-control input-style"
                  placeholder="USERNAME"
                />
              </div>
              <div class="div-button-login">
                <div>
                  <input
                    type="submit"
                    class="button-green uppercase"
                    :value="$t('login.resetPassword')"
                  />
                </div>
                <div class="division"></div>
                <div class="group-forgot-contact">
                  <div
                    class="text-forgot-pass uppercase"
                    @click="toggleResetPassword=!toggleResetPassword"
                  >{{ $t('login.back') }}</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="item right"></div>
    </div>
  </div>
</template>

<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js"></script>

<script>
import User from "src/backend/models/User.js"
import Token from "src/backend/models/Token.js"
import Ticket from "src/backend/models/Ticket.js"
import store from "@/backend/store"
import axios from 'axios'
import http from "src/backend/request/http"
import icon from './Icon'
import CryptoJS from 'crypto-js'
export default {
  components: {
    icon
  },
  data() {
    return {
      username: "",
      password: "",
      locale: navigator.language,
      toggleResetPassword: false,
      usernameClick: true,
      error: false,
      success: undefined,
      clientSecret: undefined,
      msgError: "Dados Incorretos",
      url: "https://accounts.spotify.com/authorize?",
      hash: undefined,
      clientId: undefined,    
      redirectUri: undefined,    
      scopes: [
        "scope=user-read-currently-playing",
        "user-read-playback-state",
        "playlist-read-collaborative",
        "playlist-modify-private",
        "playlist-modify-public",
        "playlist-read-private",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-read-private",
        "user-read-email",
        "user-library-modify",
        "user-library-read",
        "user-follow-modify",
        "user-follow-read",
        "user-read-recently-played",
        "user-top-read",
        "streaming",
        "app-remote-control",
      ],
      finalUrl: "&response_type=code&show_dialog=true"
    };
  },
  computed: {
    clientIdFormated() {
      return "client_id="+this.clientId+"&"
    },
    redirectUriFormated() { 
      return "redirect_uri="+this.redirectUri+"&";
    }
  },
  created() {
    this.hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function(initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});    

    if (this.$store.getters.getResponse.resetByTokenExpired) {
      localStorage.removeItem("makeLogin");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("locale");
      this.$toaster.error(this.$t("login.resetByTokenExpired"));
      this.$store.commit("setResetByTokenExpired", false);
    }

    if (this.$store.getters.getResponse.resetByBlockedProfile) {
      localStorage.removeItem("makeLogin");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("locale");
      this.$toaster.error(this.$t("login.resetByBlockedProfile"));
      this.$store.commit("setResetByBlockedProfile", false);
    }

    this._getLocale();
    this.$store.commit("setClearSearch", undefined);
    this.$store.commit("setSearchQuery", undefined);
    this.$store.commit("setSearch", undefined);
    if (this.locale === "pt") {
      this.locale = this.locale.toUpperCase() + "_BR";
    } else if (this.locale.indexOf("es") !== -1) {
      this.locale = "ES";
    } else {
      this.locale = "EN";
    }
  },
  methods: {
    interaction() {
      if (this.usernameClick === true) {
        document
          .querySelector(".line-middle")
          .classList.toggle("--moveDivisor");
        setTimeout(function() {
          document
            .querySelector("#spotify-logo")
            .classList.toggle("logoTM2Digital-fade");
        }, 500);

        this.usernameClick = false;
      }
    },

    opacityElement(elementChoice) {
      document.querySelector(elementChoice).style.opacity = "1";
    },

    resetPassword() {
      if (!this.username || !this.locale) {
        this.error = true;
        this.msgError = "Campos Vazios";
      }

      this._getLoading(true);

      User.postResetPassword(this.locale, this.username)
        .then(result => {
          if (result === false) {
            this.error = true;
            this._getLoading(false);
          } else {
            this._getLoading(false);
            this.success = true;
          }
        })
        .catch(e => {
          this.error = true;
          this._getLoading(false);
          this.$swal.fire({
            title: this.$t("swal.titleError"),
            text: e.response.data,
            type: "error",
            showConfirmButton: true
          });
        });
    },

    login() {
      if (!this.clientId || !this.redirectUri || !this.clientSecret) {
        this.error = true;
        this.msgError = "Informe todos os campos";
        return;
      }
      else {        
        var CryptoJS = require("crypto-js");

        // CLIENT ID ENCODED
        var w7yfbIUaAPsdPPN8mneM = CryptoJS.AES.encrypt(this.clientId, "jsk9SdF4TwsdlIbD5ciu");
        localStorage.setItem("w7yfbIUaAPsdPPN8mneM", w7yfbIUaAPsdPPN8mneM);  
        store.commit("setClientId", this.clientId);

        // CLIENT SECRET ENCODED
        var IetE5EUk3MmpJbLljgBj = CryptoJS.AES.encrypt(this.clientSecret, "5ZBh9NRdnNIM6sMOMRIh");
        localStorage.setItem("IetE5EUk3MmpJbLljgBj", IetE5EUk3MmpJbLljgBj);
        store.commit("setClientSecret", this.clientSecret);

        // REDIRECT URI ENCODED
        var xtDCARAm5e0D9kH4odfi = CryptoJS.AES.encrypt(this.redirectUri, "D1AoAbs64QqzqsXq6oKj");
        localStorage.setItem("xtDCARAm5e0D9kH4odfi", xtDCARAm5e0D9kH4odfi);
        store.commit("setRedirectUri", this.redirectUri);

        const initialData = {
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          redirectUri: this.redirectUri
        }
        this.$store.commit("setInitialData", initialData);
        this._getLoading(true);
        setTimeout(function() {
          window.open('', '_self', ''); window.close();
        }, 1000);      
      }

      //Faz a requisicao para login no mixin common.js
      // this._login(this.username, this.password)
      //   .then(result => {
      //     if (result === false) {
      //       this.error = true;
      //       this._getLoading(false);
      //     } else {
      //       this.error = false;
      //       this.$store.commit("setLogin", true);

      //       this.$router.push("list-tickets");

      //       this._getLoading(false);
      //     }
      //   })
      //   .catch(e => {
      //     this.error = true;
      //     this._getLoading(false);
      //   });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/sass/login";
</style>
