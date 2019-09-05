<template lang="pug">
    div
        preloader
        check-age
        block-header
        .faq(:class="[$route.params ? $route.params.slug : '']")
            .faq__wrapper
                .poster(v-if="isDataLoaded")
                    .poster__title(v-html="getTitle" data-aos="fade-up")
                    .poster__popular-topics
                        .poster__topic(v-for="item, i in faqCategory.acf.qa" :key="i" data-aos="fade-up")
                            .poster__header(@click="setDisplayTopic($event,i)")
                                p {{ item.question }}
                                img.arrow-slide-down(src="@/assets/img/arrow-slide-down.svg")
                                img.arrow-slide-up(src="@/assets/img/arrow-slide-up.svg")
                            vue-slide-up-down(:active="showTopic[i]" :duration="500")
                                .poster__text(v-html="item.answer")
                    .poster__contact(data-aos="fade-up")
                        .poster__title Didn’t find what you’re looking for?
                        router-link.poster__link(to="/contact-us") contact our team
                social-block
                recommendations
        block-footer
</template>

<script>
    import Header from '@/blocks/header.vue';
    import Footer from '@/blocks/footer.vue';
    import Social from '@/blocks/social-networks.vue';
    import Recommendations from '@/blocks/recommendations.vue';
    import CheckAge from '@/blocks/checkAge.vue';
    import Preloader from '@/blocks/preloader.vue';

    import AOS from 'aos';
    import {mapState} from 'vuex';

    export default {
        name:'Faq-selection',
        data () {
            return {
                isDataLoaded: false,
                faqCategory: {},

                topicTitle: ['the basics', 'buying cannabis from us', 'our selection', 'our perks'],
                topics: 0,
                showTopic: [],
                isAOS: false,
            }
        },
        components: {
            'block-header': Header,
            'block-footer': Footer,
            'social-block': Social,
            'recommendations': Recommendations,
            'check-age': CheckAge,
            'preloader': Preloader
        },
        computed: {
            getTitle () {
                let title = '';
                this.topicTitle.forEach((i, idx) => {
                    if(i.indexOf(this.$route.params.slug) > -1 ) {
                        title = this.topicTitle[idx]
                    }
                })
                return title
            },
            ...mapState([
                'faq'
            ])
        },
        methods: {
            setDisplayTopic (e, idx) {
                let header = e.target.parentNode;
                header.classList.toggle('show');

                this.showTopic.splice(idx, 1, !this.showTopic[idx]);
            },
            startAOS() {
                this.$nextTick(function() {
                    AOS.init({
                        once: true,
                        disabled: 'mobile',
                        // offset: 0,
                        duration: 1000
					});
				});
				this.isAOS = true;
			},
			checkAOS() {
				if (!this.isAOS) {
					this.startAOS();
				}
            },
            getTopicsArr () {
                this.topics = this.faqCategory.acf.qa.length;
                    
                for(let i = 0; i < this.topics; i++) {
                    this.showTopic.push(false);
                }
            }
        },
        created () {
			if(this.faq.isEmpty) {
                this.$store.dispatch('GET_FAQ')
            } else { 
                var i = 0;
                for(;i<this.faq.length;i++) {
                    if(this.$route.params.slug == this.faq[i].slug) {
                        this.faqCategory = this.faq[i];
                        this.getTopicsArr();
                    }
                }
                this.isDataLoaded = true;
            };
        },
        mounted () {
            this.checkAOS();

            if(this.faq.length) {
                this.$store.commit('SET_PRELOADER', false);
            } else {
                this.$store.commit('SET_PRELOADER', true);
            }
        },
		watch: {
			faq() {
				if(!this.faq.isEmpty) { 
                    this.isDataLoaded = true;

                    var i = 0;
                    for(;i<this.faq.length;i++) {
                        if(this.$route.params.slug == this.faq[i].slug) {
                            this.faqCategory = this.faq[i];
                        }
                    }

                    this.getTopicsArr();
                }
                setTimeout(()=>{
                    this.$store.commit('SET_PRELOADER', false);
                }, 500);
            },
            showTopic () {
                console.log('topics ', this.showTopic);
            }
		},
    }
</script>

<style lang="scss" scoped>
    .faq {
        &__wrapper {
            width: 100%;
            max-width:956px;
            margin: auto;
            padding: 0 30px;
			box-sizing: content-box;
        }

        &.basics {
            .poster__title {
                &:after {
                    content: url('../assets/img/topics-1.svg');
                }
            }
        }

        &.buying {
            .poster__title {
                &:after {
                    content: url('../assets/img/topics-2.svg');
                }
            }
        }

        &.selection {
            .poster__title {
                &:after {
                    content: url('../assets/img/topics-3.svg');
                }
            }
        }

        &.perks {
            .poster__title {
                &:after {
                    content: url('../assets/img/topics-4.svg');
                }
            }
        }
    }

    .poster {
        padding-top: 150px;
        padding-bottom: 96px;

        &__title {
            font-size: 22px;
            line-height: 114%;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            margin-bottom: 93px;
            position: relative;

            &:after {
                position: absolute;
                top: -12px;
                left: -11%;
            }
        }

        &__popular-topics {
            display: flex;
            flex-wrap: wrap;
        }

        &__topic {
            width: calc(50% - 64px);
            margin-bottom: 15px;

            &:nth-child(2n) {
                margin-left: 128px;

                p {
                    padding-left: 0;
                }
            }
        }

        &__header {
            position: relative;
            font-size: 18px;
            line-height: 114%;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            margin-bottom: 15px;
            cursor: pointer;

            p {
                max-width: 309px;
            }

            .arrow-slide-down {
                position: absolute;
                top: 3px;
                right: 2px;
                transition: .3s opacity ease;
            }

            .arrow-slide-up {
                position: absolute;
                top: 3px;
                right:2px;
                transition: .3s opacity ease;
                opacity: 0;
            }

            &.show {
                .arrow-slide-up {
                    opacity: 1;
                }
                .arrow-slide-down {
                    opacity: 0;
                }
            }
        }

        &__text {
            font-family: 'Overpass';
            font-size: 12px;
            line-height: 120.5%;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.75);
            margin-bottom: 25px;
            max-width: 344px;

            /deep/ a {
                font-family: 'Helvetica Neue LT Pro';
                font-size: 12px;
                color: #DF574E;
                text-decoration-line: underline;
                text-transform: uppercase;
            }

            /deep/ p {
                margin-bottom: 15px;
            }
        }

        &__contact {
            margin-top: 192px;
            display: flex;
            flex-direction: column;
            align-items: center;

            & > .poster__title {
                margin-bottom: 15px;
                text-align: center;
                max-width: 560px;

                &:after {
                    display: none;
                }
            }

            & > .poster__link {
                font-size: 22px;
                line-height: 111%;
                text-align: center;
                text-decoration-line: underline;
                color: #DF574E;
                text-transform: uppercase;
            }
        }
    }

    @media screen and (max-width: 1256px) {
        .faq {
            &__wrapper {
                max-width: none;
                width: calc(100% - 60px);
            }
        }
    }

    @media screen and (max-width: 960px) {
        .faq {
            &__wrapper {
                padding: 0 31px;
                width: calc(100% - 62px);
            }
        }

        .poster {
            padding-top: 130px;
            padding-bottom: 60px;

            &__title {
                padding-left: 69px;
                margin-bottom: 31px;

                &:after {
                    left: 0;
                }
            }

            &__topic {
                width: 100%;
                margin-bottom: 7px;

                &:nth-child(2n) {
                    margin-left: 0;
                }
            }

            &__text {
               max-width: 650px; 
            }

            &__contact {
                margin-top: 50px;

                & > .poster__title {
                    font-size: 22px;
                    line-height: 114%;
                    margin-bottom: 0 auto 15px;
                    padding-left: 0;
                    max-width: 455px;
                }
            }
        }
    }

    @media screen and (max-width: 640px) {
        .faq {
            &__wrapper {
                padding: 0 28px;
                width: calc(100% - 56px);
            }

            &.basics {
                .poster__title {
                    &:after {
                        content: url('../assets/img/topics-mobile-1.svg');
                    }
                }
            }

            &.buying {
                .poster__title {
                    &:after {
                        content: url('../assets/img/topics-mobile-2.svg');
                    }
                }
            }

            &.selection {
                .poster__title {
                    &:after {
                        content: url('../assets/img/topics-mobile-3.svg');
                    }
                }
            }

            &.perks {
                .poster__title {
                    &:after {
                        content: url('../assets/img/topics-mobile-4.svg');
                    }
                }
            }
        }

        .poster {
            padding-top: 107px;
            padding-bottom: 36px;

            &__title {
                font-size: 16px;
                line-height: 114%;
                margin-bottom: 25px;
                padding-left: 54px;
            }

            &__header {
                font-size: 14px;
                line-height: 114%;

                .arrow-slide-down {
                    right: 0;
                }

                .arrow-slide-up {
                    right: 0;
                }
            }

            &__topic {
                margin-bottom: 0;
            }

            &__text {
                max-width: 316px;
                font-size: 10px;
                line-height: 120.5%;
                margin-bottom: 22px;

                /deep/ p {
                    margin-bottom: 10px;
                }
            }

            &__contact {
                margin-top: 36px;

                & > .poster__title {
                    font-size: 16px;
                    line-height: 114%;
                    max-width: 291px;
                }

                & > .poster__link {
                    font-size: 16px;
                    line-height: 111%;
                }
            }
        }

        .recommendations {
            padding-top: 36px;
            padding-bottom: 72px;
        }
    }

    @media screen and (max-width: 375px) {
        .faq {
            &__wrapper {
                padding: 0 14px;
                width: calc(100% - 28px);
            }
        }

        .poster {
            padding-top: 98px;
            padding-bottom: 46px;

            &__title {
                padding-left: 54px;
                margin-bottom: 28px;
            }

            &__header {
                margin-bottom: 14px;

                p {
                    max-width: 221px;
                }
            }

            &__text {
                /deep/ p {
                    max-width: 266px;
                }
            }

            &__contact {
                margin-top: 30px;
            }
        }

        .recommendations {
            padding-bottom: 70px;
        }
    }
</style>