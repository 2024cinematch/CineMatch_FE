<template>
  <v-app class="overflow-hidden">
    <v-app-bar
      absolute
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <span class="title" style="font-style: italic;">CineMatch</span>
      <router-link to="/" class="menu" style="color: white">홈</router-link>
      <router-link to="/about" class="menu" style="color: white;">추천</router-link>
      <v-spacer></v-spacer>

      <!-- 검색 -->
      <v-responsive class="mx-auto" max-width="344">
        <v-text-field
          v-model="searchQuery"
          hide-details="auto"
          label="영화 제목 검색.."
          color="red"
          @keyup.enter="getMovieDetails"
        ></v-text-field>
      </v-responsive>
      <v-btn icon @click="getMovieDetails">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-app-bar>
    <br>
    <br>
    <!-- 검색 결과 표시 -->
    <v-subheader style="font-size: 24px; font-weight: bold; margin-top: 40px !important; padding: 50px !important;">검색 결과</v-subheader>

    <v-container>
      <v-row>
        <v-col v-for="(movie, index) in filteredMovies" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="movie-card" flat @click="toggle(movie)">
            <v-card-title class="text-center text-h5">{{ movie.title }}</v-card-title>
            <v-card-subtitle class="text-center genre-text">{{ movie.genres.join(', ') }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

      <!-- 검색 결과가 없는 경우 -->
      <div v-if="filteredMovies.length === 0" style="text-align: center; margin-top: 20px;">
        <p>일치하는 영화가 없습니다.</p>
      </div>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: "SearchPage",
  data() {
    return {
      searchQuery: this.$route.query.q || '',
      model: 1,
      filteredMovies: []
    };
  },
  mounted() {
    if (this.searchQuery.trim()) {
      this.getMovieDetails();
    }
  },
  methods: {
    getMovieDetails() {
      if (this.searchQuery.trim()) {
        axios.get(`/search/${encodeURIComponent(this.searchQuery)}`)
          .then(response => {
            if (!response.data || response.data.length === 0) {
              console.error('Empty response received.');
              this.filteredMovies = [];
              return;
            }
            this.filteredMovies = response.data.map(movie => ({
              id: movie.movie_Id,
              title: movie.title,
              genres: movie.genres.split('|')
            }));
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
            this.filteredMovies = [];
          });
      }
    }
  }
}
</script>

<style>
.menu {
  text-decoration: none;
  color: black;
  margin: 20px;
  font-size: 30px;
}
.menu.router-link-exact-active {
  color: red !important;
}
.title {
  display: inline-block;
  padding: 10px;
}
.movie-card {
  height: 400px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
}
.text-center {
  text-align: center !important;
}
.text-h5 {
  font-size: 7em !important; 
}
.genre-text {
  margin-top: 60px !important;
  font-size: 1.5em !important; 
}
</style>

