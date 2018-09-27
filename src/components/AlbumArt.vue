<template>
    <div class="album-art">
        <player @playerControls="getSpotifyMusic" style="margin-left:25px"></player>
        <img :src="musicData.artUrl" :alt="musicData.album" class="img-fluid" @dblclick="getSpotifyMusic()">
        <br>
        <br>
        <h4 style="font-weight:bold">{{musicData.title}}</h4>
        <h4 style="color:#cecece">{{musicData.artist}}</h4>
    </div>
</template>

<script>
import Player from "./Player";

import { EventBus } from "../event-bus.js";

export default {
  name: "AlbumArt",
  components: {
    Player
  },
  props: {
    musicData: {
      type: Object
    }
  },
  methods: {
    getSpotifyMusic() {
      this.$emit("clickAlbum");
    }
  }
};
</script>

<style>
</style>
