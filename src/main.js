import Vue from 'vue';
import VueRouter from 'vue-router';
import {store} from './components/store.js';
import VueSlideUpDown from 'vue-slide-up-down'


//Pages
import Main from './pages/main.vue';
import EventIndividual from './pages/event-individual.vue';
import ContactUs from './pages/contact-us.vue';
import Events from './pages/events.vue';
import Faq from './pages/faq.vue';
import FaqCategory from './pages/faq-category.vue';
import About from './pages/about.vue';
import Menu from './pages/menu.vue';
import Cart from './pages/cart.vue';

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

// Vue.use($store);
Vue.use(VueRouter);
Vue.component('vue-slide-up-down', VueSlideUpDown)


var browserDetecter = function() {

    var browser = 'unknown';

    var is_chrome = !!window.chrome && !is_opera;
    if (is_chrome) {
        browser = 'chrome';
    }
    var is_explorer= typeof document !== 'undefined' && !!document.documentMode;
    if (is_explorer) {
        browser = 'ie';
    }
    var is_firefox = typeof window.InstallTrigger !== 'undefined';
    if (is_firefox) {
        browser = 'firefox';
    }
    var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (is_safari) {
        browser = 'safari';
    }
    var is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (is_opera) {
        browser = 'is_opera';
    }

    if (window.navigator.userAgent.indexOf("Edge") > -1) {
        browser = 'edge';
    }

    window.browser = browser;
    document.body.classList.add('browser-' + browser);
};
browserDetecter();

const routesList = [
    {path : '/', name: 'main', component: Main },
    // {path : '/event', name: 'EventIndividual', component: EventIndividual },
    {path : '/events/:slug', name: 'EventIndividual', component: EventIndividual },
    {path : '/contact-us', name: 'ContactUs', component: ContactUs },
    {path : '/events', name: 'Events', component: Events },
    {path : '/faq', name: 'Faq', component: Faq },
    {path : '/faq/:slug', name: 'FaqCategory', component: FaqCategory },
    {path : '/about', name: 'About', component: About },
    {path : '/store/menu', name: 'Menu', component: Menu },
    {path : '/store/cart', name: 'Cart', component: Cart }
];

const router = new VueRouter({
	mode: 'history',
    routes: routesList,
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
});

new Vue({
	el: "#app",
	router: router,
	store: store
});