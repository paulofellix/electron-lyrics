<template>
  <div class="player">
    <!-- <div class="d-flex justify-content-center"> -->
        <span @click="previousMusic"><i class="far fa-arrow-alt-circle-left fa-2x"></i></span>
        <span @click="playPause" v-if="playbackStatus == 'Paused'"><i class="far fa-play-circle fa-2x"></i></span>
        <span @click="playPause" v-else><i class="far fa-pause-circle fa-2x"></i></span>
        <span @click="nextMusic"><i class="far fa-arrow-alt-circle-right fa-2x"></i></span>
    <!-- </div> -->
    <!-- <div class="progress progress-bg">
      <div class="progress-bar progress-fg" style="width:30%"></div>
    </div> -->
  </div>
</template>

<script>
var dbus = require("dbus-native");
var spotify = require("../modules/spotifyDbusHandler.js");
export default {
  name: "Player",
  data() {
    return {
      playbackStatus: ""
    };
  },
  methods: {
    nextMusic() {
      spotify.next(() => {
        this.refreshPlaybackStatus();
        setTimeout(() => this.$emit("playerControls"), 1000);
      });
    },
    previousMusic() {
      spotify.prev(() => {
        this.refreshPlaybackStatus();
        setTimeout(() => this.$emit("playerControls"), 1000);
      });
    },
    playPause() {
      spotify.playPause(this.refreshPlaybackStatus(true));
    },
    refreshPlaybackStatus(flag) {
      let vm = this;
      if (flag) {
        spotify.getPlaybackStatus((err, data) => {
          vm.playbackStatus = data[1][0];
          console.log(vm.playbackStatus);
          if (vm.playbackStatus == "Playing") vm.playbackStatus = "Paused";
          else vm.playbackStatus = "Playing";
        });
      } else {
        spotify.getPlaybackStatus((err, data) => {
          vm.playbackStatus = data[1][0];
        });
      }
    }
  },
  mounted() {
    this.refreshPlaybackStatus();
  }
};
</script>

<style>
</style>
