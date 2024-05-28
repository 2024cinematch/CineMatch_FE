<template>
  <v-container>
    <v-btn @click="goBack">이전으로</v-btn>
    <v-card>
      <v-card-title class="headline">{{ movieDetail.title }}</v-card-title>
      <v-card-subtitle class="subtitle">{{ movieDetail.genres }}</v-card-subtitle>
      <!-- 별점 입력과 코멘트 입력 -->
      <v-row>
        <!-- 별점 입력 -->
        <v-col cols="3" class="rating-col">
          <v-form @submit.prevent="submitComment">
            <v-rating v-model="rating" background-color="red" color="red" dense large></v-rating>
          </v-form>
        </v-col>
        <!-- 코멘트 입력 -->
        <v-col cols="6">
          <v-form @submit.prevent="submitComment">
            <v-text-field class="text-field" v-model="comment" label="영화에 대한 코멘트를 남겨주세요!🙌" required @keyup.enter="submitComment" color="red"></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="1">
          <v-btn class="button" @click="submitComment">글쓰기</v-btn>
        </v-col>
      </v-row>
      <!-- 코멘트 목록 -->
      <v-card v-for="(comment, index) in displayedComments" :key="index" class="comments">
        <v-rating v-model="comment.rating" background-color="transparent" color="red" dense></v-rating>
        <v-card-text>{{ comment.comment }}</v-card-text>
      </v-card>
      <div v-if="hasMoreComments" ref="loadMore" style="height: 100px; overflow-y: auto;">
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import axios from "@/axios";

export default {
  name: "MovieDetail",
  data() {
    return {
      movieDetail: {},
      comment: "",
      rating: 0,
      comments: [],
      displayedComments: [],
      loading: false,
      hasMoreComments: true,
      page: 1,
      perPage: 10
    };
  },
  mounted() {
    this.fetchMovieDetail();
    this.fetchComments();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    fetchMovieDetail() {
      const movieTitle = this.$route.params.title;
      axios.get(`/api/movie/${movieTitle}`)
        .then(response => {
          this.movieDetail = response.data;
        })
        .catch(error => {
          console.error("영화 상세정보를 불러오는 중 에러 발생:", error);
        });
    },
    fetchComments() {
      const movieTitle = this.$route.params.title;
      this.loading = true;
      axios.get(`/search/${movieTitle}/comments?page=${this.page}&perPage=${this.perPage}`)
        .then(response => {
          if (response.data.length === 0) {
            this.hasMoreComments = false;
          } else {
            this.comments = response.data.reverse();
            this.displayedComments = this.comments.slice(0, this.perPage);
            this.page++;
          }
          this.loading = false;
        })
        .catch(error => {
          console.error("코멘트를 불러오는 중 에러 발생:", error);
          this.loading = false;
        });
    },
    submitComment() {
      if (!this.comment.trim()) return;
      const movieTitle = this.$route.params.title;
      axios.post(`/search/${movieTitle}/comments`, { comment: this.comment, rating: this.rating })
        .then(response => {
          this.comments.push(response.data);
          this.fetchComments();
          this.comment = "";
          this.rating = 0;
        })
        .catch(error => {
          console.error("코멘트 전송 중 에러 발생:", error);
        });
    },
    handleScroll() {
      const container = this.$refs.loadMore;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight && !this.loading) {
        this.fetchMoreComments();
      }
    },
    fetchMoreComments() {
      if (!this.hasMoreComments) return;
      const movieTitle = this.$route.params.title;
      this.loading = true;
      axios.get(`/search/${movieTitle}/comments?page=${this.page}&perPage=${this.perPage}`)
        .then(response => {
          if (response.data.length === 0) {
            this.hasMoreComments = false;
          } else {
            const newComments = response.data.reverse();
            this.comments = [...this.comments, ...newComments];
            this.displayedComments = this.comments.slice(0, this.perPage * this.page);
            this.page++;
          }
          this.loading = false;
        })
        .catch(error => {
          console.error("코멘트를 불러오는 중 에러 발생:", error);
          this.loading = false;
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.headline {
  font-weight: bold;
  margin-bottom: 20px !important;
  margin-left: 10px !important;
}

.subtitle {
  font-size: 20px !important;
  margin-left: 10px !important;
}

.comments {
  margin-top: 20px !important;
  margin-left: 20px !important;
  margin-right: 20px !important;
  font-weight: bold;
  font-size: 20px !important;
  
  padding: 10px !important;
  
}

.button {
  margin-top: 20px !important;
}

.rating-col {
  padding-top: 25px !important;
  padding-left: 40px !important;
}
</style>
