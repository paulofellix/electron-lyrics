<template>
    <div class="home">
        <div class="row">
            <div class="col-sm-2 offset-sm-1">
                <img :src="musicData.artUrl" :alt="musicData.album" class="img-fluid" @dblclick="getSpotifyMusic">
                <br>
                <br>
                <h5 style="font-weight:bold">{{musicData.artist}}</h5>
                <h5 style="color:#cecece">{{musicData.title}}</h5>
            </div>
            <div class="col-sm-8">
                <div id="lyrics">
                    <div v-if="hasLyrics">
                        <p v-html="lyric" v-for="lyric in lyricsArray"></p>
                    </div>
                    <div v-else>
                    <p>     
                        <h2>Lyrics Not Found</h2>
                    </p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="selectMusicModal" tabindex="-1" role="dialog" aria-labelledby="selectMusicModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="selectMusicModalLabel">Select the correct song</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
var stringSimilarity = require("string-similarity");
var shell = require("shelljs");
var dbus = require("dbus-native");

shell.config.execPath = "/usr/bin/node";

export default {
  name: "Home",
  data() {
    return {
      musicData: {
        artist: "",
        album: "",
        title: "",
        artUrl: ""
      },
      lyrics: "",
      lyricsArray: [],
      lyricsLength: 0
    };
  },
  watch: {
    lyricsArray: function(val) {
      console.log(val.length);
      let el = document.querySelector("html");
      if (val.length == 0) {
        el.style.height = "100%";
      } else {
        el.style.height = "";
      }
    }
  },
  computed: {
    hasLyrics() {
      if (this.lyricsArray.length > 0) return true;
      else return false;
    }
  },
  methods: {
    occurrences(string, subString, allowOverlapping) {
      string += "";
      subString += "";
      if (subString.length <= 0) return string.length + 1;

      var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

      while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
          ++n;
          pos += step;
        } else break;
      }
      return n;
    },
    getSpotifyMusic() {
      let vm = this;
      vm.clearData();
      var bus = dbus.sessionBus();
      bus.invoke(
        {
          destination: "org.mpris.MediaPlayer2.spotify",
          path: "/org/mpris/MediaPlayer2",
          interface: "org.freedesktop.DBus.Properties",
          member: "Get",
          signature: "ss",
          body: ["org.mpris.MediaPlayer2.Player", "Metadata"]
        },
        function(err, data) {
          if (err) console.log(err);
          else {
            vm.musicData.artist = data[1][0][5][1][1][0][0];
            vm.musicData.album = data[1][0][3][1][1][0];
            vm.musicData.title = data[1][0][8][1][1][0];
            vm.musicData.artUrl = data[1][0][2][1][1][0];
            vm.getLyrics();
          }
        }
      );

      //Old Method using script

      // let stdout = shell.exec("./sp metadata").stdout;
      // let aux = stdout.split("\n");

      // aux.forEach(element => {
      //   let data = element.split("|");
      //   switch (data[0]) {
      //     case "album":
      //       vm.musicData.album = data[1];
      //       break;
      //     case "artist":
      //       vm.musicData.artist = data[1];
      //       break;
      //     case "title":
      //       vm.musicData.title = data[1];
      //       break;
      //     case "artUrl":
      //       vm.musicData.artUrl = data[1];
      //       break;
      //     default:
      //       break;
      //   }
      // });
    },
    clearData() {
      this.lyrics = "";
      this.lyricsArray = [];
      this.lyricsLength = 0;
      this.musicData = {
        artist: "",
        album: "",
        title: "",
        artUrl: ""
      };
    },
    getLyrics() {
      let vm = this;

      let artist = vm.musicData.artist.replace("&", "%26");
      let title = vm.musicData.title.replace("&", "%26");

      this.$http
        .get(
          `http://api.vagalume.com.br/search.artmus?q=${title}%20${artist}&apikey=${apiKey}`
        )
        .then(response => {
          if (response.data.response.numFound == 0) {
            return;
          }

          let responseArray = response.data.response.docs.filter(element => {
            return element.title !== undefined;
          });

          let musId;

          responseArray.forEach(element => {
            if (
              stringSimilarity.compareTwoStrings(artist, element.band) > 0.8 &&
              stringSimilarity.compareTwoStrings(title, element.title) > 0.3
            )
              musId = element.id;
          });

          if (musId == undefined) return;
          this.$http
            .get(
              `http://api.vagalume.com.br/search.php?musid=${musId}&extra=alb&apikey=${apiKey}`
            )
            .then(response2 => {
              let result = stringSimilarity.compareTwoStrings(
                artist,
                response2.data.art.name
              );

              if (result < 0.8) return;

              vm.lyrics = response2.data.mus[0].text.replace(/\n/g, "<br>");
              vm.lyricsArray = vm.lyrics.split("<br><br>");
              vm.lyricsLength = response2.data.mus[0].text.length;
              vm.lyricsLength += vm.occurrences(vm.lyrics, "<br><br>") * 100;
              let elLyrics = document.querySelector("#lyrics");

              if (vm.lyricsLength < 1000) {
                elLyrics.style.columnCount = 1;
              } else if (vm.lyricsLength > 1000) {
                elLyrics.style.columnCount = 2;
              }
              // else if (vm.lyricsLength >= 1800 && vm.lyricsLength < 2500) {
              //   elLyrics.style.columnCount = 3;
              // } else {
              //   elLyrics.style.columnCount = 4;
              // }
            });
        });
    }
  },
  mounted() {
    this.getSpotifyMusic();
  }
};
</script>

<style>
</style>
