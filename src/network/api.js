import Vue from 'vue'
import router from '../router/index'
import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://autumnfish.cn',
    timeout: 5000
})

// request interceptors
instance.interceptors.request.use(config => {
    return config
}, err => {
    return Promise.reject(err)
})
// response interceptors
instance.interceptors.response.use(res => {
    return (res.data ? res.data : res)
}, err => {
    console.log('响应error');
})



// Swipe 轮播
// autumnfish.cn/banner
export const GetSwipe = () => instance.get('/banner')

// recommend list 推荐
export const GetRecommendList = () => instance.get('/personalized')

// new song
export const GetnewSong = () => instance.get('/personalized/newsong')

// play 播放
// id
export const GetPlaySongUrl = (id) => instance({
    url: '/song/url',
    method: 'get',
    params: {
        id: id
    }
})

// 推荐MV
export const GetRecommendMV = () => instance.get('/personalized/mv');


// 精品歌单
// cat 分类标签
// limit 数量
export const GetHighQualitySong = (params) => instance.get('/top/playlist/highquality', { params });

// 歌单列表
// limit: 单页显示数量
// offset分页
// cat分类标签
export const GetList = (params) => instance.get('/top/playlist/highquality', {params});

