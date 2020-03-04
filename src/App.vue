<template>
  <v-app>
    <v-toolbar fixed app>
      <v-icon>casino</v-icon>
      <v-toolbar-title>
        bodoge.hikaku
      </v-toolbar-title>
    </v-toolbar>
    <v-container mt-5>
      <v-row>
        <v-col v-for="n in searchColNum" :key="n">
          <search></search>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import search from "@/components/Search.vue";
import draggable from "vuedraggable";

export default {
  name: "App",
  components: {
    search
  },
  data: function() {
    return {
      searchColNum: 2
    };
  }
};
</script>
