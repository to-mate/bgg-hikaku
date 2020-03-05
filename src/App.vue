<template>
  <v-app>
    <v-app-bar fixed app>
      <v-icon>casino</v-icon>
      <v-toolbar-title>
        bodoge.hikaku
      </v-toolbar-title>
    </v-app-bar>
    <v-container mt-5>
      <draggable class="row">
        <v-col v-for="n in searchColNum" :key="n">
          <v-card>
            <v-card-text>
              <search />
            </v-card-text>
          </v-card>
        </v-col>
      </draggable>
    </v-container>
  </v-app>
</template>

<script>
import search from "@/components/Search.vue";
import draggable from "vuedraggable";

export default {
  name: "App",
  components: {
    draggable,
    search
  },
  data: function() {
    return {
      searchColNum: 2
    };
  },
  computed: {
    colColor: function(key) {
      if (key === 1) {
        return "red";
      } else if (key === 2) {
        return "blue";
      } else {
        return "teal";
      }
    }
  }
};
</script>

<style scoped>
div.row div.col:nth-child(1) {
  background-color: #f44336;
}

div.row div.col:nth-child(2) {
  background-color: #2196f3;
}
</style>
