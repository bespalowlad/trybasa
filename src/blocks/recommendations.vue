<template lang="pug">
    .recommendations
        .recommendations__slider(data-aos="fade-up" v-if="!inst.isEmpty")
            slick(ref="slick" :options="slickOptions")
                a.recommendations__slide( v-for="(slide, index) in inst" :key="index" :href="slide.link" data-aos="fade" target="_blank")
                    .recommendations__img(:style="{backgroundImage: 'url('+ slide.images.standard_resolution.url +')'}")
                    .recommendations__name @{{ slide.user.username }}
</template>

<script>
    import Slick from 'vue-slick';
    import { mapState } from 'vuex';

    export default {
        name: 'Recommendations',
        data () {
            return {
                slickOptions: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    autoplay: false,
                    arrow: true,
                    responsive: [
                        {
                            breakpoint: 960,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 640,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 400,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        },
                    ]
                }
            }
        },
        created() {
            if(this.inst.isEmpty) this.$store.dispatch('GET_INST');
        },
        computed: {
            ...mapState([
                'inst'
            ])
        },
        components: {
            Slick
        },
    }
</script>

<style lang="scss" scoped>
.recommendations {
    padding-top: 79px;
    padding-bottom: 114px;

    &__slider {
        max-width: 955px;
        margin: 0 auto;
    }

    &__slide {
        width: 178px !important;
    }

    &__img {
        width: 100% !important;
        height: 178px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        margin-bottom: 10px;
    }

    &__name {
        font-size: 12px;
        line-height: 120.5%;
        text-transform: uppercase;
        color: #262626;
    }

    /deep/ .slick-arrow {
        font-size: 0;
        width: 14px;
        height: 9px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        position: absolute;
        bottom: calc(50% + 6px);
        transform: translateY(-50%);
    }

    /deep/ .slick-prev {
        left: -31px;
        background-image: url('../assets/img/arrow-left-red.svg');
    }

    /deep/ .slick-next {
        right: -28px;
        background-image: url('../assets/img/arrow-right-red.svg');
    }

    /deep/ .slick-slide {
        margin-right: 15px;
    }

    /deep/ .slick-list {
        margin-right: -15px;
    }
}

    @media screen and (max-width: 1200px) {
        .recommendations {
            &__slider {
                max-width: none;
                width: 100%;
            }

            &__slide {
                margin-right: 15px;
            }

            /deep/ .slick-slide {
                margin: 0 5px;
            }

            /deep/ .slick-list {
                margin: 0 -5px;
            }

            /deep/ .slick-next {
                right: -25px;
            }

            /deep/ .slick-prev {
                left: -25px;
            }
        }
    }

    @media screen and (max-width: 960px) {
        .recommendations {

            &__slider {
                width: calc(100% + 70px);
                margin-bottom: 35px;
            }

            /deep/ .slick-current {
                & + .slick-slide + .slick-slide + .slick-slide {
                    opacity: 0.3;
                }
            }

            /deep/ .slick-prev {
                bottom: -35px;
                left: 42% !important;
                transform: translateX(-50%);
                background-image: url('../assets/img/arrow-prev-cal.svg');
                width: 25px;
                height: 8px;
            }

            /deep/ .slick-next {
                bottom: -35px;
                right: 51% !important;
                transform: translateX(50%);
                background-image: url('../assets/img/arrow-next-cal.svg');
                width: 25px;
                height: 8px;
            }

            /deep/ .slick-slide {
                margin: 0;
            }

            /deep/ .slick-list {
                margin: 0;
            }
        }
    }

    @media screen and (max-width: 720px) {
        .recommendations {
            &__slider {
                width: calc(100% + 140px);
            }

            /deep/ .slick-prev {
                left: 38% !important;
            }

            /deep/ .slick-next {
                right: 55% !important;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .recommendations {
            &__slider {
                width: calc(100% + 120px);
                margin-bottom: 27px;
            }

            &__slide {
                width: 142px !important;
                margin-right: 0;
            }

            &__img {
                height: 142px;
            }

            &__name {
                font-size: 10px;
                line-height: 120.5%;
            }

            /deep/ .slick-slide {
                margin: 0;
            }

            /deep/ .slick-list {
                margin: 0;
            }

            /deep/ .slick-current {
                & + .slick-slide + .slick-slide {
                    opacity: .3;

                    & + .slick-slide {
                        // opacity: 1;
                    }
                }
            }

            /deep/ .slick-prev {
                bottom: -27px;
                left: 29% !important;
                transform: none;
            }

            /deep/ .slick-next {
                bottom: -27px;
                left: 41% !important;
                transform: none;
            }
        }
    }

    @media screen and (max-width: 375px) {
        .recommendations {
            &__slider {
                margin-bottom: 24px;
                width: calc(100% + 5px);
            }

            /deep/ .slick-current {
                & + .slick-slide + .slick-slide {
                    opacity: 1;

                    & + .slick-slide {
                        opacity: 1;
                    }
                }
            }

            /deep/ .slick-prev {
                bottom: -24px;
                left: 35% !important;
            }

            /deep/ .slick-next {
                bottom: -24px;
                right: 37% !important;
                left: auto !important;
            }
        }
    }
</style>

