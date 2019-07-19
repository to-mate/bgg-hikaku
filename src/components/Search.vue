<template>
  <div class="search">
    <v-text-field single-line box label="Game" type="text" v-model="searchWords"v-on:input="searchGames()"/>
    <v-list v-bind:class="{ searchCandidates: games.length !== 0 }" v-if="searchWords !== ''">
      <template v-for="(game, index) in games">
        <v-list-tile v-if="index < 10" v-on:click="searchDetail">
          <p :class="game.id">
            {{ game.name }}
          </p>
        </v-list-tile>
      </template>
    </v-list>
    <v-layout justify-center>
      <v-card v-if="isDisplay">
        <v-img :src="selectGame.thumbnail.innerHTML" width="540px" height="500px" style="object-fit: scale-down"></v-img>
        <v-card-title class="display-1 font-weight-bold">{{ selectGame.name }}</v-card-title>
        <v-list v-for="(content, key) in selectGame" v-if="key !== 'name' && key !== 'thumbnail' && content !== false">
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon>{{ icons[key] }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content v-if="key === 'suggestPlayer'">
              <v-list-tile-title>
                {{ displaySuggestPlayer() }}
              </v-list-tile-title>
              <v-list-tile-sub-title v-if="key === 'suggestPlayer'">
                User Suggested Number of Players
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-content v-else-if="key === 'langDependence'">
              <v-list-tile-title>
                {{ displayLangDependence() }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ searchEval() }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-content v-else-if="key === 'numPlayer'">
              <v-list-tile-title>
                {{ content.min.innerHTML }} ~ {{ content.max.innerHTML }}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-else>
              <v-list-tile-title>
                {{ content.innerHTML }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash';

const baseURI = "https://www.boardgamegeek.com/xmlapi/";
const baseURIVer2 = "https://www.boardgamegeek.com/xmlapi2/";

export default {
  name: "search",
  data: function() {
    return {
      searchWords: "",
      games: [],
      isDisplay: false,
      selectGame: {
        name: "",
        year: "",
        time: "",
        thumbnail: "",
        numPlayer: "",
        publisher: "",
        suggestPlayer: "",
        langDependence: ""
      },
      icons: {
        year: "event",
        time: "timer",
        numPlayer: "people",
        publisher: "place",
        suggestPlayer: "how_to_reg",
        langDependence: "g_translate"
      },
      evals: {
        1: "No necessary in-game text",
        2: "Some necessary text - easily memorized or small crib sheet",
        3: "Moderate in-game text - needs crib sheet or paste ups",
        4: "Extensive use of text - massive conversion needed to be playable",
        5: "Unplayable in another language"
      }
    };
  },
  methods: {
    searchGames: _.throttle(function(){
      this.games = [];
      if(this.searchWords !== "") {
        const URI = baseURIVer2 + "search?query=" + this.searchWords + "&type=boardgame";
        this.$axios
          .get(URI, {
            responseType: "document"
          })
          .then(response => {
            const xml = response.data;
            const items = xml.getElementsByTagName("item");
            for(let item of items) {
              let game = {
                id: item.id,
                name: item.firstElementChild.getAttribute("value")
              };
              this.games.push(game);
            }
          })
      }
    }, 500),
    searchDetail(event) {
      const targetGame = event.target.firstElementChild;
      this.selectGame.name = targetGame.innerHTML;
      const URI = baseURI + "boardgame/" + targetGame.className;
      this.$axios
        .get(URI, {
          responseType: "document"
        })
        .then(response => {
          const data = response.data;
          this.selectGame.thumbnail = data.getElementsByTagName("thumbnail")[0];
          this.selectGame.year = data.getElementsByTagName("yearpublished")[0];
          this.selectGame.numPlayer = {
            min: data.getElementsByTagName("minplayers")[0],
            max: data.getElementsByTagName("maxplayers")[0]
          };
          this.selectGame.time = data.getElementsByTagName("playingtime")[0];
          this.selectGame.publisher = data.getElementsByTagName("boardgamepublisher")[0];
          const poll = data.getElementsByTagName("poll")
          this.selectGame.suggestPlayer = poll[0]
          this.selectGame.langDependence = poll[1]
        })
        .finally(() => {
          this.isDisplay = true;
          this.searchWords = "";
        })
        .catch((error) => {
          console.log("sorry, error has occured by backend.");
          console.log(error);
        });
    },
    displaySuggestPlayer() {
      const poll = this.selectGame.suggestPlayer;
      const players = poll.getElementsByTagName("results");
      let maxPercentage = 0;
      let bestPlayer = 0;
      for(let player of players) {
        let percentage = player.firstElementChild.getAttribute("numvotes") / poll.getAttribute("totalvotes");
        if(percentage > maxPercentage) {
          bestPlayer = player.getAttribute("numplayers");
          maxPercentage = percentage;
        }
      }
      return bestPlayer;
    },
    displayLangDependence() {
      const poll = this.selectGame.langDependence;
      const levels = poll.firstElementChild.getElementsByTagName("result");
      let maxPercentage = 0;
      let bestLevel;
      for(let level of levels) {
        let percentage = level.getAttribute("numvotes") / poll.getAttribute("totalvotes")
        if(percentage > maxPercentage) {
          bestLevel = level.getAttribute("level");
          maxPercentage = percentage
        }
      }
      return bestLevel;
    },
    searchEval() {
      const bestLevel = this.displayLangDependence();
      for(let rank in this.evals) {
        if(rank === bestLevel) {
          return this.evals[rank];
        }
      }
      return "";
    }
  }
}
</script>

<style scoped>
  .searchCandidates {
    border: solid 1px #000000;
  }
</style>