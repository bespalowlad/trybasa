<template lang="pug">
    div
        preloader
        check-age
        block-header
        .contact-us(v-if="isDataLoaded")
            .contact-us__wrapper
                .poster(data-aos="fade-up")
                    .poster__title We’re here for you. Reach out anytime with questions, concerns, or suggestions.
                    ul.poster__list
                        li.poster__item
                            .poster__subtitle E-mail Us:
                            a.poster__contact(:href="'mailto:' + contacts.email") {{ contacts.email }}
                        li.poster__item
                            .poster__subtitle Visit Us:
                            .poster__contact {{ contacts.contacts_address }}
                        li.poster__item
                            .poster__subtitle Call US:
                            a.poster__contact(:href="'tel:' + contacts.call_us") {{ contacts.call_us }}
                .feedback(data-aos="fade-up")
                    .feedback__wrapper
                        .feedback__title Need Some Help?<br> Fill out the form below and our<br> staff will be in touch!
                        form.feedback-form#feedback-form(@submit.prevent="onSubmit()" name="feedback-form" method="post" action="/")
                            .feedback-form__field.feedback-form__name
                                input(v-model="name" :class="{'has-error': !nameValid}" @keyup="nameValid = true" @click="nameValid = true" @mouseover="nameValid = true" name="name" placeholder="your name")
                            .feedback-form__field.feedback-form__email
                                input(v-model="email" :class="{'has-error': !emailValid}" @keyup="emailValid = true" @click="emailValid = true" @mouseover="emailValid = true" name="email" placeholder="your e-mail")
                            .feedback-form__field.feedback-form__subject
                                input(v-model="subject" :class="{'has-error': !subjectValid}" @keyup="subjectValid = true" @click="subjectValid = true" @mouseover="subjectValid = true" name="subject" placeholder="subject")
                            .feedback-form__field.feedback-form__message
                                textarea(v-model="message" :class="{'has-error': !messageValid}" @keyup="messageValid = true" @click="messageValid = true" @mouseover="messageValid = true" name="subject" placeholder="message")
                            button.feedback-form__submit(type="submit") Send
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
        name: 'Contact-us',
        data () {
            return {
                isDataLoaded: false,
                
                isAOS: false,
                name: '',
                nameValid: true,
                email: '',
                emailValid: true,
                subject: '',
                subjectValid: true,
                message: '',
                messageValid: true,
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
			if(this.contacts.isEmpty) { this.$store.dispatch('GET_CONTACTS') } else { this.isDataLoaded = true; };
        },
        mounted () {
            this.checkAOS()
            if(this.contacts.length) {
                this.$store.commit('SET_PRELOADER', false);
            } else {
                this.$store.commit('SET_PRELOADER', true);
            }
		},
		methods: {
            isEmailValid(email) {
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            onSubmit () {
                let isValid = true,
                    formData = new FormData;

                if(this.name) {
                    this.nameValid = true;
                    formData.append('your-name', this.name);
                } else {
                    this.nameValid = false;
                    isValid = false;
                }

                if(this.isEmailValid(this.email)) {
                    this.emailValid = true;
                    formData.append('your-email', this.email);
                } else {
                    this.emailValid = false;
                    isValid = false;
                }

                if(this.subject) {
                    this.subjectValid = true;
                    formData.append('your-subject', this.subject);
                } else {
                    this.subjectValid = false;
                    isValid = false;
                }

                if(this.message) {
                    this.messageValid = true;
                    formData.append('your-message', this.message);
                } else {
                    this.messageValid = false;
                    isValid = false;
                }

                if (!isValid) return;

                this.onSuccess();
            },
            onSuccess(){
                setTimeout(() => {
                    this.name = '';
                    this.email = '';
                    this.subject = '';
                    this.message = '';
                    alert('Thanks for questions');
                }, 500);
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
                'contacts'
            ])
		},
		watch: {
			contacts() {
                if(!this.contacts.isEmpty) this.isDataLoaded = true;
                setTimeout(()=> {
                    this.$store.commit('SET_PRELOADER', false);
                }, 500)
			}
		},
    }
</script>

<style lang="scss" scoped>
    .contact-us {

        &__wrapper {
            width: 100%;
            max-width: 1196px;
            margin: auto;
            padding: 0 30px;
            box-sizing: content-box;
        }
    }

    .poster {
        padding-top: 192px;
        padding-bottom: 96px;

        &__title {
            font-size: 22px;
            line-height: 114%;
            text-align: center;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            max-width: 563px;
            padding-right: 20px;
            margin:0 auto 91px;
        }

        &__list {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            // max-width: 953px;
            margin: 0 auto;
        }

        &__item {
            text-align: center;
            width: 373px;

            &:first-child {
                padding-left: 4px;
            }
        }

        &__subtitle {
            font-size: 22px;
            line-height: 84.5%;
            text-align: center;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.75);
            margin-bottom: 22px;
        }

        &__contact {
            width: 50%;
            margin: 0 auto;
            transition: .3s opacity ease;
            font-size: 12px;
            line-height: 114%;
            text-align: center;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);

            &:hover {
                opacity: .8;
            }

            &:nth-child(2n) {
                padding-top: 3px;
            }
        }
    }

    .feedback {
        padding-bottom: 72px;

        &__wrapper {
            max-width: 953px;
            margin: auto;
        }

        &__title {
            font-size: 22px;
            line-height: 114%;
            text-align: center;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            max-width: 560px;
            margin: 0 auto 54px;
        }
    }

    .feedback-form {
        width: 100%;

        &__field {
            display: inline-block;
            width: 100%;
            margin-bottom: 14px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        input {
            border: 1px solid #C4C4C4;
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            width: 100%;
            color: rgba(38, 38, 38, 0.91);
            transition: .3s all ease;
            font-size: 12px;

            &.has-error {
                border: 1px solid #DF574E;
                color: rgba(223, 87, 78, 0.5);

                &::placeholder {
                    color: rgba(223, 87, 78, 0.5);
                }
            }

            &::placeholder {
                font-size: 12px;
                // line-height: 114%;
                line-height: 32px;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.75);
                opacity: 0.5;
                position: relative;
                top: 1px;
                transition: .3s color ease;
            }
        }

        textarea {
            border: 1px solid #C4C4C4;
            padding: 10px;
            width: 100%;
            outline: none;
            resize: none;
            min-height: 96px;
            transition: .3s all ease;
            font-size: 12px;

            &.has-error {
                border: 1px solid #DF574E;
                color: rgba(223, 87, 78, 0.5);

                &::placeholder {
                    color: rgba(223, 87, 78, 0.5);
                }
            }

            &::placeholder {
                font-size: 12px;
                line-height: 114%;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.75);
                opacity: 0.5;
                transition: .3s color ease;
            }
        }

        &__name {
            width: calc(50% - 10px);
            margin-right: 20px;
        }

        &__email {
            width: calc(50% - 10px);
        }

        &__submit {
            display: flex;
            margin: 29px auto 0;
            font-size: 22px;
            line-height: 111%;
            text-align: center;
            text-transform: uppercase;
            text-decoration-line: underline;
            color: #DF574E;
            border: none;
        }
    }

    .recommendations {
        padding-bottom: 124px;
    }

    @media screen and (max-width: 1256px) {
        .contact-us {
            &__wrapper {
                max-width: none;
                width: calc(100% - 60px);
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .poster {
            padding-bottom: 96px;

            &__title {
                padding-right: 0;
            }
        }

        .feedback {
            &__wrapper {
                max-width: none;
            }
        }
    }

    @media screen and (max-width: 960px) {
        .contact-us {
            &__wrapper {
                padding: 0 31px;
                width: calc(100% - 62px);
            }
        }

        .poster {
            padding-top: 131px;
            padding-bottom: 48px;

            &__title {
                max-width: 560px;
                margin-bottom: 32px;
            }

            &__list {
                flex-direction: column;
                align-items: center;

                & > * {
                    &:not(:last-child) {
                        margin-bottom: 35px;
                    }
                }
            }

            &__subtitle {
                margin-bottom: 16px;
            }

            &__item {

                &:first-child {
                    padding-left: 0;
                }
            }

            &__contact {

                &:nth-child(2n) {
                    padding-top: 0;
                }
            }
        }

        .feedback {
            padding-bottom: 59px;

            &__title {
                margin-bottom: 31px;
            }
        }

        .feedback-form {
            &__name {
                margin-right: 17px;
            }

            &__submit {
                margin: 18px auto 0;
            }
        }

        .recommendations {
            padding-top: 30px;
            padding-bottom: 81px;
        }
    }

    @media screen and (max-width: 640px) {
        .contact-us {
            &__wrapper {
                padding: 0 28px;
                width: calc(100% - 56px);
            }
        }

        .poster {
            padding-top: 109px;
            padding-bottom:49px;

            &__title {
                max-width: none;
                font-size: 16px;
                line-height: 114%;
                margin-bottom: 34px;
            }

            &__list {
                & > * {
                    &:not(:last-child) {
                        margin-bottom: 22px;
                    }
                }
            }

            &__item {
                &:nth-child(2) {
                    margin-bottom: 27px;

                    .poster__subtitle {
                        margin-bottom: 14px;
                    }
                }
            }

            &__subtitle  {
                font-size: 16px;
                line-height: 84.5%;
                margin-bottom: 9px;
            }
        }

        .feedback {
            padding-bottom: 65px;

            &__title {
                font-size: 16px;
                line-height: 15px;
                margin-bottom: 23px;
                letter-spacing: -0.4px;
            }
        }

        .feedback-form {
            &__name {
                margin-right: 0;
                width: 100%;
            }

            &__email {
                width: 100%;
            }

            &__field {
                margin-bottom: 10px;
            }

            input {
                font-size: 10px;
                &::placeholder {
                    font-size: 10px;
                    line-height: 32px;
                }
            }

            textarea {
                min-height: 70px;

                &::placeholder {
                    font-size: 10px;
                    line-height: 114%;
                }
            }

            &__submit {
                font-size: 16px;
                line-height: 111%;
                margin-top: 12px;
            }
        }

        .recommendations {
            padding-bottom: 69px;
        }
    }

    @media screen and (max-width: 375px) {
        .contact-us {
            &__wrapper {
                padding: 0 14px;
                width: calc(100% - 28px);
            }
        }

        .poster {
            padding-top: 98px;
            padding-bottom: 42px;

            &__title {

            }
        }

        .feedback {
            padding-bottom: 51px;

            &__title {
                letter-spacing: 0;
            }
        }

        .recommendations {
            padding-bottom: 67px;
        }
    }
</style>


