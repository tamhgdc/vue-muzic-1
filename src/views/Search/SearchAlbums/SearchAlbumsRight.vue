<template>
  <div>
    <!-- title -->
    <div v-if="details.albumDetails" class="pb-1">
      <h4>{{ details.albumDetails.name }}</h4>
      <i  
        v-if="details.albumDetails.tracks" 
        class="text-body-1 font-weight-black red--text text--darken-2"
      >
        {{ details.albumDetails.tracks.length }} Tracks
      </i>
    </div>
    <!-- list -->
    <v-list dense id="common-scrollContent" class="pt-0">
      <v-list-item
        v-for="item in details.albumDetails.tracks"
        :key="item.id"
        class="mb-2"
        @click="playSong(item)"
      >
        <v-list-item-avatar size="100" tile>
          <!-- pic -->
          <img
            :src="
              item.al.picUrl
                ? item.al.picUrl
                : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'
            "
          />
        </v-list-item-avatar>
        <v-list-item-content class="pt-4">
          <!-- name -->
          <v-list-item-title
            class="text-body-1 text-md-h6 font-weight-black"
            v-html="item.name"
          />
          <!-- album name  -->
          <v-list-item-subtitle
            class="text-caption text-md-body-1 py-1"
            v-html="item.al.name"
          />
          <!-- artists name -->
          <v-list-item-subtitle>
            <span
              v-for="a in item.ar"
              :key="a.id"
              class="text-body-2 text-md-body-1 red--text text--darken-2 mr-3"
              v-html="a.name"
            />
          </v-list-item-subtitle>
          <!-- tools -->
          <div class="d-flex align-center justify-space-between mt-1">
            <!-- btns -->
            <div>
              <!-- like -->
              <v-btn elevation="0" fab x-small @click="addToFavourite">
                <v-icon dark color="pink">mdi-heart</v-icon>
              </v-btn>
              <!-- video -->
              <v-btn
                elevation="0"
                fab
                x-small
                class="mx-2"
                v-if="item.mv"
                @click="goCheckMV(item.mv)"
              >
                <v-icon dark color="primary">mdi-movie-open</v-icon>
              </v-btn>
              <v-chip dark small color="yellow darken-2" v-if="item.fee == 1">
                MVP
              </v-chip>
            </div>
            <!-- times -->
            <div>
              <span class="font-weight-black" v-if="item.fee !== 1">
                {{ item.dt | timeFormat }}
              </span>
              <span class="font-weight-black" v-else>00:30</span>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
// utils
import saveLocalstorage from "../../../utils/localStorage/saveLocalstorage";
// api
import getSongURL from "../../../api/Detail/Song/getSongURL";

export default {
  computed: {
    ...mapState(["details"]),
  },

  created() {
    this.$store.dispatch(
      "getAlbumDetails",
      this.$store.state.searchResult.list.albums[0].id
    );
  },

  methods: {
    async playSong(item) {
      let { name, id, fee, dt } = item;
      let pic = item.al.picUrl;
      // 1. get song url
      let { data } = await getSongURL({ id });
      let url = data[0].url;
      let album = {
        name: item.al.name,
        id: item.al.id,
        publishTime: item.publishTime,
      };
      let artists = item.ar.map((e) => {
        return {
          name: e.name,
          id: e.id,
        };
      });
      // 2. save as song selected in vuex
      let params = {
        name,
        album,
        id,
        fee,
        duration: dt,
        pic,
        url,
        artists,
      };
      this.$store.commit("saveSongSelected", params);
    },
    goCheckMV(id) {
      this.$router.push("/mv?id=" + id);
    },
    addToFavourite() {
      if (this.$store.getters.songSelected == {}) return;
      saveLocalstorage(
        this.$store.getters.songSelected,
        "MusicPlayer-Favourites-Songs",
        "Song"
      );
    },
  },
};
</script>

