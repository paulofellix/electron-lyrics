<template>
    <div class="lyrics">
        <div v-if="translatedLyricsArray.length > 1">
          <h3 class="translate" v-if="!isTranslated" @click="changeLanguage">Traduzir</h3>
          <h3 class="translate" v-else @click="changeLanguage">Original</h3>
        </div>
        <div v-else-if="searching">
          <h3>Searching...</h3>
        </div>
        <div v-if="lyricsNotFound">
          <h3>Lyrics not found!</h3>
        </div>
        <div>
        <p v-html="lyric" v-for="(lyric,key) in lyricsShow" :key="key">
          {{lyric}}
        </p>
        </div>
    </div>
</template>

<script>
const utils = require("../modules/utils.js")
import { EventBus } from "../event-bus.js";
const stringSimilarity = require("string-similarity");

export default {
  name: "Lyrics",
  data(){
    return {
      lyrics: {
        original: '',
        translated: ''
      },
      originalColumnCount: 1,
      translatedColumnCount: 1,
      originalLyricsArray: [],
      translatedLyricsArray: [],
      lyricsShow: [],
      isTranslated: false,
      searching: true
    }
  },  
  props: {
    musicData: Object
  },
  watch:{
    lyricsShow(){
      const elLyrics = document.querySelector(".lyrics");
      if (this.isTranslated)
        elLyrics.style.columnCount = this.translatedColumnCount;
      else
        elLyrics.style.columnCount = this.originalColumnCount;
    }
  },
  methods: {
    getLyrics() {
      
      let vm = this;

      let artist = vm.musicData.artist.replace("&", "%26");
      let title = vm.musicData.title.replace("&", "%26");

      this.$http
        .get(
          // `http://api.vagalume.com.br/search.artmus?q=${title}%20${artist}&apikey=${apiKey}`
          `http://api.vagalume.com.br/search.mus?q=${title}&apikey=${apiKey}`

        )
        .then(response => {
          if (+response.data.response.numFound === 0)
          {
            vm.searching = false;
            return;
          }
            
          

          let responseArray = response.data.response.docs.filter(element => {
            return element.title !== undefined;
          });

          let musId;

          responseArray.forEach(element => {
            if (musId == undefined) {
              if (
                stringSimilarity.compareTwoStrings(artist, element.band) >
                  0.8 &&
                stringSimilarity.compareTwoStrings(title, element.title) > 0.3
              )
                musId = element.id;
            }
          });

          if (musId == undefined) 
          {
            vm.searching = false;
            return;
          }

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

              vm.lyrics.original = response2.data.mus[0].text
              if (response2.data.mus[0].translate)
                vm.lyrics.translated = response2.data.mus[0].translate[0].text
              
              vm.lyricsToHtml()
            });
        });
    },
    lyricsToHtml(){
      const vm = this;
      let lyrics;
      let lyricsLength;

      if (!vm.lyrics.original)
      {
        vm.clearData()
        return
      }

      
      lyrics = vm.lyrics.original.replace(/\n/g, "<br>");
      vm.originalLyricsArray = lyrics.split("<br><br>");
      lyricsLength = vm.calculateLength(vm.lyrics.original)

      if (lyricsLength < 1000) {
        vm.originalColumnCount = 1;
      } else if (lyricsLength > 1000) {
        vm.originalColumnCount = 2;
      }

      lyrics = vm.lyrics.translated.replace(/\n/g, "<br>");
      vm.translatedLyricsArray = lyrics.split("<br><br>");
      lyricsLength = vm.calculateLength(vm.lyrics.translated)
      
      if (lyricsLength < 1000) {
        vm.translatedColumnCount = 1;
      } else if (lyricsLength > 1000) {
        vm.translatedColumnCount = 2;
      }

      vm.lyricsShow = vm.originalLyricsArray
      vm.searching = false;
    },
    clearData(){
      this.lyrics.original = ''
      this.lyrics.translated = ''
      this.originalLyricsArray = []
      this.translatedLyricsArray = []
      this.lyricsShow = []
      this.searching = true;
    },
    changeLanguage(){
      const vm = this
      if (vm.isTranslated){
        vm.lyricsShow = vm.originalLyricsArray
      }else{
        vm.lyricsShow = vm.translatedLyricsArray
      }
      vm.isTranslated = !vm.isTranslated
    },
    calculateLength(lyrics){
      let aux = lyrics.replace(/\n/g, "<br>");
      let lyricsLength = lyrics.length + 
                      (utils.occurrences(lyrics, '<br><br>') * 100);
      return lyricsLength
    }
  },
  updated(){
    let el = document.querySelector("html");
    let hasVerticalScrollbar = el.scrollHeight > el.clientHeight;

    if (hasVerticalScrollbar) {
      el.style.height = "";
    } else {
      el.style.height = "100%";
    }
  },
  mounted(){
    EventBus.$on("onSpotifyMusic",() => {
      this.clearData()
      this.getLyrics()
    })
  }
}
</script>

<style>
</style>
