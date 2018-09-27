<template>
    <div id="app">
      <div class="row">
          <div class="col-sm-3 offset-sm-1">
              <album-art :musicData="musicData" @clickAlbum="getSpotifyMusic"></album-art>
          </div>
          <div class="col-sm-7">
            <lyrics :musicData="musicData"></lyrics>
          </div> 
      </div>
    </div>
</template>

<script>
const spotify = require("./modules/spotifyDbusHandler.js");
import { EventBus } from './event-bus.js'

import AlbumArt from "./components/AlbumArt";
import Lyrics  from "./components/Lyrics";

export default {
  name: "App",
  components: {
    AlbumArt,
    Lyrics
  },
  data() {
    return {
      musicData: {
        artist: "",
        album: "",
        title: "",
        artUrl: ""
      }
    };
  },
  watch: {},
  methods: {
    getSpotifyMusic() {
      let vm = this;
      vm.clearData();
      spotify.getMetadata((err, data) => {
        if (err) console.log(err);
        else {
          vm.musicData.artist = data[1][0][5][1][1][0][0]
          vm.musicData.album = data[1][0][3][1][1][0]
          vm.musicData.title = data[1][0][8][1][1][0]
          vm.musicData.artUrl = data[1][0][2][1][1][0]
          EventBus.$emit('onSpotifyMusic')
        }
      });
    },
    clearData() {
      this.musicData = {
        artist: "",
        album: "",
        title: "",
        artUrl: ""
      };
    },
  },
  mounted() {
    this.getSpotifyMusic();
  }
};
</script>

<style>
</style>
