<template lang="pug">
    div
        preloader
        check-age
        block-header
        .faq
            .faq__poster
                .nav(data-aos="fade")
                    .nav__wrapper
                        .nav__title(data-aos="fade-up") Hi There.<br> We’re Here to Help
                        .nav__search(data-aos="fade-up")
                            input.nav__input(@keyup="searchController" v-model="hit" name="search" placeholder="can we help you find?" autocomplete="off")
                            button.nav__btn(type="button")
                                img(src="@/assets/img/search.svg")
                            .tooltip
                                router-link.tooltip__item(v-for="(i, index) in tooltip" :key="index" :to="`/faq/${getSlugByQuestion(i)}`" :class="[indexHit == index ? 'current': '']") {{i}}
                        .nav__topics(v-if="isDataLoaded")
                            .nav__title(data-aos="fade-up") Browse Popular Topics:
                            ul.nav__list
                                li.nav__item(v-for="item, i in faq" data-aos="fade-up")
                                    router-link.nav__link(:to="'faq/'+item.slug")
                                        img(:src="item.acf.icon")
                                        span {{ item.title.rendered }}
                .banner(data-aos="fade")
                    .banner__content(data-aos="fade-up")
                        .banner__title Didn’t find what you’re looking for?
                        router-link.banner__link(to="/contact-us") Contact our team
            .faq__wrapper
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
    import {mapState, mapGetters} from 'vuex';
    
    export default {
        name: 'Faq',
        data () {
            return {
                isDataLoaded: false,

                isAOS: false,
                isMobile: document.documentElement.clientWidth < 640,
                tooltip: [],
                indexHit: -1,
                hit: ''
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
        created() {
			if(this.faq.isEmpty) { this.$store.dispatch('GET_FAQ') } else { this.isDataLoaded = true; };
        },
        mounted () {
			this.checkAOS();
            this.checkDebice();
            if(this.faq.length) {
                this.$store.commit('SET_PRELOADER', false);
            } else {
                this.$store.commit('SET_PRELOADER', true);
            }
        },
        methods: {

            searchController () {
                if(event.keyCode == 38 || event.keyCode == 40) {
                    this.goToTooltip();
                } else if (event.keyCode == 13) {
                    this.redirect();
                } else {
                    this.search();
                }
            },
            goToTooltip () {
                let hits = document.getElementsByClassName('tooltip__item');

                if(hits.length == 0) {
                    return false;
                }
                
                if(event.keyCode == 40) {
                    this.indexHit < hits.length - 1 ? this.indexHit++ : this.indexHit = 0;
                } else if(event.keyCode == 38) {
                    if(this.indexHit < 1) {
                        this.indexHit = hits.length;
                    }
                    this.indexHit--;
                }

                this.hit = hits[this.indexHit].innerHTML;
            },
            redirect () {
                if(this.indexHit > -1) {
                    let path = document.getElementsByClassName('tooltip__item')[this.indexHit].pathname;
                    this.$router.push({path: path})
                }
            },
            search () {
                let request = event.target.value.toLowerCase(),
                    hits = [];

                this.indexHit = -1;

                this.getAllAnswers.forEach( i => {
                    if(i.indexOf(request) > -1) {
                        if(hits.indexOf(i) == -1) {
                            hits.push(i);
                        }
                    }
                });

                request == '' ? hits = [] : '';

                this.tooltip = hits;
            },

            checkDebice () {
                window.addEventListener('resize', () => {
                    document.documentElement.clientWidth < 640 ? this.isMobile = true : this.isMobile = false;
                });
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
        },
		computed: {
            ...mapState([
                'faq'
            ]),
            ...mapGetters([
                'getAllAnswers',
                'getSlugByQuestion'
			])
		},
		watch: {
			faq() {
                if(!this.faq.isEmpty) this.isDataLoaded = true;
                setTimeout(()=>{
                    this.$store.commit('SET_PRELOADER', false);
                }, 500);
            },
            getAllAnswers () {
                console.log('getAllAnswers ', this.getAllAnswers)
            },
		},
    }
</script>

<style lang="scss" scoped>
    .faq {
        &__poster {
            display: flex;
            margin-bottom: 83px;
        }

        &__wrapper {
            width: 100%;
            max-width: 1196px;
            margin: auto;
            padding: 0 30px;
			box-sizing: content-box;
        }
    }

    .nav {
        padding-top: 142px;
        padding-bottom: 109px;
        width: calc(50% + 10px);

        &__wrapper {
            max-width: 541px;
            margin: auto 0 auto auto;
            padding-left: 30px;
            padding-right: 65px;
			box-sizing: content-box;
        }

        &__title {
            font-size: 22px;
            line-height: 120.5%;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.75);
            margin-bottom: 29px;
            max-width: 293px;
        }

        &__search {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            position: relative;
        }

        &__input {
            width: calc(100% - 45px);
            height: 32px;
            line-height: 32px;
            border: 1px solid #C4C4C4;
            border-right: none;
            box-sizing: border-box;
            background: transparent;
            padding: 10px;
            font-size: 12px;

            &::placeholder {
                font-size: 12px;
                line-height: 32px;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.75);
                opacity: 0.5;
            }
        }

        &__btn {
            width: 45px;
            height: 32px;
            border: 1px solid #C4C4C4;
            border-left: none;
            box-sizing: border-box;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &__topics {
            margin-top: 72px;

            & > .nav__title {
                margin-bottom: 91px;
            }
        }

        &__list {
            display: grid;
            grid-template-columns: 140px 140px;
            grid-column-gap: 95px;
            grid-row-gap: 60px;
            padding-left: 11%;
        }

        &__link {
            display: flex;
            flex-direction: column;
            align-items: center;

            span {
                font-size: 12px;
                line-height: 114%;
                text-transform: uppercase;
                text-decoration-line: underline;
                color: #DF574E;
                margin-top: 35px;
                text-align: center;
            }
        }
    }

    .banner {
        width: calc(50% - 10px);
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items:center;
        justify-content: center;

        &__content {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 445px;
        }

        &__title {
            font-size: 22px;
            line-height: 114%;
            text-align: center;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 27px;
            text-align: center;
            padding-top: 4px;
        }

        &__link {
            font-size: 22px;
            line-height: 111%;
            text-align: center;
            text-transform: uppercase;
            text-decoration-line: underline;
            color: #DF574E;
            padding-bottom: 4px;
        }
    }

    .tooltip {
        position: absolute;
        z-index: 1;
        top: 100%;
        left: 0;
        height: auto;
        max-height: 300px;
        overflow-y: auto;
        width: 100%;
        box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.19);
        background: #fff;

        &__item {
            display: block;
            padding: 10px;
            width: 100%;
            font-size: 16px;
            background: #fff;

            &:hover {
                background: rgba(0,0,0,0.05);
            }

            &.current {
                background: rgba(0,0,0,0.05);
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
            &__poster {
                flex-direction: column;
                margin-bottom: 53px;
            }

            &__wrapper {
                padding: 0 31px;
                width: calc(100% - 62px);
            }
        }

        .nav {
            width: 100%;
            padding-top: 130px;
            padding-bottom: 57px;

            &__wrapper {
                max-width: none;
                padding: 0;
            }

            &__title {
                text-align: center;
                margin: 0 auto 21px;
            }

            &__search {
                max-width: 541px;
                margin: 0 auto;
            }

            &__topics {
                margin-top: 52px;

                & > .nav__title {
                    margin-bottom: 50px;
                }
            }

            &__list {
                padding-left: 0;
                justify-content: center;
                grid-column-gap: 120px;
                grid-row-gap: 53px;
            }

            &__link {
                /deep/ span {
                    margin-top: 22px;
                }
            }
        }

        .banner {
            width: 100%;
            height: auto;
            padding: 54px 0 49px;

            &__title {
                margin-bottom: 19px;
            }
        }

        .recommendations {
            padding-top: 29px;
            padding-bottom: 81px;
        }
    }

    @media screen and (max-width: 640px) {
        .faq {
            &__wrapper {
                padding: 0 28px;
                width: calc(100% - 56px);
            }

            &__poster {
                margin-bottom: 42px;
            }
        }

        .nav {
            padding-top: 108px;
            padding-bottom: 51px;

            &__title {
                font-size: 16px;
                line-height: 114%;
                margin-bottom: 17px;
            }

            &__search {
                max-width: none;
                width: 87%;
            }

            &__input {
                font-size: 10px;
                &::placeholder {
                    font-size: 10px;
                    line-height: 32px;
                }
            }
            
            &__topics {
                margin-top: 45px;

                & > .nav__title {
                    font-size: 16px;
                    line-height: 114%;
                    max-width: 270px;
                    margin-bottom: 20px;
                }
            }

            &__list {
                grid-template-columns: auto;
                grid-row-gap: 26px;
            }

            &__link {
                /deep/ span {
                    margin-top: 13px;
                    max-width: 139px;
                }
            }
        }

        .banner {
            padding: 49px 0 44px;

            &__content {
                max-width: 291px;
                margin: auto;
            }

            &__title {
                font-size: 16px;
                line-height: 114%;
                margin-bottom: 17px;
            }

            &__link {
                font-size: 16px;
                line-height: 111%;
            }
        }

        .recommendations {
            padding-bottom: 69px;
        }
    }

    @media screen and (max-width: 375px) {
        .faq {
            &__wrapper {
                padding: 0 14px;
                width: calc(100% - 28px);
            }
        }

        .nav {
            padding-top: 98px;

            &__title {
                margin-bottom: 15px;
            }

            &__search {
                width: 91%;
            }

            &__input {
                width: calc(100% - 36px);
            }

            &__btn {
                width: 36px;
            }

            &__topics {
                margin-top: 48px;
            }
        }

        .recommendations {
            padding-top: 32px;
            padding-bottom: 67px;
        }
    }
</style>


