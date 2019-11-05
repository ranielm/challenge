import http from '../request/http';
import axios from 'axios';
import store from '../store';
const qs = require('querystring')

const search = {
    findByTrackAndAlbum(query) {

    const requestBody = {
        q: "muse",
        type: "track,album",
        market: "BR",
        limit: 10,
        offset: 5,
    };

    const config = {
        headers: {                      
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Content-Type': 'application/json',
            'Accept': "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };

    return http        
        .get("https://cors-anywhere.herokuapp.com/" + "https://api.spotify.com/v1/search?q=" + query + "&type=track%2Calbum&market=BR&limit=10&offset=5", config)        
            .then(result => {
                return result.data;
            })
    },
};
export default search;
