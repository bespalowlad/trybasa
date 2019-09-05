<template lang="pug">
    transition(name="fade")
        .popup(v-if="popupShow")
            transition(name="fade")
                .check-age(v-if="!check")
                    .popup__content
                        .popup__logo
                            img(src="@/assets/img/logo-popup.svg")
                        .popup__title Are you 21 years of age or older?
                        .popup__remember
                            input(type="checkbox" name="remember" id="remember" v-model="rememberMe" checked)
                            label(for="remember") remember me
                        .popup__choice
                            button.popup__btn(type="button" @click="ageCheck(true)") yes
                            button.popup__btn(type="button" @click="ageCheck(false)") no
                .subscribe(v-else)
                    .popup__content
                        .popup__title Get 10% Off Your First Purchase
                        .popup__subtitle Sign Up Now To Get Exclusive Offers:
                        .popup__email
                            form.form(method="post" action="/" @submit.prevent="onSubmit()")
                                .form__field
                                    input.form__input(v-model="email" :class="{'has-error': !emailValid}" @keyup="emailValid = true" @click="emailValid = true" @mouseover="emailValid = true" placeholder="e-mail address (optional)")
                                    button.form__btn(type="submit") Sign up
                        .popup__rules By clicking Enter, you consent to our storing your email address, and you agree to our <a href="/">TERMS OF SERVICE</a> and <a href="/">PRIVACY POLICY</a>. This site uses cookies. By continuing to browse this BASA site (and/or any other BASA website), you accept the use of cookies. <a href="/">LEARN MORE</a>.
                        button.popup__btn(type="button" @click="popupShow = false") NO THANKS, TAKE ME TO <span>BASA</span>
</template>

<script>
import $api from '@/components/api.js';
export default {
    name: 'CheckAge',
    data () {
        return {
            check: false, 
            popupShow: false,
            rememberMe: '',
            email: '',
            emailValid: true,
        }
    },
    created () {
        if(this.$cookie.get('check-age')) {
            this.popupShow = false;
        } else {
            this.show();
        }
        // this.show(); ///////////////////////////// delete later
    },
    mounted () {
        
    },
    watch: {
        rememberMe() {
            console.log(this.rememberMe);
        }
    },
    methods: {
        ageCheck (val) {
            if(val == false) {
                window.location.href = "https://www.google.com/";
            } else {
                this.check = val;
                if(this.rememberMe === true) {
                    this.$cookie.set('check-age', this.rememberMe, 183);
                    console.log(this.$cookie.get('check-age'));
                    console.log(this.$cookie);
                }
            }
        },
        show () {
            window.setTimeout(() => {
                this.popupShow = true;
            }, 2000);
        },
        isEmailValid(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        onSubmit () {
            let isValid = true,
                formData = new FormData;

            if(this.isEmailValid(this.email)) {
                this.emailValid = true;
                formData.append('your-email', this.email);
                $api.signUp();
            } else {
                this.emailValid = false;
                isValid = false;
            }

            if (!isValid) return;

            this.onSuccess();
        },
        onSuccess(){
            this.popupShow = false;

            setTimeout(() => {
                this.email = '';
                //alert('Thanks for subscribe');
            }, 500);
        }
    }
}
</script>

<style lang="scss" scoped>
    .check-age {
        .popup__content {
            max-width: 530px;
        }
    }

    .subscribe {
        .popup__content {
            max-width: 502px;
        }

        .popup__title {
            padding-top: 5px;
        }
    }

    .popup {
        transition: opacity .5s;
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(25%, 25%, 25%);
        display: flex;
        align-items: center;
        justify-content: center;

        &__content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &__logo {
            margin-bottom: 38px;
            padding-top: 7px;
        }

        &__title {
            font-size: 22px;
            line-height: 114%;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 20px;
        }

        &__remember {
            padding-left: 25px;
            margin-bottom: 33px;

            label {
                font-size: 10px;
                line-height: 120.5%;
                text-transform: uppercase;
                color: rgba(255,255,255,0.5);
                position: relative;
                cursor: pointer;

                &:after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -25px;
                    transform: translateY(-50%);
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    border: 1px solid #DF574E;
                    box-sizing: border-box;
                    background: transparent;
                    transition: .3s background ease;
                }
            }

            input[type=checkbox] {
                display: none;

                &:checked {
                    & + label:after {
                        background: #DF574E;
                    }
                }
            }
        }

        &__choice {
            display: flex;
            justify-content: center;
        }

        &__btn {
            margin: 0 50px;
            font-size: 22px;
            line-height: 111%;
            text-align: center;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
        }

        &__subtitle {
            font-size: 12px;
            line-height: 114%;
            text-align: center;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 27px;
        }

        &__email {
            width: 100%;
            margin-bottom: 30px;
        }

        &__rules {
            font-family: 'Overpass';
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 114%;
            color: #fff;
            opacity: 0.5;
            margin-bottom: 15px;

            /deep/ a {
                font-family: 'Helvetica Neue LT Pro';
                text-transform: uppercase;
                color: #DF574E;
            }

            & + .popup__btn {
                font-size: 12px;
                line-height: 114%;
                text-align: center;
                text-transform: uppercase;
                color: #FFFFFF;

                span {
                    color: #DF574E;
                }
            }
        }
    }

    .form {
        &__field {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        &__btn {
            font-size: 22px;
            line-height: 26px;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
            white-space: nowrap;
        }

        input {
            height: 32px;
            line-height: 32px;
            width: 68%;
            border: 1px solid #C4C4C4;
            box-sizing: border-box;
            background: rgb(25%, 25%, 25%);
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
                line-height: 32px;
                text-transform: uppercase;
                color: rgba(255,255,255,0.5);
                transition: .3s color ease;
            }
        }
    }

    @media screen and(max-width: 960px) {
        .popup {
            &__logo {
                transform: scale(0.6);
                margin-bottom: 20px;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .check-age {
            .popup__content {
                width: calc(100% - 60px);
                padding: 0 30px;
                max-width: none;
                margin: auto;
            }
        }

        .subscribe {
            .popup__content {
                width: calc(100% - 60px);
                padding: 0 30px;
                max-width: none;
                margin: auto;
            }
        }

        .popup {
            &__title {
                text-align: center;
            }
        }

        .form {
            &__btn {
                    font-size: 18px;
                    line-height: normal;
                    margin-left: 10px;
            }

            input {
                width: 60%;
            }
        }
    }
</style>


