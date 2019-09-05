<template lang="pug">
	div
		preloader
		check-age
		block-header
		.about(v-if="isDataLoaded")
			.poster
				slick.poster__slider(ref="slick" :options="slickOptions")
					.poster__slide(v-for="item, i in about.gallery" :key="i" data-aos="fade" :style="{backgroundImage: 'url(' + item.url + ')'}")
			.banner(data-aos="fade-up")
				.wrapper
					.banner__title {{ about.about.title }}
					.banner__text(v-html="about.about.description")
			.advantage(data-aos="fade-up")
				.advantage__outer
					.wrapper
						ul.advantage__list
							li.advantage__item(v-for="item, i in about.advantages")
								img(:src="item.icon")
								.advantage__img(:style="{'background-image': 'url('+ item.icon +')'}")
								.advantage__content
									.advantage__header {{ item.title }}
									.advantage__text {{ item.description }}
			.topic(data-aos="fade-up")
				.wrapper
					.topic__title {{ about.topic.title }}
					.topic__text
						p {{ about.topic.description }}
			.wrapper
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

	import Slick from 'vue-slick';
	import AOS from 'aos';
    import {mapState} from 'vuex';

	export default {
		name: 'About',
		data () {
			return {
				isDataLoaded: false,

				slickOptions: {
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: false,
					arrows: true,
					centerMode: true,
				},
				isAOS: false,
				desktop: document.documentElement.clientWidth > 640
			}
		},
		components: {
			'block-header': Header,
			'block-footer': Footer,
			'social-block': Social,
			'recommendations': Recommendations,
			'check-age': CheckAge,
			'preloader': Preloader,
			Slick
		},
		created() {
			if(this.about.isEmpty) { 
				this.$store.dispatch('GET_ABOUT') 
			} else {
				this.checkDataLoad() 
			};
		},
		mounted () {
			this.checkAOS();
			this.checkDevice();
			if(!this.about.isEmpty) {
				this.$store.commit('SET_PRELOADER', false);
			} else {
				this.$store.commit('SET_PRELOADER', true);
			}
		},
		computed: {
            ...mapState([
                'about'
            ])
		},
		watch: {
			about() {
				setTimeout(() => {
					this.$store.commit('SET_PRELOADER', false);
				}, 500);
				if(!this.about.isEmpty) this.isDataLoaded = true;
			}
		},
		methods: {
			checkDataLoad: function() {
				if(!this.about.isEmpty) {
					this.isDataLoaded = true;
				}
			},
			checkDevice () {
				window.addEventListener('resize', () => {
					document.documentElement.clientWidth > 640 ? this.desktop = true : this.desktop = false 
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
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		width: 100%;
		max-width: 1196px;
		margin: auto;
		padding: 0 30px;
		box-sizing: content-box;
	}

	.poster {
		padding-top: 84px;

		&__slide {
			height: 572px;
			width: 100% !important;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
		}

		/deep/ .slick-slide {
			margin: 0 10px;
		}

		/deep/ .slick-list {
			padding: 0 110px !important;
		}

		/deep/ .slick-prev {
			font-size: 0;
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			height: 100%;
			width: 110px;
		}

		/deep/ .slick-next {
			font-size: 0;
			position: absolute;
			z-index: 1;
			top: 0;
			right: 0;
			height: 100%;
			width: 110px;
		}
	}

	.banner {
		padding-top: 71px;

		&__title {
			font-size: 22px;
			line-height: 84.5%;
			text-transform: uppercase;
			color: rgba(38, 38, 38, 0.91);
			margin-bottom: 45px;
			text-align: center;
		}

		&__text {
			padding-bottom: 74px;
			padding-bottom: 70px;

			/deep/ p {
				font-size: 22px;
				line-height: 31px;
				text-align: center;
				text-transform: uppercase;
				margin-bottom: 31px;
				color: #262626;

				&:last-child {
					margin-bottom: 0;
				}
			}

			// /deep/ span {
			/deep/ strong {
				color: #DF574E;
			}
		}
	}

	.advantage {
		padding-bottom: 85px;

		&__img {
			display: none;
			min-width: 27px;
			width: 27px;
			height: 27px;
			vertical-align: top;
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center;
			margin-right: 17px;
			margin-top: 3px;
		}

		&__outer {
			background: rgba(38, 38, 38, 0.91);
			padding-top: 61px;
			padding-bottom: 87px;

			& > * {
				color: #fff;
			}
		}

		&__title {
			font-size: 22px;
			line-height: 114%;
			text-transform: uppercase;
			color: rgba(38, 38, 38, 0.91);
			margin-bottom: 47px;
		}

		&__list {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
		}

		&__item {
			display: flex;
			align-items: flex-start;

			img {
				margin-right: 30px;
				margin: 5px 30px 0 2px;
			}

			&:nth-child(2) {
				img {
					margin: -17px 5px 0 -24px;
				}

				.advantage__content {
					width: 224px;
				}
			}

			&:nth-child(3) {
				img {
					margin: 0 24px 0 25px;
				}
			}

			&:nth-child(4) {
				img {
					margin: 3px 21px 0 37px;
				}
			}
		}

		&__content {
			width: 232px;

			.advantage__text {
				line-height: 120.5%;
				width: 79%;
			}
		}

		&__header {
			font-size: 22px;
			line-height: 114%;
			text-transform: uppercase;
			margin-bottom: 26px;
			max-width: 213px;
		}

		

		&__text {
			font-family: 'Overpass';
			font-size: 16px;
			font-weight: 400;
			line-height: 140%;
		}
	}

	.topic {
		padding-bottom: 92px;

		&__title {
			font-size: 22px;
			line-height: 114%;
			text-transform: uppercase;
			color: rgba(38, 38, 38, 0.91);
			margin-bottom: 25px;
		}

		&__text {
			/deep/ p {
				font-family: 'Overpass';
				font-size: 16px;
				line-height: 140%;
				font-weight: 400;
				color: rgba(38, 38, 38, 0.91);
			}
		}
	}

	@media screen and (max-width: 1256px) {
        .wrapper {
            max-width: none;
            width: calc(100% - 60px);
        }
	}
	
	@media screen and (max-width: 1200px) {
		.advantage {
			&__list {
				flex-wrap: wrap;
				justify-content: space-between;
			}

			&__item {
				width: 50%;
				justify-content: center;
				margin-bottom: 60px;

				&:nth-child(n + 3) {
					margin-bottom: 0;
				}

				&:nth-child(3n) {
					img {
						margin-left: 0;
					}
				}

				&:nth-child(4n) {
					img {
						margin-left: 9px;
					}
				}
			}
		}
	}

	@media screen and (max-width: 960px) {
		.poster {
			padding-top: 78px;
			padding-bottom: 0;

			&__slide {
				height: 338px;
			}

			/deep/ .slick-list {
				padding: 0 25px !important;
			}

			/deep/ .slick-prev {
				width: 25px;
			}

			/deep/ .slick-next {
				width: 25px;
			}

			/deep/ .slick-slide {
				margin: 0 8px;
			}
		}

		.banner {
			padding-top: 58px;

			&__title {
				text-align: left;
				margin-bottom: 25px;
			}

			&__text {
				padding-bottom: 56px;

				/deep/ p {
					text-align: left;
					line-height: 27px;
				}
			}
		}

		.advantage {
			padding-bottom: 64px;

			&__outer {
				padding-top: 45px;
				padding-bottom: 87px;
			}

			&__title {
				margin-bottom: 37px;
			}

			&__item {
				justify-content: flex-start;
				margin-bottom: 70px;

				&:nth-child(1) {
					img {
						margin-right: 23px;
					}
				}

				&:nth-child(2n) {
					padding-left: 24px;
					
					.advantage__content {
						width: 100% !important;
					}
				}

				&:nth-child(n + 3) {
					margin-bottom: 0;

					img {
						margin-right: 17px;
					}
				}

				&:nth-child(4) {
					img {
						margin: 0 22px 0 4px;
					}

					.advantage__content {
						width: 100% !important;
					}
				}
			}

			&__header {
				margin-bottom: 13px;
			}

			&__content {
				width: 100% !important;
			}

			&__text {
				width: 93% !important;
			}
		}

		.topic {
			padding-bottom: 100px;

			&__title {
				margin-bottom: 18px;
			}
		}

		.recommendations {
			padding-top: 54px;
			padding-bottom: 84px;
		}
	}

	@media screen and (max-width: 640px) {
		.wrapper {
			padding: 0 28px;
			width: calc(100% - 56px);
		}

		.poster {
			padding-top: 74px;

			&__slide {
				height: 172px;
			}

			/deep/ .slick-list {
				padding: 0 23px !important;
			}

			/deep/ .slick-prev {
				width: 23px;
			}

			/deep/ .slick-next {
				width: 23px;
			}

			/deep/ .slick-slide {
				margin: 0 5px;
			}
		}

		.banner {
			padding-top: 39px;

			&__title {
				font-size: 16px;
				line-height: 84.5%;
			}

			&__text {
				padding-bottom: 44px;

				/deep/ p {
					font-size: 12px;
					line-height: 16px;
					margin-bottom: 15px;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		}

		.advantage {
			padding-bottom: 0;

			&__img {
				min-width: 27px;
				width: 27px;
				height: 27px;
				display: inline-block;
				vertical-align: top;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				margin-right: 17px;
				margin-top: 3px;
			}

			&__title {
				font-size: 16px;
				line-height: 114%;
				margin-bottom: 18px;
			}

			&__text {
				width: 100% !important;
				font-size: 16px;
				line-height: 120.5%;
			}

			&__outer {
				padding-top: 27px;
				padding-bottom: 19px;
			}

			&__item {
				width: 100%;
				margin-bottom: 47px !important;
				padding: 0 !important;

				img {
					margin: 4px 16px 0 0 !important;
					display: none;
				}

				&:first-child {
					.advantage__header {
						max-width: 111px;
					}
				}

				&:nth-child(2) {
					img {
						margin: -7px 8px 0 -8px !important;
					}

					.advantage__header {
						max-width: 134px;
					}

					.advantage__content {
						width: 87% !important;
					}
				}

				&:nth-child(3) {

					img {
						margin: 3px 16px 0 1px !important;
					}
				}

				&:nth-child(4) {
					margin-bottom: 0 !important;

					img {
						margin: 0 22px 0 0px !important;
					}

					.advantage__header {
						max-width: 107px;
					}

					.advantage__content {
						width: 70% !important;
					}
				}
			}

			

			&__content {
				width: 100% !important;
			}

			&__header {
				font-size: 16px;
				line-height: 114%;
				margin-bottom: 5px;
			}
		}

		.topic {
			padding-top: 61px;
			padding-bottom: 61px;

			&__title {
				font-size: 16px;
				line-height: 126%;
				margin-bottom: 12px;
			}
		}

		.recommendations {
			padding-top: 43px;
			padding-bottom: 75px;
		}
	}

	@media screen and (max-width: 375px) {
		.wrapper {
			padding: 0 14px;
			width: calc(100% - 28px);
		}

		.poster {
			padding-top: 73px;

			&__slide {
				height: 140px;
			}

			/deep/ .slick-list {
				padding: 0 10px !important;
			}

			/deep/ .slick-prev {
				width: 10px;
			}

			/deep/ .slick-next {
				width: 10px;
			}
		}

		.banner {
			padding-top: 32px;

			&__title {
				margin-bottom: 19px;
			}

			&__text {
				padding-bottom: 36px;
			}
		}

		.advantage {

			&__outer {
				padding-bottom: 16px;
			}

			&__item {
				margin-bottom: 29px !important;

				&:last-child {
					margin-bottom: 0 !important;
				}

				&:nth-child(3) {
					margin-bottom: 42px !important;
				}

				&:nth-child(4) {
					.advantage__content {
						width: 100% !important;
					}

					.advantage__header {
						margin-bottom: 8px;
					}
				}
			}
		}

		.topic {
			padding-top: 50px;
			padding-bottom: 55px;
		}

		.recommendations {
			padding-top: 45px;
			padding-bottom: 74px;
		}
	}
</style>


