<template>
  <keep-alive>
    <div>
      <br>
      <!--제목, 장르 받아와서 출력-->
      <template v-if="selectedCard">
        <p class="title">{{ selectedCard.title }}</p>
        <br>
        <div class="genre">
          <h3 v-if="selectedCard.genre">{{ '장르: '+ selectedCard.genre.join(', ') }}</h3>
        </div>
      </template>
      <br>
      <!--평균 평점-->
      <div class="rating"> 
        <h3 v-if="selectedCard.rating">{{ '평점: '+ selectedCard.rating}}</h3>
      </div>
      <!--태그-->
      <div class="tag"> 
        <v-chip v-for="(tag, index) in selectedCard.tags" :key="index" class="chiptag">
          {{ tag }}
        </v-chip>
      </div>
      <!--평점 남기기-->
      <div>
        <v-rating 
        v-model="rating"
        class="star"
        background-color="grey lighten-1"
        half-increments
        color="red"
        hover
        length="5"
        size="64"
        ></v-rating>
      </div>
      <!--리뷰남기기-->
      <div>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-field-with-button">
                <v-text-field
                v-model="message"
                filled
                clear-icon="mdi-close-circle"
                clearable
                type="text"
                ></v-text-field>
                <v-btn @click="updateMessage">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </div>
              </v-col>
              
            </v-row>
          </v-container>
        </v-form>
       
      </div>
      <div v-if="displayedMessage">
        <p>{{ displayedMessage }}</p>
      </div>
    </div>
  </keep-alive>
</template>

<script>
export default ({
    name: 'DetailPage',
    props: {
    selectedCard: {
      type: Object,
      required: true,
      default: () => ({ genre: [], tags: [] })
    }
  },
    data(){
      return {
      cardId: null,
      rating:0,
      message: '', // 사용자의 입력을 저장하는 데이터
      icon: 'mdi-account',
      displayedMessage: ''
      };
    },
    methods: {
      updateMessage(){
        this.displayedMessage=this.message;
        this.message='';
      }
    },
  
})
</script>
<style>
.information{
  text-align: center;
  padding: 20px 0;
}

.v-application .title {/*글씨 크기 적용 안됨(수정필요) */
  font-size: 2em;
  display: flex;
  justify-content: center;
}
.genre, .rating, .tag{ 
  font-size: large;
  margin-left: calc(25% - 90px);

}
.star{
  display: flex;
  justify-content: center;

}

.good{
  margin-left: 160px;
}
.bad{
  margin-left: 50px;
}

.chiptag{
  margin-right: 10px;
}

.text-field-with-button {
  display: flex;
  align-items: center;
}

.text-field-with-button v-text-field {
  flex: 1;
}
</style>