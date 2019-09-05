import Vue from 'vue'
import Vuex from 'vuex'
import $api from '@/components/api.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        activeModeTable: true,
        events: [],
        main: {
            isEmpty: 1
        },
        about: {
            isEmpty: 1
        },
        contacts: {
            isEmpty: 1
        },
        faq: {
            isEmpty: 1
        },
        inst: {
            isEmpty: 1
        },
        isPreload: true
    },
    mutations: {
        SET_CALENDAR_DISPLAY: (state, payload) => {
            state.activeModeTable = payload;
        },
        SET_EVENTS: (state, payload) => {
            state[payload.name] = payload.data;
        },
        SET_MAIN: (state, payload) => {
            state.main = payload[0].acf;
            // state.main.slug = payload[0].slug;
            // state.main.title = payload[0].title.rendered;
        },
        SET_ABOUT: (state, payload) => {
            state.about = payload[0].acf;
            state.about.slug = payload[0].slug;
            state.about.title = payload[0].title.rendered;
        },
        SET_FAQ: (state, payload) => {
            console.log(payload);
            state.faq = payload;
            // state.faq.slug = payload[0].slug;
            // state.faq.title = payload[0].title.rendered;
        },
        SET_CONTACTS: (state, payload) => {
            console.log(payload);
            state.contacts = payload[0].acf;
            state.contacts.slug = payload[0].slug;
            state.contacts.title = payload[0].title.rendered;
            console.log(state.contacts)
        },
        SET_PRELOADER: (state, val) => {
            state.isPreload = val;
        },
        SET_INST: (state, val) => {
            state.inst = val;
        }
    },
    getters: {
        getEventsType: state => {
            let types = [];
            state.events.forEach((e) => {
                if (types.indexOf(e.type) < 0) {
                    types.push(e.type);
                }
            })
            return types;
        },
        getEventBySlug: state => slug => {
            return state.events.find(event => event.slug == slug) || {};
        },
        getAllAnswers: state => {
            let questions = [];

            for(let i = 0; i < state.faq.length; i++) {
                let question = state.faq[i].acf.qa;
                question.forEach(j => {
                    if(questions.indexOf(j.question.toLowerCase()) == -1) {
                        questions.push(j.question.toLowerCase())
                    }
                })
            }

            return questions;
        },
        getSlugByQuestion: state => q => {
            let slug = '';

            state.faq.find(topic => {
                topic.acf.qa.find(j => {
                    if(j.question.toLowerCase().indexOf(q) > -1) {
                        slug = topic.slug
                    }
                })
            })
            
            return slug
        }
    },
	actions: {
        GET_EVENTS: async (context) => {
            let {data} = await $api.events.get();
            console.log(data);
            context.commit('SET_EVENTS', {name: 'events', data: data});
        },
        GET_MAIN: async (context) => {
            let {data} = await $api.main.get();
            console.log(data)
            context.commit('SET_MAIN', data);
        },
        GET_ABOUT: async (context) => {
            let {data} = await $api.about.get();
            context.commit('SET_ABOUT', data);
        },
        GET_CONTACTS: async (context) => {
            let {data} = await $api.contacts.get();
            context.commit('SET_CONTACTS', data);
        },
        GET_FAQ: async (context) => {
            let {data} = await $api.faq.get();
            console.log(data)
            context.commit('SET_FAQ', data);
        },
        GET_INST: async (context) => {
            let data = await $api.inst.get();
            console.log(data.data);
            context.commit('SET_INST', data.data);
        }
    }
});