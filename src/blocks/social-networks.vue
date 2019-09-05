<template lang="pug">
    .social(data-aos="fade-up")
        .social__join-us Join Us: <a href="https://www.instagram.com/trybasa/">@BASA</a>
        .social__links
            ul.social__links
                li.social__item
                    a.social__link(href="https://www.facebook.com/trybasasf" target="_blank")
                        img(src="@/assets/img/fb.svg")
                li.social__item
                    a.social__link(href="https://www.instagram.com/trybasa/" target="_blank")
                        img(src="@/assets/img/inst.svg")
                li.social__item
                    a.social__link(href="https://twitter.com/trybasasf" target="_blank")
                        img(src="@/assets/img/tw.svg")
</template>

<script>
export default {
    name: 'Social',
    data () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
    .social {
        display: flex;
        align-items: center;

        &__join-us {
            font-size: 22px;
            line-height: 114%;
            text-transform: uppercase;

            /deep/ a {
                font-size: 22px;
                line-height: 114%;
                text-decoration-line: underline;
                text-transform: uppercase;
                color: #DF574E;
                padding-left: 8px;
            }
        }

        &__links {
            margin-left: auto;
            display: flex;

            & > * {
                &:not(:last-child) {
                    margin-right: 21px;
                }
            }
        }

        &__link {
            transition: .3s opacity ease;
            
            @media screen and (min-width: 1200px) {
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    @media screen and (max-width: 960px) {
        .social {
            flex-direction: column;

            &__join-us {
                margin-bottom: 20px;
                padding-right: 15px;

                /deep/ a {
                    padding-left: 20px;
                }
            }

            &__links {
                margin: auto;
            }
        }
    }
    @media screen and (max-width: 640px) {
        .social {
            align-items: center;

            &__join-us {
                font-size: 16px;
                line-height: 126%;
                margin-bottom: 20px;
                padding-left: 9px;

                /deep/ a {
                    font-size: 16px;
                    line-height: 114%;
                    padding-left: 35px;
                }
            }

            &__links {
                // margin-left: 0;
            }
        }
    }

    @media screen and (max-width: 375px) {
        .social {
            &__join-us {
                padding-left: 10px;

                /deep/ a {
                    padding-left: 45px;
                }
            }
        }
    }
</style>


