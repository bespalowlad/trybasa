<template lang="pug">
    header.header
        .header__wrapper
            router-link.header__logo(to="/")
                img(src="@/assets/img/logo.svg")
            ul.header__list
                li.header__item
                    a.header__link(href="/store/menu") Shop
                li.header__item(:class="[$route.path.indexOf('event') > -1 ? 'active' : '']")
                    a.header__link(href="/events") Events
                li.header__item
                    a.header__link(href="/store/cart") Cart
</template>

<script>
export default {
    name: 'Header',
    data () {
        return {}
    },
    mounted() {
        console.log(this.$cookie);
        console.log(this.$cookie.get('check-age'));
    }
}
</script>

<style lang="scss" scoped>
    .header {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        background: #fff;
        width: 100%;

        &__wrapper {
            display: flex;
            align-items: center;
            padding: 28px 41px;
        }

        &__list {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        &__item {
            font-size: 12px;
            line-height: 14px;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.75);
            transition: .3s opacity ease;
            margin-right: 68px;

            @media screen and (min-width: 1200px) {
                &:hover {
                    opacity: 0.5;
                }
            }

            &.active {
                opacity: 0.5;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .header {
            &__wrapper {
                padding: 26px 31px 17px;
            }

            &__item {
                margin-right: 57px;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .header {
            &__wrapper {
                padding: 16px 28px 23px;
            }

            &__logo {
                transform: scale(0.75);
                margin-left: -12px;
            }

            &__item {
                font-size: 10px;
                line-height: 12px;
                margin-right: 28px;
            }
        }
    }

    @media screen and (max-width: 375px) {
		.header {
			&__wrapper {
                padding: 16px 14px 22px;
            }
		}
	}
</style>


