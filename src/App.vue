<template>
  <v-app>
    <v-toolbar fixed app>
      <v-toolbar-side-icon>
        <v-icon>casino</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>
        bodoge.hikaku
      </v-toolbar-title>
    </v-toolbar>
    <v-container mt-5>
      <v-layout align-space-around justify-space-around fill-height>
        <v-flex xs6>
          <v-card>
            <v-card-text class="teal lighten-3">
              <search></search>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card>
            <v-card-text class="lime lighten-3">
              <search></search>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>

</template>

<script>
import search from "@/components/Search.vue";

export default {
  name: "App",
  components: {
    search
  }
};
</script>
