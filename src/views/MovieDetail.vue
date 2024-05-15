<template>
  <v-container>
    <v-btn @click="goBack">이전으로</v-btn>
    <v-card>
      <v-card-title class="headline">{{ movieDetail.title }}</v-card-title>
      <v-card-subtitle class="subtitle">{{ movieDetail.genres }}</v-card-subtitle>
      <div class="rating">
        <v-card v-for="(star, index) in 5" :key="index">
          <svg class="star" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon :key="index" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </v-card>
      </div>
      <!-- 좋아요와 싫어요 아이콘 -->
      <div class="like-dislike-icons">
        <v-btn @click="like">
        <v-icon @click="like"  style="font-size: 40px;">mdi-thumb-up</v-icon></v-btn>
        <v-btn @click="dislike">
        <v-icon @click="dislike"  style="font-size: 40px !important; margin-left: 20px">mdi-thumb-down</v-icon></v-btn>
      </div>
      <!-- 코멘트 입력 -->
      <v-row>
        <v-col cols="3">
          <v-form @submit.prevent="submitComment">
            <v-text-field class="text-field" v-model="comment" label="영화에 대해 알려주세요!" required @keyup.enter="submitComment" color="red"></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="1">
          <v-btn class="button" @click="submitComment">글쓰기</v-btn>
        </v-col>
      </v-row>
      <!-- 코멘트 목록 -->
      <v-card v-for="(comment, index) in comments" :key="index">
        <v-card-text>{{ comment.content }}</v-card-text>
      </v-card>
      <!-- 별점 -->
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
      comments: [] 
    };
  },
  created() {
    this.fetchMovieDetail();
    this.fetchComments();
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
      axios.get(`/search/${movieTitle}/comments`)
        .then(response => {
          this.comments = response.data;
        })
        .catch(error => {
          console.error("코멘트를 불러오는 중 에러 발생:", error);
        });
    },
    submitComment() {
      if (!this.comment.trim()) return; 
      const movieTitle = this.$route.params.title;
      axios.post(`/search/${movieTitle}/comments`, { content: this.comment }) 
        .then(() => {
          this.fetchComments();
          this.comment = "";
        })
        .catch(error => {
          console.error("코멘트 전송 중 에러 발생:", error);
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

.rating {
  display: flex;
  align-items: center;
  padding: 10px !important;
}

.star {
  margin-left: 20px !important;
}

.text-field {
  padding: 15px !important;
}

.comments{
  margin-top: 20px !important;
  margin-left: 10px !important;
  font-weight: bold;
  font-size: 20px !important;
}

.button{
  margin-top: 20px !important;
}

.like-dislike-icons{
  padding: 20px !important;
}
</style>
