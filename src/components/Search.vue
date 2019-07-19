<template>
  <div class="search">
    <label>
      <input type="text" id="inputArea" v-model="searchWords" v-on:input="searchGames"/>
    </label>

    <div v-bind:class="{ searchCandidates: games.length !== 0 }">
      <div v-for="(game, index) in games">
        <div v-if="index < 10" v-on:click="searchDetail">
          <p v-bind:class="game.id">
            {{ game.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const baseURI = "https://www.boardgamegeek.com/xmlapi/";
const baseURIVer2 = "https://www.boardgamegeek.com/xmlapi2/";

export default {
  name: "search",
  data: function() {
    return {
      searchWords: "",
      games: [],
      selectGame: {
        name: "",
        published: "",
        time: "",
        thumbnail: "",

      }
    };
  },
  methods: {
    searchGames() {
      this.games = [];
      if(this.searchWords !== "") {
        const URI = baseURIVer2 + "search?query=" + this.searchWords + "&type=boardgame";
        this.$axios
          .get(URI, {
            timeout: 2000,
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
    },
    searchDetail(event) {
      const gameId = event.target.className;
      this.game.name = event.target.value;
      const URI = baseURI + "boardgame/" + gameId;
      this.$axios
        .get(URI, {
          timeout: 2000,
          responseType: "document"
        })
        .then(response => {
          const data = response.data;
          const year = data.querySelector("yearpublished");
          const player = {
            min: data.querySelector("minplayers"),
            max: data.querySelector("maxplayers")
          };
        })
    }
  }
}
</script>

<style scoped>
  .searchCandidates {
    border: solid 1px #000000;
  }
</style>