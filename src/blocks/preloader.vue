<template lang="pug">
transition(name="fade")
    .preloader( v-if="isPreload" )
        .preloader__container
            .preloader__wrapper
                .preloader__text Loading...
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Preloader',
    data () {
        return {
        }
    },
    props: {
    },
    watch: {
    },
    methods: {
    },
    computed: {
        ...mapState([
            'isPreload'
        ])
    }
}
</script>

<style lang="scss" scoped>
    .fade-leave-active {
		transition: opacity .5s ease;
	}
	.fade-leave-to {
		opacity: 0;
	}

	// .fade-enter {
	// 	opacity: 0;
	// }

	// .fade-enter-active {
	// 	transition: opacity .5s ease;
	// }
    .preloader {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #fff;
        z-index: 10;

        &__container {
            width: 100%;
            height: 100%;
            position: relative;
        }

        &__wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &__text {
            position: relative;
            font: 700  20px 'Helvetica Neue LT Pro', sans-serif;
            color: #000;
            text-transform: uppercase;

            &:after {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #fff;
                content : '';
                animation: load 2s infinite linear;

                @keyframes load {
                    0% {
                        transform: translate3d(0, 0, 1px);
                    }

                    100% {
                        transform: translate3d(200%, 0, 1px);
                    }
                }
            }
        }
    }
</style>


