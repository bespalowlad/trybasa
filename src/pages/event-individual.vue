<template lang="pug">
    div
        preloader
        check-age
        block-header
        .event
            .event__wrapper
                .poster
                    .poster__head( v-if="event != null")
                        .poster__date(v-if="isMobile" data-aos="fade-up")
                            span {{ transformDate(event.acf.date).time }}
                            span.separator |
                            span {{ transformDate(event.acf.date).day }} 
                            time {{ transformDate(event.acf.date).date }}
                        .poster__name(v-if="isMobile" data-aos="fade-up") {{ event.title.rendered }}
                        .poster__preview(data-aos="fade")
                            .poster__preview-inner(:style="{backgroundImage: 'url(' + event.acf.preview.url + ')'}")
                        .poster__content(data-aos="fade-up")
                            .poster__date(v-if="!isMobile")
                                span {{ transformDate(event.acf.date).time }}
                                span.separator |
                                span {{ transformDate(event.acf.date).day }} 
                                time {{ transformDate(event.acf.date).date }}
                            .poster__name(v-if="!isMobile") {{ event.title.rendered }}
                            .poster__description description:
                            .poster__text {{ event.acf.description }}
                            .poster__price
                                .poster__price-top {{ '$' + event.acf.ticket.price }}
                                .poster__price-bottom Includes Tax
                            .poster__buy
                                a(:href="event.acf.ticket.purchase_link" target="_blank" v-html="event.acf.ticket.price === '' || event.acf.ticket.price === '0' ? 'RSVP' : 'buy tickets'")
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
        name: 'Event',
        data () {
            return {
                event: null,
                isAOS: false,
                isMobile: document.documentElement.clientWidth < 960,
                days: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ]
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
            ...mapGetters([
				'getEventBySlug'
            ]),
            ...mapState([
                'events'
            ])
        },
        created () {
            if(!this.events.length) this.$store.dispatch('GET_EVENTS');
        },
        mounted () {
            if(this.events.length) {
                this.event = this.getEventBySlug(this.$route.params.slug);
            }

            if(this.event != null) {
                this.$store.commit('SET_PRELOADER', false);
            } else {
                this.$store.commit('SET_PRELOADER', true);
            }
            
            this.$nextTick(() => {
                this.checkAOS();
                this.checkDevice();
            })
        },
        watch: {
            events () {
                this.event = this.getEventBySlug(this.$route.params.slug);
                console.log(this.event);
            },
            event() {
                if(this.event != null) {
                    setTimeout(() => {
                        this.$store.commit('SET_PRELOADER', false)
                    }, 500);
                }
            }
        },
		methods: {
            checkDevice () {
                window.addEventListener('resize', () => {
                    document.documentElement.clientWidth < 960 ? this.isMobile = true : this.isMobile = false;
                })
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
            transformDate(d) {
                let res = {};
                let arrDate = d.split(' ');
                let cDate = arrDate.filter((item) => {return item.indexOf('/') > -1})[0];
                let arrCDate = cDate.split('/').reverse();
                arrCDate.forEach((item, i) => { Number(item);});
                arrCDate[1] = arrCDate[1] - 1;
                let date = new Date(...arrCDate);
                res.date = cDate;
                res.time = arrDate.slice(1).join(' ');
                res.day = this.days[date.getDay()];
                console.log(res);
                
                return res;

            }
		}
    }
</script>

<style lang="scss" scoped>

    .separator {
        margin: 0 20px;
    }
    .event {

        &__wrapper {
            width: 100%;
            max-width: 1196px;
            margin: auto;
            padding: 0 30px;
            box-sizing: content-box;
        }
    }

    .poster {
        margin-top: 109px;

        &__head {
            display: flex;
            align-items: flex-start;
        }

        &__preview {
            width: 49.16%;
            padding-bottom: 41.5%;
            position: relative;

            &-inner {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
        }

        &__content {
            margin-left: auto;
            max-width: 466px;
        }

        &__date {
            font-size: 18px;
            line-height: 114%;
            margin-bottom: 91px;
            text-transform: uppercase;

            time {
                margin-left: 6px;
            }
        }

        &__name {
            font-size: 22px;
            line-height: 114%;
            margin-bottom: 91px;
            text-transform: uppercase;
        }

        &__description {
            font-size: 18px;
            line-height: 114%;
            margin-bottom: 14px;
            text-transform: uppercase;
        }

        &__text {
            font-family: 'Overpass';
            // font-family: 'Helvetica Neue LT Pro';
            // text-transform: uppercase;
            font-size: 12px;
            line-height: 117.5%;
            font-weight: 400;
            margin-bottom: 94px;
            max-width: 466px;
        }

        &__price {
            padding-left: 3px;
            margin-bottom: 40px;

            &-top {
                font-size: 22px;
                line-height: 114%;
                text-transform: uppercase;
                margin-bottom: 0;
            }

            &-bottom {
                font-size: 12px;
                line-height: 114%;
                text-transform: uppercase;
                padding-left: 1px;
            }
        }

        &__buy {
            /deep/ a {
                font-size: 22px;
                line-height: 114%;
                text-decoration-line: underline;
                text-transform: uppercase;
                color: #DF574E;
                padding-left: 3px;
            }
        }
    }

    .social {
        margin-top: 143px;
    }

    @media screen and (max-width: 1256px) {
        .event {
            &__wrapper {
                max-width: none;
                width: calc(100% - 60px);
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .poster {
            &__date {
                margin-bottom: 70px;
            }

            &__name {
                margin-bottom: 60px;
            }

            &__text {
                margin-bottom: 60px;
            }

            &__price {
                margin-bottom: 23px;
            }

            &__preview {
                margin-right: 20px;
            }
        }

        .social {
            margin-top: 120px;
        }
    }

    @media screen and (max-width: 960px) {
        .events {
            &__wrapper {
                padding: 0 32px;
                width: calc(100%-64px);
            }
        }

        .poster {
            margin-top: 133px;

            &__head {
                flex-direction: column;
                align-items: center;
            }

            &__date {
                font-size: 18px;
                line-height: 114%;
                margin-bottom: 26px;
            }

            &__name {
                font-size: 22px;
                line-height: 114%;
                margin-bottom: 33px;
            }

            &__preview {
                margin-right: 0;
                width: 100%;
                max-width: 588px;
                max-height: 496px;
                padding-bottom: 70%;
                margin-bottom: 46px;
            }

            &__content {
                margin: auto;
            }

            &__description {
                text-align: center;
                margin-bottom: 14px;
            }

            &__text {
                text-align: center;
                margin-bottom: 24px;
            }

            &__price {
                text-align: center;
                margin-bottom: 34px;
            }

            &__buy {
                margin: 0 auto 55px;
                text-align: center;
                padding-left: 0;
            }
        }

        .social {
            margin-top: 0;
            margin-bottom: 29px;
        }

        .recommendations {
            padding-top: 0;
            padding-bottom: 81px;
        }
    }

    @media screen and (max-width: 640px) {
        .event {
            &__wrapper {
                padding: 0 29px;
                width: calc(100% - 58px);
            }
        }

        .poster {
            margin-top: 106px;

            &__head {
                align-items: flex-start;
            }

            &__date {
                font-size: 14px;
                line-height: 17px;
                margin-bottom: 16px;
            }

            &__name {
                font-size: 16px;
                line-height: 19px;
                margin-bottom: 24px;
            }

            &__preview {
                max-width: none;
                max-height: none;
                padding-bottom: 84.5%;
                margin-bottom: 31px;
            }

            &__content {
                margin-left: 0;
            }

            &__description {
                font-size: 14px;
                line-height: 17px;
                text-align: left;
                margin-bottom: 10px;
            }

            &__text {
                font-size: 10px;
                line-height: 133.5%;
                text-align: left;
                margin-bottom: 34px;
            }

            &__price {
                text-align: left;
                margin-bottom: 28px;
                padding-left: 0;

                &-top {
                    font-size: 18px;
                    line-height: 114%;
                    margin-bottom: 6px;
                }

                &-bottom {
                    font-size: 10px;
                    line-height: 114%;
                }
            }

            &__buy {
                text-align: left;
                margin-bottom: 46px;

                /deep/ a {
                    font-size: 18px;
                    line-height: 114%;
                }
            }
        }

        .social {
            margin-bottom: 29px;
        }

        .recommendations {
            padding-bottom: 69px;
        }
    }

    @media screen and (max-width: 375px) {
        .event {
            &__wrapper {
                padding: 0 14px;
                width: calc(100% - 28px);
            }
        }

        .poster{
            margin-top: 99px;

            &__preview {
                margin-bottom: 31px;
            }

            &__text {
                margin-bottom: 23px;
            }
        }

        .recommendations {
            padding-bottom: 66px;
        }
    }
</style>



