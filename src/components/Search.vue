<template>
  <div class="search">
    <!--    <v-text-field single-line box label="Game" type="text" v-model="searchWords" v-on:input="searchGames()"/>-->
    <!--    <v-list v-bind:class="{ searchCandidates: games.length !== 0 }" v-if="searchWords !== ''">-->
    <!--      <template v-for="(game, index) in games">-->
    <!--        <v-list-tile v-if="index < 10" v-on:click="searchDetail" :key="index">-->
    <!--          <p :class="game.id">-->
    <!--            {{ game.name }}-->
    <!--          </p>-->
    <!--        </v-list-tile>-->
    <!--      </template>-->
    <!--    </v-list>-->
    <v-autocomplete
      v-model="searchWords"
      :items="games"
      :search-input.sync="searchWords"
      label="Games"
      hide-no-data
      return-object
    >
    </v-autocomplete>
    <v-layout justify-center>
      <v-card v-if="isDisplay">
        <v-img
          :src="selectGame.thumbnail.innerHTML"
          width="540px"
          height="500px"
          style="object-fit: scale-down"
        />
        <v-card-title class="display-1 font-weight-bold">{{
          selectGame.name
        }}</v-card-title>
        <v-list
          v-for="(content, key) in selectGame"
          :key="key"
          v-if="key !== 'name' && key !== 'thumbnail' && content !== false"
        >
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
              <v-list-tile-title
                >yarn add vuedraggable {{ content.min.getAttribute("value") }} ~
                {{ content.max.getAttribute("value") }}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content v-else>
              <v-list-tile-title>
                {{ content.getAttribute("value") }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
const baseURI = "https://www.boardgamegeek.com/xmlapi2/";

export default {
  name: "search",
  data: function() {
    return {
      searchWords: "",
      isDisplay: false,
      isLoading: false,
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
    searchDetail(event) {
      const targetGame = event.currentTarget.firstElementChild;
      this.selectGame.name = targetGame.innerHTML;
      const URI = `${baseURI}thing?id=${targetGame.className}type=boardgame`;
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
          this.selectGame.publisher = data.querySelector(
            "link[type*='boardgamepublisher']"
          );
          this.selectGame.suggestPlayer = data.getElementsByTagName("poll")[0];
          this.selectGame.langDependence = data.getElementsByTagName("poll")[2];
        })
        .finally(() => {
          this.isDisplay = true;
          this.searchWords = "";
        })
        .catch(error => {
          console.log("sorry, error has occured by backend.");
          console.log(error);
        });
    },
    displaySuggestPlayer() {
      const poll = this.selectGame.suggestPlayer;
      const players = poll.getElementsByTagName("results");
      let maxPercentage = 0;
      let bestPlayer = 0;
      for (let player of players) {
        let percentage =
          player.firstElementChild.getAttribute("numvotes") /
          poll.getAttribute("totalvotes");
        if (percentage > maxPercentage) {
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
      for (let level of levels) {
        let percentage =
          level.getAttribute("numvotes") / poll.getAttribute("totalvotes");
        if (percentage > maxPercentage) {
          bestLevel = level.getAttribute("level");
          maxPercentage = percentage;
        }
      }
      return bestLevel;
    },
    searchEval() {
      const bestLevel = this.displayLangDependence();
      for (let rank in this.evals) {
        if (rank === bestLevel) {
          return this.evals[rank];
        }
      }
      return "";
    }
  },
  computed: {
    displayGames() {
      return this.games
    }
  },
  watch: {
    searchWords() {
      if (this.isLoading) return;

      this.isLoading = true;

      if (this.searchWords !== "") {
        const URI = `${baseURI}search?query=${this.searchWords}&type=boardgame`;
        this.$axios
          .get(URI, {
            responseType: "document"
          })
          .then(response => {
            const xml = response.data;
            const items = xml.getElementsByTagName("item");
            for (let item of items) {
              const game = {
                id: item.id,
                name: item.firstElementChild.getAttribute("value")
              };
              this.games.push(game);
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.searchCandidates {
  border: solid 1px #000000;
}
</style>
