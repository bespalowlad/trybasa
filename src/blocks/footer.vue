<template lang="pug">
    footer.footer(:style="{backgroundImage: 'url(\"' + require('@/assets/img/footer-bg.png') + '\")'}")
        .footer__wrapper
            .footer__top
                .footer__join
                    .footer__title Join Mailing List:
                    .footer__subtitle Be the first to learn about the latest deals, product demos, events, and more.
                    .footer__email
                        transition( name="fade" mode="out-in")
                            .form__success( v-if="success1" ) thanks for signing up! please check your e-mail.
                            form.form.form-email( v-else method="post" action="/" @submit.prevent="onSubmit($event, 0)")
                                .form__field
                                    input.form__input(v-model="email" :class="{'has-error': !emailValid}" @keyup="emailValid = true" @click="emailValid = true" @mouseover="emailValid = true" placeholder="e-mail address (optional)")
                                    button.form__btn(type="submit") Sign up
                        transition( name="fade" mode="out-in")
                            .form__success( v-if="success2" ) thanks for signing up! please check your phone.
                            form.form.form-tel( v-else method="post" action="/" @submit.prevent="onSubmit($event, 1)")
                                .form__field
                                    input.form__input(v-model="tel" :class="{'has-error': !telValid}" @keyup="telValid = true" @click="telValid = true" @mouseover="telValid = true" placeholder="phone number (optional)")
                                    button.form__btn(type="submit") Sign up
                .footer__partners
                    .footer__title Partners
                    ul.footer__list
                        li.footer__item
                            router-link.footer__link(to="/") Our Vendors
                .footer__company
                    .footer__title Company
                    ul.footer__list
                        li.footer__item
                            router-link.footer__link(to="/about") About Us
                        li.footer__item
                            router-link.footer__link(to="/contact-us") Contact Us
                        li.footer__item
                            router-link.footer__link(to="/faq") FAQ
                .footer__follow-us
                    .footer__title Follow Us
                    ul.footer__list
                        li.footer__item
                            a.footer__link(href="https://www.facebook.com/trybasasf" target="_blank")
                                img(src="@/assets/img/fb-gray.svg")
                        li.footer__item
                            a.footer__link(href="https://www.instagram.com/trybasa/" target="_blank")
                                img(src="@/assets/img/Inst-gray.svg")
                        li.footer__item
                            a.footer__link(href="https://twitter.com/trybasasf" target="_blank")
                                img(src="@/assets/img/Tw-gray.svg")
            .footer__bottom
                .footer__copyright Copyright 2019 | All Rights Reserved |  <span>@ BASA</span>
                router-link.footer__privacy(to="/") privacy policy
                router-link.footer__terms(to="/") terms & conditions
</template>

<script>
import $api from '@/components/api.js';

export default {
    name: 'Footer',
    data () {
        return {
            email: '',
            emailValid: true,
            tel: '',
            telValid: true,
            success1: false,
            success2: false
        }
    },
    methods: {
        isEmailValid(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        onSubmit (event, type) {
            let isValid = true,
                formData = new FormData;

            if(event.target.classList.contains('form-email')) {
                if(this.isEmailValid(this.email)) {
                    this.emailValid = true;
                    formData.append('your-email', this.email);
                } else {
                    this.emailValid = false;
                    isValid = false;
                }
            }

            if(event.target.classList.contains('form-tel')) {
                if(this.tel) {
                    this.telValid = true;
                    formData.append('your-tel', this.tel);
                } else {
                    this.telValid = false;
                    isValid = false;
                }
            }

            if (!isValid) return;

            if(event.target.classList.contains('form-email')) {
                $api.sendFormSubsribe(this.email);
            }

            this.onSuccess(type);
        },
        onSuccess(type){
            setTimeout(() => {
                this.email = '';
                this.tel = '';
                type == 0 ? this.success1 = true : this.success2 = true;
                // alert('Thanks for subscribe');
                
            }, 500);
        }
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

	.fade-enter {
		opacity: 0;
	}

	.fade-enter-active {
		transition: opacity .5s ease;
	}

    .footer {
        padding: 45px 0 41px;
        color: #fff;
        background-color: rgba(38, 38, 38, 0.91);
        background-repeat: no-repeat;
        background-size: 250px 170px;
        background-position: right -60px bottom -5px;

        &__wrapper {
            width: 100%;
            max-width: calc(1196px + 62px);
            margin: auto;
            padding: 0 31px;
			box-sizing: border-box;
        }

        &__top {
            display: flex;
            margin-bottom: 29px;
        }

        &__title {
            font-size: 12px;
            line-height: 114%;
            text-transform: uppercase;
            margin-bottom: 26px;
        }

        &__subtitle {
            font-size: 12px;
            line-height: 114%;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0.5;
            margin-bottom: 28px;
        }

        &__join {
            margin-right: 19.9%;
            max-width: 360px;
        }

        &__email {
            margin-bottom: 39px;
        }

        &__sign-up {
            font-size: 12px;
            line-height: 114%;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 24px;
        }

        &__join-now {
            display: flex;
            align-items: flex-end;
        }

        &__text {
            font-size: 12px;
            line-height: 120.5%;
            max-width: 263px;
            opacity: 0.5;
            text-transform: uppercase;
        }

        &__btn {
            font-size: 12px;
            line-height: 14px;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
            margin-left: auto;
            white-space: nowrap;
        }

        &__list {
            & > * {
                &:not(:last-child) {
                    margin-bottom: 27px;
                }
            }
        }

        &__item {
            font-size: 12px;
            line-height: 114%;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0.5;
        }

        &__partners {
            margin-right: 11.95%;
        }

        &__company {
            margin-right:12.458%;
        }

        &__follow-us {
            .footer__list {
                padding-left: 3px;

                & > * {
                    &:not(:last-child) {
                        margin-bottom: 11px !important;
                    }
                }
            }
        }

        &__bottom {
            display: flex;
            align-items: flex-start;
            opacity: 0.4;
        }

        &__copyright {
            margin-right: 18.3%;
            font-size: 12px;
            line-height: 84.5%;
            text-align: center;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0.5;

            span {
                padding-left: 5px;
            }
        }

        &__privacy {
            margin-right: 10.87%;
            font-size: 12px;
            line-height: 84.5%;
            text-align: center;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0.5;
        }

        &__terms {
            font-size: 12px;
            line-height: 84.5%;
            text-align: center;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #FFFFFF;
            opacity: 0.5;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }

        &__input {
            height: 31px;
            line-height: 32px;
            width: 271px;
            margin-right: 27px;
            background-color: transparent;
            color: rgba(255,255,255,0.5);
            border: 1px solid #C4C4C4;
            box-sizing: border-box;
            padding: 0 10px;
            color: #fff;
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
                text-transform: uppercase;
                color: #FFFFFF;
                opacity: 0.5;
                transition: .3s color ease;
                line-height: 31px;
            }
        }

        &__btn {
            font-size: 12px;
            line-height: 14px;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
        }

        &__success {
            font: 700 12px/1.14 'Helvetica Neue LT Pro', sans-serif;
            text-transform: uppercase;
            color: #FFFFFF;
            max-width: 230px;
            margin-bottom: 16px;
            height: 31px;
        }
    }

    @media screen and (max-width: 1200px) {
        .footer {
            background-size: 228px 150px;
            background-position: right -12px bottom 35px;

            &__top {
                & > * {
                    &:not(:last-child) {
                        margin-right: 10%;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 960px) {
        .footer {
            padding: 50px 0 32px;

            &__title {
                margin-bottom: 24px;
            }

            &__subtitle {
                margin-bottom: 29px;
            }

            &__top {
                flex-wrap: wrap;
                margin-bottom: 42px;
            }

            &__join {
                margin-right: calc(100% - 360px) !important;
                order: 1;
            }

            &__email {
                margin-bottom: 51px;
            }

            &__list {
                & > * {
                    &:not(:last-child) {
                        margin-bottom: 22px;
                    }
                }
            }

            &__partners {
                order: 3;
                margin-right: 13.3% !important;
            }

            &__company {
                order: 2;
                margin-right: 12.3% !important;
            }

            &__follow-us {
                order: 4;

                .footer__list {
                    display: flex;

                    & > * {
                        &:not(:last-child) {
                            margin: 0 15px 0 0 !important;
                        }
                    }
                }
            }

            &__bottom {
                flex-direction: column;

                & > * {
                    &:not(:last-child) {
                        margin-bottom: 0;
                    }
                }
            }

            &__copyright {
                order: 3;
                margin-bottom: 0;
            }

            &__terms {
                order: 2;
                margin-bottom: 19px;
            }

            &__privacy {
                order: 1;
                margin-bottom: 19px !important;
            }
        }

        .form {
            align-items: flex-start;
            margin-bottom: 21px;

            &__input {
                height: 32px;
                margin-right: 21px;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .footer {
            padding-top: 47px;
            padding-bottom: 10px;
            background-position: right 0px bottom 19.5%;

            &__wrapper {
                padding: 0 28px;
            }

            &__top {
                margin-bottom: 35px;
            }

            &__title {
                margin-bottom: 15px;
            }

            &__subtitle {
                font-size: 10px;
                line-height: 114%;
                margin-bottom: 19px;
            }

            &__join {
                max-width: 292px;
                margin-right: calc(100% - 292px) !important;

                .footer__title {
                    margin-bottom: 18px;
                }
            }

            &__email {
                margin-bottom: 40px;
            }

            &__company {
                margin-right: 22% !important;
            }

            &__list {
                & > * {
                    &:not(:last-child) {
                        margin-bottom: 15px;
                    }
                }
            }

            &__follow-us {
                width: 100%;
                margin-top: 42px;

                .footer__list {
                    padding-left: 0;

                    & > * {
                        &:not(:last-child) {
                            margin: 0 18px 0 0 !important;
                        }
                    }
                }
            }

            &__bottom {
                & > * {
                    &:not(:last-child) {
                        margin-bottom: 20px;
                    }
                }
            }

            &__copyright {
                font-size: 9px;
                line-height: 84.5%;
            }

            &__terms {
                font-size: 9px;
                line-height: 84.5%;
            }

            &__privacy {
                font-size: 9px;
                line-height: 84.5%;
            }
        }

        .form {
            margin-bottom: 14px;

            &__input {
                margin-right: 0;
                margin-bottom: 10px;
                width: 100%;
                font-size: 9px;
                line-height: 32px;

                &::placeholder {
                    font-size: 9px;
                    line-height: 32px;
                }
            }

            &__btn {
                font-size: 10px;
                line-height: 12px;
            }
        }
    }

    @media screen and (max-width: 375px) {
        .footer {
            padding-top: 45px;
            padding-bottom: 8px;
            background-position: right -17px bottom 33.5%;
            background-size: 203px 137px;

            &__wrapper {
                padding: 0 14px;
            }

            &__partners {
                order: 2;
                margin-bottom: 36px;
            }

            &__company {
                order: 3;
            }

            &__follow-us {
                margin-top: 37px;
            }

            &__top {
                margin-bottom: 37px;
            }

            &__copyright {
                margin-right: 0;
            }
        }
    }
</style>


