<template>
  <div class="search">
    <label>
      <input type="text" id="inputArea" v-model="searchWords" v-on:input="searchGames"/>
    </label>

    <div v-bind:class="{ searchCandidates: games.length !== 0 }">
      <div v-for="(game, index) in games">
        <div v-if="index < 10" v-bind:class="game.id" v-on:click="searchDetail">
          <p>{{ game.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const baseURI = "https://www.boardgamegeek.com/xmlapi2/search?query=";

export default {
  name: "search",
  data: function() {
    return {
      searchWords: "",
      games: []
    };
  },
  methods: {
    searchGames() {
      this.games = [];
      if(this.searchWords !== "") {
        const URI = baseURI + this.searchWords + "&type=boardgame";
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
      console.log(event.target.class)
    }
  }
}
</script>

<style scoped>
  .searchCandidates {
    border: solid 1px #000000;
  }
</style>