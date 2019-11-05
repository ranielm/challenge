import axios from 'axios';
import store from '../store';
import app from '../../main';
import router from 'src/routes/router.js';

const http = axios.create({
	baseURL: store.getters.getbackendURL,
	headers: {		
		'Authorization': "Bearer " + localStorage.getItem("token"),
		'Content-Type': 'application/json',
		'Accept': "application/json",
		"Access-Control-Allow-Origin": "*"		
	}
});

http.interceptors.request.use(
	(config) => {		
		store.commit('setLoading', true);
		const token = localStorage.token;
		const accessToken = localStorage.accessToken;
		const language = localStorage.locale;
		if (token) config.headers.Authorization = `Bearer ${token}`;
		if (accessToken) {
			config.headers.access_token = accessToken;
		}
		if (language) {
			config.headers['Accept-Language'] = language;
		}
		return config;
	},
	(error) => {
		store.commit('setLoading', false);		
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	(response) => {
		store.commit('setLoading', false);		
		return response;
	},
	(error) => {
		if (error.response.data.error.message == "The access token expired") {
			router.push({ path: `/login` });
		}
		
		store.commit('setLoading', false);
		if (error == store.getters.getResponse.blockedProfile) {
			store.commit("setResetByBlockedProfile", true);
			router.push({ path: `/login` });
		}		
		return Promise.reject(error);
	}
);

export default http;
