<template lang="pug">
    .popup(@click.self="$emit('toggle-event')")
        .popup__body
            button.popup__hide(@click="$emit('toggle-event')")
                img(src="@/assets/img/close.svg")
            .popup__preview(:style="{backgroundImage: 'url(\"' + (event.acf ? event.acf.preview.sizes.medium_large : '') + '\")'}")
            .popup__content
                .popup__title(v-html="event.title ? event.title.rendered: ''")
                .popup__date
                    span {{event.acf ? transformDate(event.acf.date).time : ''}}
                    span.separator |
                    span {{event.acf ? transformDate(event.acf.date).day : ''}}
                    span {{event.acf ? transformDate(event.acf.date).date : ''}}
                router-link.popup__link(:to="event.slug ? `/events/${event.slug}` : ''") open event
</template>

<script>
export default {
    name: 'Popup',
    data () {
        return {
            fullDays: ['Sunday','Monday','TuesDay','Wednesday','Thursday','Friday','Saturday'],
        }
    },
    props: {
        event: {
            type: Object
        }
    },
    watch: {
        event () {
            console.log(this.event);
        }
    },
    methods: {
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
            res.day = this.fullDays[date.getDay()];
            // console.log(res);
                
            return res;
        },
    }
}
</script>

<style lang="scss" scoped>
    .popup {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(33, 32, 32, 0.91);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .3s opacity ease;
        pointer-events: auto;

        &.hidden {
            opacity: 0;
            pointer-events: none;
        }

        &__body {
            width: 446px;
            position: relative;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        }

        &__hide {
            position: absolute;
            top: -34px;
            right: -24px;
        }

        &__preview {
            height: 256px;
            width: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }

        &__content {
            padding: 35px 51px 47px;
            background: #FFFFFF;
        }

        &__title {
            font-size: 16px;
            line-height: 19px;
            text-transform: uppercase;
            color: #2C2C2C;
            margin-bottom: 14px;
        }

        &__date {
            font-size: 14px;
            line-height: 17px;
            text-transform: uppercase;
            color: #2C2C2C;
            margin-bottom: 41px;
            display: flex;

            /deep/ span{
                font-size: 18px;
                line-height: 114%;
                text-transform: uppercase;
                color: rgba(38, 38, 38, 0.91);
                margin-right: 5px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &__link {
            font-size: 18px;
            line-height: 114%;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
        }
    }

    @media screen and (max-width: 640px) {
        .popup {
            &__body {
                width: 341px;
            }

            &__preview {
                height: 178px;
            }

            &__hide {
                top: -39px;
                right: -15px;
            }

            &__content {
                padding: 31px 30px 33px;
            }

            &__date {
                margin-bottom: 40px;
            }
        }
    }

    @media screen and (max-width: 375px) {
        .popup {
            &__body {
                width: 263px;
            }

            &__preview {
                height: 155px;
            }

            &__hide {
                top: -34px;
                right: -10px;
            }

            &__content {
                padding: 26px 17px 21px;
            }

            &__date {
                /deep/ span {
                    font-size: 12px;
                    line-height: 14px;
                }
            }
        }
    }
</style>


