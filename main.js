import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import App from './App'
import Json from './Json' //测试用数据
import share from './common/share.js'
Vue.use(VueAxios, axios)
Vue.mixin(share)
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

//  常规配置项
axios.defaults.baseURL = 'https://hm.zhugokeji.com/index.php/api/api'; //  请求服务器具体的地址
Vue.config.productionTip = false;
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()