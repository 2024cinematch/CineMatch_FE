<template>
  <v-app class="overflow-hidden">
    <v-app-bar fixed>
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
          @keyup.enter="performSearch"
        ></v-text-field>
      </v-responsive>
      <v-btn icon @click="performSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-app-bar>

    <!-- 메인 컨텐츠 영역 -->
    <v-main>
      <v-container class="mt-12">
        <!-- 장르 선택 드롭다운 -->
        <v-row>
          <v-col cols="12" sm="2">
            <v-select
              v-model="selectedGenre"
              :items="genres"
              label="장르 선택"
              single-line
              item-text="name"
              item-value="name"
              @change="filterMoviesByGenre"
              class="genre-select"
              color="red"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(movie, index) in visibleMovies" :key="index" cols="12" sm="6" md="4" lg="3">

            <v-card class="movie-card" flat @click="showDetail(movie.title)">

              <v-card-title class="text-center text-h5">{{ movie.title }}</v-card-title>
              <v-card-subtitle class="text-center genre-text">{{ movie.genres.split(', ').join(', ') }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "@/axios";

export default {
  name: "MainPage",
  data() {
    return {
      searchQuery: "",
      movies: [],
      visibleMovies: [],
      selectedGenre: null,
      genres: [
        { name: 'Action' },
        { name: 'Comedy' },
        { name: 'Drama' },
        { name: 'Fantasy' },
        { name: 'Horror' },
        { name: 'Romance' },
        { name: 'Thriller' }
      ],
      pageSize: 10,
      nextPage: 0,
      loading: false
    };
  },
  mounted() {
    this.getAllMovies();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim()) {
        axios.get(`/search/${this.searchQuery.trim()}`)
          .then(response => {
            if (response.data) {
              this.$router.push({name: 'search', query: { q: this.searchQuery.trim() }});
            } else {
              console.log("영화를 찾을 수 없습니다.");
            }
          })
          .catch(error => {
            console.error("Error fetching movie detail:", error);
          });
      }
    },
    showDetail() {
    if (this.showDetail) {
        this.$router.push({ path: "/detail"});
      }
    },
    getAllMovies() {
      axios.get("/all").then(response => {
        this.movies = response.data;
        this.addMoviesToView();
      }).catch(error => {
        console.error("Error fetching movies:", error);
      });
    },
    addMoviesToView() {
      if (this.loading) return;
      this.loading = true;
      const nextBatch = this.movies.slice(this.nextPage * this.pageSize, (this.nextPage + 1) * this.pageSize);
      this.visibleMovies.push(...nextBatch);
      this.nextPage++;
      this.loading = false;
    },
    handleScroll() {
      let bottomOfWindow = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (bottomOfWindow && !this.loading) {
        this.addMoviesToView();
      }
    },
    filterMoviesByGenre() {
      if (this.selectedGenre) {
        this.visibleMovies = this.movies.filter(movie => movie.genres.includes(this.selectedGenre));
      } else {
        this.getAllMovies();
      }
    },
    showDetail(title) {
      axios.get(`/api/movie/${title}`)
        .then(response => {
          this.$router.push({ name: 'movie-detail', params: { title: response.data.title } });
        })
        .catch(error => {
          console.error("Error fetching movie detail:", error);
        });
    }
  }
};
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
  flexDirection: column;
  justify-content: center;
}
.text-center {
  text-align: center !important;
}
.text-h5 {
  font-size: 7em !important;
  font-weight: bold !important;
}
.genre-text {
  margin-top: 60px !important;
  font-size: 1.5em !important;
}
.genre-select {
  padding: 40px;
  margin-top: 20px !important;
}
</style>
