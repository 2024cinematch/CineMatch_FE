import axios from 'axios';

// axios의 baseURL을 백엔드 서버의 주소로 설정
axios.defaults.baseURL = 'http://localhost:8080';

export default axios;
