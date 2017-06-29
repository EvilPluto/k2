import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import * as d3 from 'd3';

// var d3 = require("d3");

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$d3 = d3;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

String.prototype.gblen = function() {  
	var len = 0;  
	for (var i=0; i<this.length; i++)
	if(this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {  
		len += 2;  
	} else {  
		len ++;  
	}
	return len;  
}