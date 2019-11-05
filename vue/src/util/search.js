import Search from "@/backend/models/Search.js";
import Store from "@/backend/store.js";

export default {  
    methods: {
        _findByTrackAndAlbum(query) {        
        Search.findByTrackAndAlbum(query)
            .then((result) => {     
                Store.commit("setTracks", result.tracks)
                Store.commit("setAlbums", result.albums)                                                       
            })
            .catch((e) => {                       
                            
            });        
        return null;
        }
    }
};