<template lang="pug">
	div
		preloader
		check-age
		block-header
		.main(v-if="isDataLoaded")
			.poster
				slick.poster__slider(ref="slick" :options="slickOptions")
					.poster__slide(v-for="item, i in main.gallery" :key="i" data-aos="fade" :style="{backgroundImage: 'url(' + item.url + ')'}")
				.poster__greeting(data-aos="fade-up")
					.poster__wrapper
						.delivery
							.delivery__welcom Welcome to Basa
							.poster__controls
								.btn-standart.poster__delivery(@click.once="checkZipCode = !checkZipCode" :class="checkZipCode == true || requestShow == true ? 'active-tab' : ''") DELIVERY
								router-link.btn-standart.poster__pick-up(to="/store/menu") PICK-UP

							.check-code
								form(v-if="checkZipCode" @submit.prevent="onSubmit()")
									.check-code__field
										input.check-code__input(v-model="zip" :class="{'has-error': !zipValid}" placeholder="your delivery ZIP Code" name="zip-code" maxlength="5" autocomplete="off")
										//- .check-code__status(v-if="zip.length > 0")
										//- 	p(v-if="!zipValid") Unfortunately we’re not serving your area at this moment
										//- 	p(v-else-if="zipValid") We’ll be happy to deliver your order
									button.check-code__send(type="button" @click="onSubmit()") send
								.check-code__request(v-if="requestShow")
									.check-code__success(v-if="zipSuccess")
										.check-code__message We’ll be happy to deliver your order
										router-link.check-code__link(to="/store/menu") shop
									.check-code__fail(v-if="!zipSuccess")
										.check-code__message Unfortunately we’re not serving your area at this moment
										.check-code__controls
											router-link.check-code__link(to="/store/menu") Order for pick-up
											button.check-code__btn(@click="resetValues()") Change my ZIP Code
							

						.poster__text Serving<br> the heart<br> of San Francisco

			.advantages
				.advantage(data-aos="fade-up")
					.advantage__wrapper
						.advantage__title {{ main.advantages.title }}
						.advantage__text {{ main.advantages.description }}
				.advantage(data-aos="fade-up")
					.advantage__outer
						.advantage__wrapper
							ul.advantage__list
								li.advantage__item(v-for="item, i in main.advantages.list")
									img(:src="item.icon")
									.advantage__img(:style="{'background-image': 'url('+ item.icon +')'}")
									.advantage__content
										.advantage__header {{ item.title }}
										.advantage__text {{ item.description }}
				.advantage(data-aos="fade-up")
					.advantage__wrapper
						.advantage__title {{ main.brands.title }}
						.advantage__text {{ main.brands.description }}
						slick.advantage__brands(ref="slickBrands" :options="slickBrandsOptions")
							.advantage__brand(v-for="item, i in main.brands.list")
								img(:src="item.url")
						.advantage__btn(data-aos="fade-up")
							router-link.btn-standart(to="/store/menu") SHOP NOW

			.contacts(data-aos="fade-up")
				.contacts__left
					ul.contacts__list
						li.contacts__item
							.contacts__content
								.contacts__title Address:
								.contacts__text {{ contacts.contacts_address }}
									span {{  }}
						li.contacts__item
							.contacts__content
								.contacts__title Hours:
								.contacts__text {{ contacts.hours }}
						li.contacts__item
							.contacts__content
								.contacts__title Phone:
								a.contacts__link(:href="'tel:' +contacts.call_us") {{ contacts.call_us }}
						li.contacts__item
							.contacts__content
								.contacts__title E-mail:
								a.contacts__link(:href="'mailto:' + contacts.email") {{ contacts.email }}
				.contacts__right
					.contacts__map(data-aos="fade" :style="{backgroundImage: 'url(\"' + require('@/assets/img/map.png') + '\")'}")
		block-footer
</template>

<script>
	import Header from '@/blocks/header.vue';
	import Footer from '@/blocks/footer.vue';
	import CheckAge from '@/blocks/checkAge.vue';
	import preloader from '@/blocks/preloader.vue';
	
	import Slick from 'vue-slick';
	import AOS from 'aos';
	import {mapState} from 'vuex';

	export default {
		name: 'Main',
		data: function(){
			return {
				isDataLoaded: false,

				slickOptions: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
					arrows: true,
					centerMode: true,
					touchThreshold: 60
				},
				slickBrandsOptions: {
					slidesToShow: 6,
                    slidesToScroll: 1,
					autoplay: false,
					touchThreshold: 60,
					responsive: [
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 5
							}
						},
						{
							breakpoint: 640,
							settings: {
								slidesToShow: 4
							}
						},
						{
							breakpoint: 375,
							settings: {
								slidesToShow: 3
							}
						}
					]
				},
				checkZipCode: false,
				zip: '',
				zipValid: true,
				zipSuccess: null,
				requestShow: false,
				isAOS: false,
				desktop: document.documentElement.clientWidth > 640,
				step: 0
			}
		},
		components: {
            'block-header': Header,
			'block-footer': Footer,
			'check-age': CheckAge,
			'preloader': preloader,
			Slick
		},
		created() {
			if(this.about.isEmpty) { this.$store.dispatch('GET_ABOUT') } else { this.checkDataLoad() };
			if(this.contacts.isEmpty) { this.$store.dispatch('GET_CONTACTS') } else { this.checkDataLoad() };
			if(this.main.isEmpty) { this.$store.dispatch('GET_MAIN') } else { this.checkDataLoad() };
		},
		mounted () {
			console.log(this.about);
			console.log(this.main);
			console.log(this.contacts);
			this.step = 0;
			this.checkAOS();
			this.checkDevice();
			if(!this.about.isEmpty && !this.main.isEmpty && !this.contacts.isEmpty) {
				this.$store.commit('SET_PRELOADER', false);
			} else {
				this.$store.commit('SET_PRELOADER', true);
			}
			if(!this.about.isEmpty) ++this.step;
			if(!this.main.isEmpty) ++this.step;
			if(!this.contacts.isEmpty) ++this.step;
			console.log(this.step + '  MOUNT');
		},
		methods: {
			checkDataLoad: function() {
				if(!this.about.isEmpty && !this.contacts.isEmpty && !this.main.isEmpty) this.isDataLoaded = true;
			},

			checkZip: function() {
				var zipCodesArr = this.main.zipcodes.replace(' ','').split(/\n/);

				for(let i = 0; i < zipCodesArr.length; i++) {
					if(zipCodesArr[i].indexOf(this.zip) > -1) {
						return this.zipValid = true;
					} else {
						this.zipValid = false;
					}
				}
			},
			onSubmit () {
				console.log("OnSubmit!")
				this.checkZip();

				let isValid = true,
					formData = new FormData;

				if(this.zip.length == 5 && this.zipValid) {
					formData.append('your-zip', this.zip);
				} else {
					isValid = false;
				}

				this.zip = '';
				this.requestShow = true;
				this.checkZipCode = false;

				if (isValid) {
					this.zipSuccess = true;	
					
				} else {
					this.zipSuccess = false;
				}

			},
			resetValues () {
				this.requestShow = false; 
				this.checkZipCode = true; 
				this.zipValid = true; 
				this.zip = ''
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
                'about',
                'contacts',
                'main'
            ])
		},
		watch: {
			main() {
				++this.step;
				this.checkDataLoad();
			},
			about() {
				++this.step;
				this.checkDataLoad();
			},
			contacts() {
				++this.step;
				this.checkDataLoad();
			},
			step() {
				console.log(this.step);
				if(this.step == 3) {
					setTimeout(() => {
						this.$store.commit('SET_PRELOADER', false);
					}, 500)
					
				}
			}
		},
	}

</script>

<style lang="scss">
	@import '@/assets/sass/ui.scss';
	@import '@/helpers/sass/aos.scss';
</style>

<style lang="scss" scoped>
	.check-code {

		&__input {
			margin-top: 23px;
			max-width: 300px;
			transition: .3s all ease;

			&.has-error {
				border: 1px solid #DF574E;
			}
		}

		&__send {
			font-size: 12px;
			line-height: normal;
			text-decoration-line: underline;
			text-transform: uppercase;
			color: #DF574E;
			margin-left: 20px;
		}

		&__success {
			margin-top: 23px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			& > .check-code__message {
				max-width:257px;
			}

			& > .check-code__link {
				margin-left: 20px;
			}
		}

		&__fail {
			margin-top: 23px;

			& > .check-code__message {
				max-width:338px;
				margin-bottom: 25px;
				padding-bottom: 0;
			}
		}

		&__message {
			font-family: 'Overpass';
			font-style: normal;
			font-weight: normal;
			font-size: 16px;
			line-height: normal;
			color: rgba(38, 38, 38, 0.91);
			padding-bottom: 3px;
		}

		&__controls {
			display: flex;
			justify-content: space-between;
		}

		&__btn {
			font-size: 12px;
			line-height: 14px;
			text-decoration-line: underline;
			text-transform: uppercase;
			color: #DF574E;
			// margin-left: 23px;
		}

		&__link {
			font-size: 12px;
			line-height: 14px;
			text-decoration-line: underline;
			text-transform: uppercase;
			color: #DF574E;
		}

		&__field {
			position: relative;
			display: inline-block;
		}

		&__status {
			/deep/ p {
				font-family: 'Overpass';
				font-style: normal;
				font-weight: normal;
				font-size: 12px;
				line-height: 140%;
				color: rgba(38, 38, 38, 0.91);
				max-width: 224px;
				position: absolute;
				top: calc(100% + 5px);
			}
		}
	}

	.poster {
		padding-top: 84px;
		padding-bottom: 99px;

		&__wrapper {
			width: 100%;
            max-width: calc(1196px + 62px);
            margin: auto;
            padding: 0 31px;
			box-sizing: border-box;
			display: flex;
			align-items: flex-start;
		}

		&__slide {
			height: 572px;
			width: 100% !important;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			position: relative;

			&:before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 25.51%);
			}
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

		&__greeting {
			padding-top: 42px;
		}

		&__controls {
			margin-right: 10.6%;
			padding-bottom: 6px;
			display: flex;
		}

		&__delivery {
			display: inline-block;
			cursor: pointer;
			margin-right: 55px;
			transition: .3s color ease;

			&.active-tab {
				color: #404040;
			}
		}

		&__text {
			font-size: 22px;
			line-height: 114%;
			max-width: 348px;
			text-align: left;
			text-transform:uppercase;
			padding-left: 3px;
			margin-left: auto;
		}
	}

	.delivery {
		margin-right: 5.43%;

		&__welcom {
			font-size: 22px;
			line-height: 84.5%;
			text-transform: uppercase;
			color: rgba(0, 0, 0, 0.75);
			margin-bottom: 28px;
		}

		&__field {
			width: 100%;
		}

		input {
			width: 355px;
			height: 32px;
			line-height: 32px;
			border: 1px solid #C4C4C4;
			box-sizing: border-box;
			padding: 0 10px;
			color: rgba(38, 38, 38, 0.91);
			font-size: 12px;

			&::placeholder {
				font-size: 12px;
				line-height: 32px;
				// line-height: 114%;
				text-transform: uppercase;
				color: rgba(0, 0, 0, 0.75);
				opacity: 0.5;
			}
		}
	}

	.advantages {
		padding-bottom: 84px;
	}

	.advantage {
		padding-bottom: 78px;

		&:last-child {
			padding-bottom: 0;
		}

		&:nth-child(2) {
			padding-bottom: 116px;

			.advantage__title {
				margin-bottom: 43px;
			}
		}

		&:nth-child(3) {
			.advantage__title {
				margin-bottom: 25px;
			}
		}

		&__wrapper {
			width: 100%;
            max-width: calc(1196px + 62px);
            margin: auto;
            padding: 0 31px;
			box-sizing: border-box;
		}

		&__outer {
			background: rgba(38, 38, 38, 0.91);
			padding-top: 61px;
			padding-bottom: 89px;

			& > * {
				color: #fff;
			}
		}

		&__title {
			font-size: 22px;
			line-height: 114%;
			text-transform: uppercase;
			color: rgba(38, 38, 38, 0.91);
			margin-bottom: 35px;
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

		&__img {
			display: none;
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
			line-height: 140%;
			font-weight: 400;
			width: 90%;
		}

		&__brands {
			width: calc(100% + 70px);
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			margin-top: 80px;
			margin-bottom: 73px;
		}

		&__brand {
			height: 70px;
			overflow: hidden;
			display: flex !important;
			align-items: center;
			justify-content: center;
		}

		&__btn {
			display: flex;
			justify-content: center;
		}

		/deep/ .slick-arrow {
			width: 25px;
			height: 8px;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			position: absolute;
			top: calc(50% - 4px);	
			transform: translateY(-50%);
			font-size: 0;
		}

		/deep/ .slick-prev {
			background-image: url('../assets/img/arrow-prev-cal.svg');
			left: -20px;
		}

		/deep/ .slick-next {
			background-image: url('../assets/img/arrow-next-cal.svg');
			right: -20px;
		}
	}

	.contacts {
		background: #212121;
		display: flex;
		height: 617px;

		&__left {
			width: 50%;
			color: #fff;
		}

		&__right {
			width: 50%;
		}

		&__list {
			width: 100%;
			height: 100%;
			display: flex;
			flex-wrap: wrap;
		}

		&__item {
			width: 50%;
			height: 50%;
			display: flex;
			padding: 46px 38px;

			&:first-child {
				align-items: flex-end;
				padding: 0 0 46px 17%;
			}

			&:nth-child(2n) {
				align-items: flex-end;
				justify-content: flex-start;
				padding: 0 0 46px 51px;
			}

			&:nth-child(3n) {
				padding: 50px 0 0 17%;
			}

			&:nth-child(4n) {
				align-items: flex-start;
				justify-content: flex-start;
				padding: 50px 0 0 51px;
			}
		}

		&__title {
			max-width: 200px;
			font-size: 22px;
			line-height: 114%;
			text-transform: uppercase;
			margin: 0 auto 12px;
		}

		&__text {
			max-width: 170px;
			margin: 0 auto;
			font-size: 12px;
			line-height: 120.5%;
			text-transform: uppercase;
			color: #fff;
			opacity: 0.5;
		}

		&__link {
			font-size: 12px;
			line-height: 120.5%;
			color: #FFFFFF;
			opacity: 0.5;
		}

		&__map {
			width: 100%;
			height: 100%;
			position: relative;
			background-repeat:no-repeat;
			background-position:center;
			background-size: cover;
		}
	}

	@media screen and (max-width: 1320px) {
		.advantage {
			/deep/ .slick-prev {
				left: 0;
			}

			/deep/ .slick-next {
				right: 0;
			}
		}
	}

	@media screen and (max-width: 1200px) {
		.poster {
			padding-top: 78px;

			&__wrapper {
				justify-content: space-between;
			}

			&__controls {
				margin: 0 15px 0 0;
			}
		}

		.delivery {
			margin-right: 0;
		}

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

			&__brands {
				width: 100%;
			}
		}

		.contacts {
			&__item {
				padding-left: 35px !important;
			}
		}
	}

	@media screen and (max-width: 960px) {
		.check-code {
			max-width: 370px;

			&__input {
				width: 100%;
			}
		}

		.poster {
			padding-top: 78px;
			padding-bottom: 51px;

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

			&__greeting {
				padding-top: 38px;
			}

			&__wrapper {
				flex-wrap: wrap;
				display: block;

				& > * {
					&:not(:last-child) {
						margin-bottom: 35px;
					}
				}
			}

			&__controls {
				margin: 0;
				padding-bottom: 2px;
			}

			&__delivery {
				margin-right: 50px;
			}

			&__text {
				padding-left: 0;
				// line-height: 18px;
				font-size: 18px;
				line-height: 114%;
				margin-left: 0;
				margin-top: 15px;
			}
		}

		.delivery {
			width: 100%;

			&__welcom {
				margin-bottom: 25px;
			}
		}

		.advantages {
			padding-bottom: 59px;
		}

		.advantage {
			padding-bottom: 47px;

			&:nth-child(2) {
				padding-bottom: 60px;

				.advantage__title {
					margin-bottom: 37px;
				}
			}

			&:nth-child(3) {
				.advantage__title {
					margin-bottom: 10px;
				}

				.advantage__text {
					line-height: 19px;
				}
			}

			&__title {
				margin-bottom: 11px;
			}

			&__outer {
				padding-top: 46px;
				padding-bottom: 43px;
			}

			&__item {
				justify-content: flex-start;
				margin-bottom: 46px;

				&:nth-child(1) {
					img {
						margin-right: 23px;
					}
				}

				&:nth-child(2n) {
					padding-left: 24px;
					
					.advantage__content {
						width: 260px !important;
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
						width: 260px !important;
					}
				}
			}

			&__header {
				margin-bottom: 18px;
			}

			&__content {
				width: 246px !important;
			}

			&__brands {
				margin-top: 37px;
				margin-bottom: 20px;
				width: calc(100% - 60px);
			}

			/deep/ .slick-prev {
				left: -30px;
			}

			/deep/ .slick-next {
				right: -30px;
			}

			&__btn {
				justify-content: flex-start;
			}
		}

		.contacts {
			flex-direction: column;
			height: auto;

			&__left {
				width: 100%;
				padding-top: 59px;
				padding-bottom: 59px;
			}

			&__right {
				width: 100%;
				height: 366px;
			}

			&__item {
				height: auto;
				padding: 0 0 0 32px !important;

				&:first-child {
					margin-bottom: 45px;
				}

				&:nth-child(2) {
					padding: 0 !important;
					margin-bottom: 45px;

					.contacts__content {
						max-width: 182px;
					}
				}

				&:nth-child(4) {
					padding: 0 !important;
				}
			}

			&__title {
				margin-bottom: 12px;
			}
		}
	}

	@media screen and (max-width: 640px) {
		.check-code {
			&__field {
				width: 70%;
				max-width: 300px;
			}

			&__controls {
				flex-direction: column;

				& > .check-code__link {
					margin-bottom: 20px;
				}
			}

			&__btn {
				text-align:left;
			}
		}

		.poster {
			padding-top: 74px;
			padding-bottom: 41px;

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

			&__wrapper {
				padding: 0 28px;
			}

			&__controls {
				order: 3;
				margin: 0 !important;
			}

			&__delivery {
				margin-right: 62px;
				font-size: 16px;
				line-height: 111%;
			}

			&__pick-up {
				font-size: 16px;
				line-height: 111%;
			}

			&__text {
				order: 2;
				font-size: 16px;
				line-height: 114%;
				margin-bottom: 12px !important;
				margin-right: calc(100% - 348px);
				margin-left: 0;
				margin-right: auto;
			}
		}

		.delivery {
			width: 100%;
			order: 1;
			margin-bottom: 40px !important;

			&__welcom {
				font-size: 16px;
				line-height: 84.5%;
				margin-bottom: 20px;
			}

			&__form {
				width: 81.5%;
			}

			input {
				width: 100%;
				font-size: 9px;

				&::placeholder {
					font-size: 9px;
					// line-height: 114%;
				}
			}
		}

		.advantages {
			padding-bottom: 39px;
		}

		.advantage {
			padding-bottom: 37px;

			&:nth-child(2) {
				padding-bottom: 44px;

				.advantage__title {
					margin-bottom: 18px;
				}
			}

			&:nth-child(3) {
				.advantage__text {
					line-height: 16px;
				}
			}

			&__list {
				display: block;
			}

			&__wrapper {
				padding: 0 28px;
			}

			&__title {
				font-size: 16px;
				line-height: 114%;
			}

			&__text {
				font-size: 12px;
				line-height: 16px;
			}

			&__outer {
				padding-top: 24px;
				padding-bottom: 25px;
			}

			&__item {
				width: 100%;
				margin-bottom: 36px !important;
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
					margin-bottom: 34px !important;

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

			&__content {
				width: 100% !important;

				.advantage__text {
					line-height: 15px;
				}
			}

			&__header {
				font-size: 16px;
				line-height: 114%;
				margin-bottom: 10px;
			}

			&__brands {
				margin-top: 27px;
				margin-bottom: 10px;
				width: calc(100% - 65px);
			}

			&__brand {
				img {
					max-width: 53px;
					height: auto;
				}
			}

			/deep/ .slick-prev {
				left: -33px;
			}

			/deep/ .slick-next {
				right: -33px;
			}
		}

		.contacts {
			&__left {
				padding-top: 33px;
				padding-bottom: 34px;
			}
			
			&__right {
				height: 315px;
			}

			&__title {
				font-size: 16px;
				line-height: 114%;
				margin-bottom: 10px;
			}

			&__text {
				font-size: 10px;
				line-height: 120.5%;
				max-width: 140px;
			}

			&__link {
				font-size: 10px;
				line-height: 120.5%;
			}

			&__item {
				padding: 0 0 0 28px !important;

				&:first-child {
					margin-bottom: 33px;
				}

				&:nth-child(2) {
					margin-bottom: 33px;

					.contacts__content {
						padding-left: 21px;
					}
				}

				&:nth-child(3) {
					.contacts__title {
						margin-bottom: 4px;
					}
				}

				&:nth-child(4) {
					.contacts__content {
						padding-left: 21px;
					}

					.contacts__title {
						margin-bottom: 4px;
					}
				}
			}
		}
	}

	@media screen and (max-width: 375px) {
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

			&__greeting {
				padding-top: 32px;
			}

			&__wrapper {
				padding: 0 14px;
			}

			&__controls {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}

			&__delivery {
				margin-right: 0;
			}
		}

		.delivery {
			margin-bottom: 42px !important;

			&__welcom {
				margin-bottom: 21px;
			}

			&__form {
				width: 100%;
			}
		}

		.advantages {
			padding-bottom: 36px;
		}

		.advantage {
			&__wrapper {
				padding: 0 14px;
			}

			&__outer {
				padding-bottom: 26px;
			}

			&__item {
				&:nth-child(4) {
					.advantage__content {
						width: 87% !important;
					}
				}
			}

			&__brands {
				margin-top: 10px;
			}
		}

		.contacts {
			&__left {
				padding-bottom: 26px;
			}

			&__item {
				width: 100%;
				margin-bottom: 32px !important;

				&:first-child {
					padding: 0 0 0 14px !important;
				}

				&:nth-child(2) {
					padding: 0 0 0 14px !important;
					margin-bottom: 27px !important;

					.contacts__content {
						padding-left: 0;
					}
				}

				&:nth-child(3) {
					padding: 0 0 0 14px !important;
					margin-bottom: 25px !important;
				}

				&:nth-child(4) {
					padding: 0 0 0 14px !important;
					margin-bottom: 0 !important;

					.contacts__content {
						padding-left: 0;
					}
				}
			}

			&__title {
				margin-bottom: 9px;
			}
		}
	}
</style>