<template lang="pug">
    div
        preloader
        check-age
        block-header
        .events
            .events__wrapper
                .calendar
                    .calendar__head(data-aos="fade-up")
                        .calendar__season
                            .calendar__arrow.calendar__prev(@click="prevMonth")
                                img(src="@/assets/img/arrow-prev-cal.svg")
                            .calendar__month {{getCurrentMonth}}
                            .calendar__separator /
                            .calendar__year {{getCurrentYear}}
                            .calendar__arrow.calendar__next(@click="nextMonth")
                                img(src="@/assets/img/arrow-next-cal.svg")
                        .calendar__type(@click="showFiltering = !showFiltering" :class="[showFiltering ? 'show' : '']")
                            p Event Type
                            img.arrow-slide-down(src="@/assets/img/arrow-slide-down.svg")
                            img.arrow-slide-up(src="@/assets/img/arrow-slide-up.svg")
                        .calendar__grid
                            button.calendar__mode(@click="setCalendarDisplay(false)" :class="{'active': !activeModeTable}")
                                img(src="@/assets/img/mode-grid-row.svg")
                            button.calendar__mode(@click="setCalendarDisplay(true)" :class="{'active': activeModeTable}")
                                img(src="@/assets/img/mode-grid-table.svg")

                    vue-slide-up-down.calendar__filtering(:active="showFiltering" :duration="300")
                        .calendar__filtering-wrapper
                                .calendar__filtering-field(v-for="(type, i) in getEventsType" :key="i")
                                    input.calendar__checkbox(type="checkbox" :id="type" :value="type" checked)
                                    label.calendar__label(:for="type" @click="setParamFiltering") {{type}}

                    .calendar__body(v-if="activeModeTable")
                        .calendar__days
                            .calendar__day(v-for="(day, index) in dayOfTheWeek" :key="index" data-aos="fade-up") {{day}}
                        .calendar__table(data-aos="fade-up")
                            template(v-for="(d, index) in getEventsByMonth")
                                template(v-if="d.event")
                                    
                                    //- div {{ validationOfEvent(d.event, d.day) }}
                                    //- div {{ searchEventType(d.event.type) }}
                                    //- div {{ setDisplayDate(index) }}
                                    //- div {{ setDisplayDate(index) }}
                                    //- div {{ today(d.day) }}

                                    component.date(
                                        :is="searchEventType(d.event.type) && !isMobile ? 'router-link' : 'div'"
                                        :to="`/events/${d.event.slug}`"
                                        :class="[searchEventType(d.event.type) ? 'event' : setDisplayDate(index) ? 'another-month' : 'empty', d.event.type ? d.event.type : '', today(d.day) ? 'today' : '']"
                                        @click="togglePopup(d.event)")
                                            .date__preview(
                                                v-if="searchEventType(d.event.type)"
                                                :style="{backgroundImage: 'url(\"' + d.event.acf.preview.sizes.medium_large + '\")'}"
                                                )
                                            .date__num {{d.day.format('D')}}
                                            .date__content(v-if="searchEventType(d.event.type)")
                                                .date__text
                                                    .date__header
                                                        .date__title(v-html="d.event.title.rendered")
                                                        .date__share
                                                            img(src="@/assets/img/share.svg")
                                template(v-else)
                                    template(v-if="activeModeTable")
                                        .date(:class="[setDisplayDate(index) ? 'another-month' : 'empty', today(d.day) ? 'today' : '']")
                                            .date__num {{d.day.format('D')}}                                    

                    .calendar__body(v-else)
                        .calendar__mode-row
                            .date(
                                v-for="(event, i) in events"
                                :key="i"
                                v-if="getCurrentShortMonth == transformDate(event.acf.date).date.split('/')[1] && getCurrentYear ==  transformDate(event.acf.date).date.split('/')[2] ? searchEventType(event.type) : ''"
                                data-aos="fade-up"
                                )
                                .date__preview(:style="{backgroundImage: 'url(\"' + event.acf.preview.sizes.medium_large + '\")'}" data-aos="fade")
                                .date__content
                                    .date__text
                                        router-link.date__header(:to="`/events/${event.slug}`")
                                            .date__title {{event.title.rendered}}
                                            .date__share
                                                img(src="@/assets/img/share.svg")
                                        .date__description(v-html="event.acf.description")
                                    .date__info
                                        .date__date
                                            span {{transformDate(event.acf.date).time}}
                                            span.separator |
                                            span {{transformDate(event.acf.date).day}}
                                            span {{transformDate(event.acf.date).date}}
                                        .date__buy
                                            .date__price
                                                .date__price-top ${{event.acf.ticket.price}}
                                                .date__price-bottom Includes Tax
                                            a.date__btn(:href="event.acf.ticket.purchase_link" target="_blank" v-html="event.acf.ticket.price === '' || event.acf.ticket.price === '0' ? 'RSVP' : 'buy tickets'")

                    block-popup(
                        :class="[!showPopup ? 'hidden' : '']"
                        @toggle-event="showPopup = false"
                        :event = "detailsOneEvent")    
        block-footer
</template>

<script>
    import Header from '@/blocks/header.vue';
    import Footer from '@/blocks/footer.vue';
    import Popup from '@/blocks/popup.vue';
    import CheckAge from '@/blocks/checkAge.vue';
    import Preloader from '@/blocks/preloader.vue';

    import Slick from 'vue-slick';
    import moment,{ months } from 'moment';
    import AOS from 'aos';
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: 'Events',
        data () {
            return {
                dayOfTheWeek: ['MON','TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                fullDays: ['Sunday','Monday','TuesDay','Wednesday','Thursday','Friday','Saturday'],
                countMonth: 0,
                month: [],
                arrDaysPrevMonth: [],
                arrDaysNextMonth: [],
                showFiltering: false,
                paramsFiltering: [],
                detailsOneEvent: {},
                showPopup: false,
                isAOS: false,
                isMobile: document.documentElement.clientWidth < 960,
                step: 0
            }
        },
        components: {
            'block-header': Header,
            'block-footer': Footer,
            'block-popup': Popup,
            'check-age': CheckAge,
            'preloader': Preloader,
            Slick
        },
        computed: {
            getCurrentMonth () {
                return moment().add(this.countMonth, 'month').locale('en').format('MMMM')
            },
            getCurrentShortMonth () {
                return moment().add(this.countMonth, 'month').locale('en').format('MM')
            },
            getCurrentYear () {
                return moment().add(this.countMonth, 'month').locale('en').format('YYYY')
            },
            getEventsByMonth () {
                let monthDate = moment().add(this.countMonth, 'month').startOf('month');

                let days = [...Array(monthDate.daysInMonth())].map((_, index) => {
                    return monthDate.clone().add(index, 'day')
                })

                this.month = days.slice();

                let quantityDays = 7,
                    daysBeforeStart = this.month[0].isoWeekday() - 1,
                    daysAfterEnd = quantityDays - this.month[this.month.length - 1].isoWeekday();

                let daysInPrevMonth = moment().add(this.countMonth, 'month').subtract(1, 'month').daysInMonth();

                let arrDaysPrevMonth = [...Array(daysBeforeStart)].map((_, index) => {
                    return moment().add(this.countMonth, 'month').subtract(1, 'month').date(daysInPrevMonth - daysBeforeStart + 1).clone().add(index, 'day')
                });
                this.arrDaysPrevMonth = arrDaysPrevMonth.slice();


                let arrDaysNextMonth = [...Array(daysAfterEnd)].map((_, index) => {
                    return moment().add(this.countMonth + 1, 'month').date(1).clone().add(index, 'day')
                });
                this.arrDaysNextMonth = arrDaysNextMonth.slice();
                
                let m = arrDaysPrevMonth.concat(this.month).concat(arrDaysNextMonth);
                //console.log(m);

                let mV = [];
                let e = this.events;
                /*for (let event of e) {
                    console.log(this.transformDate(event.acf.date).fullDate);
                }
                console.log('---------');
                m.forEach(day => {
                    console.log(this.fixDate(day._d));
                });
                
                if((this.transformDate(event.acf.date).fullDate).toLowerCase() == (this.fixDate(day._d)).toLowerCase()){
                            console.log('----******-----');
                            mV.push({
                                day:day,
                                event:event
                            });
                            break;
                        } else {
                            console.log('----&&&&&&----');
                            mV.push({
                                day:day
                            });
                            break;                     
                        }
                
                */

                m.forEach(day => {
                    mV.push({
                        day:day,
                        event:this.checkEvent(day)
                    });
                });


                return this.month = mV;
            },
            ...mapState([
                'activeModeTable',
                'events'
            ]),
            ...mapGetters([
				'getEventsType'
			])
        },
        created () {
            if(!this.events.length) this.$store.dispatch('GET_EVENTS')
        },
        mounted () {
            this.checkAOS();
            this.checkDevice();
            if(this.events.length) {
                this.$store.commit('SET_PRELOADER', false);
            } else {
                this.$store.commit('SET_PRELOADER', true);
            }
        },
        watch: {
            events() {
                
                setTimeout(()=> {
                    this.$store.commit('SET_PRELOADER', false);
                }, 500);
            }
        },
        methods: {
            checkEvent(day){
                
                let e = this.events;
                var data = false;
                e.forEach(event => {
                    if((this.transformDate(event.acf.date).fullDate).toLowerCase() == (this.fixDate(day._d)).toLowerCase()){
                        data = event;
                    }
                });
                
                return data;
            },
            prevMonth () {
                if(this.countMonth == 0) {
                    return false;
                }
                this.countMonth -= 1
            },
            nextMonth () {
                this.countMonth += 1;
            },
            today (day) {
                return moment().isSame(day, 'day')
            },

            setDisplayDate (i) {
                return i < this.arrDaysPrevMonth.length || i >= this.month.length - this.arrDaysNextMonth.length
            },

            setParamFiltering (e) {
                let param = e.target.previousSibling.value;

                if(this.paramsFiltering.includes(param)) {
                    this.paramsFiltering.splice(this.paramsFiltering.indexOf(param), 1)
                } else {
                    this.paramsFiltering.push(param)
                }
            },
            searchEventType (type) {
                return this.paramsFiltering.indexOf(type) < 0
            },
            validationOfEvent (event, currDay) {
                var event = event
                console.log(event);
                console.log(currDay);

                const check = event.acf.date.split('/')[0] == currDay.format('D') && event.acf.date.split('/')[1] == currDay.format('MM') && event.acf.date.split('/')[2].substr(0,4) == currDay.format('YYYY');
                return check;
            },
            setCalendarDisplay(val) {
                this.$store.commit('SET_CALENDAR_DISPLAY', val)
            },
            togglePopup (event) {
                if(this.isMobile) {
                    this.showPopup = !this.showPopup;
                    return this.detailsOneEvent = event;
                }
            },
            /*transformDate(d) {
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
            },*/
            fixDate(s) {
                return String(s).split(' ').slice(0,4).join(' ');
            },
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
                res.fullDate = String(date).split(' ').slice(0,4).join(' ');
                
                return res;
            },
            checkDevice () {
                window.addEventListener('resize', () => {
                    document.documentElement.clientWidth < 960 ? this.isMobile = true : this.isMobile = false;
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
    .events {

        &__wrapper {
            width: 100%;
            max-width: 1196px;
            margin: auto;
            padding: 0 30px;
            box-sizing: content-box;
        }
    }

    .calendar {
        padding-top: 173px;
        padding-bottom: 88px;

        &__head {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
        }

        &__season {
            display: flex;
            align-items: center;
            font-size: 22px;
            line-height: 26px;
            text-transform: uppercase;
            color: #2C2C2C;
        }

        &__arrow {
            margin-bottom: 5px;
            cursor: pointer;
        }

        &__next {
            margin-left: 37px;
        }

        &__prev {
            margin-right: 39px;
        }

        &__month {
            margin-right: 8px;
        }

        &__year {
            margin-left: 8px;
            opacity: 0.3;
        }

        &__type {
            font-size: 18px;
            text-transform: uppercase;
            margin-left: auto;
            margin-right: 12.9%;
            position: relative;
            cursor: pointer;

            &.show {
                .arrow-slide-down {
                    opacity: 0;
                }

                .arrow-slide-up {
                    opacity: 1;
                }
            }

            .arrow-slide-down {
                position: absolute;
                bottom: 6px;
                right: -27px;
                transition: .3s opacity ease;
            }

            .arrow-slide-up {
                position: absolute;
                bottom: 6px;
                right: -27px;
                transition: .3s opacity ease;
                opacity: 0;
            }
        }

        &__grid {
            display: flex;
            align-items: center;

            & > * {
                &:first-child {
                    margin-right: 10px;
                }
            }
        }

        &__mode {
            opacity: .5;
            transition: .3s opacity ease;

            &.active {
               opacity: 1; 
            }  
        }

        &__filtering-wrapper {
            width: 100%;
            height: 49px;
            background: #FAFAFA;
            padding: 0 52px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__checkbox {
            display: none;

            &:checked {
                & + .calendar__label {
                    &:after {
                        background: #DF574E;
                    }
                }
            }
        }

        &__label {
            font-size: 10px;
            line-height: 120.5%;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            position: relative;
            cursor: pointer;

            &::after {
                content: '';
                position: absolute;
                left: -25px;
                top: 50%;
                transform: translateY(-50%);
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: transparent;
                border: 1px solid #DF574E;
                box-sizing: border-box;
                transition: .3s background ease;
            }
        }

        /*TABLE STYLING*/
        &__body {
            width: 100%;
            margin-top: 27px;
        }

        &__days {
            display: flex;
        }

        &__day {
            width: 12.96%;
            margin-right: 18px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 12px;
            line-height: 14px;
            color: #2C2C2C;
            padding-left: 8px;

            &:last-child {
                margin-right: 0;
            }
        }

        &__table {
            display: flex !important;
            flex-wrap: wrap;

            & > * {
                &:not(:nth-child(7n)) {
                    margin-right: 1.5%;
                }
            }
        }

        &__link {
            width: 12.99%;
            height: 155px;
            box-sizing: border-box;
            margin-bottom: 19px;
            text-align: center;
            position: relative;

            &:first-child {
                margin-top: 28px;
            }

            & > .date {
                width: 100%;
            }
        }

        &__mode-row {
            .date {
                width: 100%;
                margin: 0 0 30px 0;
                display: flex;
                height: 1px;
                min-height: 155px;
                width: 100%;

                &:last-child {
                    margin-bottom: 0;
                }

                .date__preview {
                    width: 155px;
                    height: 100%;
                }

                .date__text {
                    width: calc(100% - 300px);
                }

                .date__content {
                    align-items: flex-start;
                    height: 100%;
                    width: calc(100% - 165px);
                    margin-left: 10px;
                    background: #FAFAFA;
                    padding: 32px 28px 14px 35px;
                }

                .date__header {
                    width: auto;
                    align-items: flex-start;
                    justify-content: flex-start;
                }

                .date__title {
                    font-size: 22px;
                    line-height: 114%;
                    margin: 0 20px 14px 0;
                }

                .date__share {
                    margin: -3px 0 0 0;
                }

                .date__info {
                    width: auto;
                }

                .date__date {
                    text-align:right;
                    display: flex;

                    /deep/ span{
                        font-size: 18px;
                        line-height: 114%;
                        text-transform: uppercase;
                        color: rgba(38, 38, 38, 0.91);
                        white-space: nowrap;
                        margin-right: 5px;

                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }

    .date {
        width: 12.99%;
        height: 155px;
        box-sizing: border-box;
        margin-bottom: 19px;
        text-align: center;
        position: relative;

        &:nth-child(7n) {
            margin-right: 0;
        }

        &.another-month {
            border: 1px solid rgba(0, 0, 0, 0.75);
        }

        &.empty {
            background-color: rgba(0, 0, 0, 0.75);

            .date__num {
                color: #fff;
            }
        }

        &.event {
            background: #fff;
            border: none;

            .date__num {
                background: #fff;
                color: rgba(0, 0, 0, 0.75);
                right: 9px;
            }
        }

        &.today {
            // background-color: rgba(0, 0, 0, 0.75);

            .date__num {
                background: #DF574E;
                color: #fff;
                right: 9px;
            }
        }

        &__num {
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 12px;
            right: 15px;
            font-size: 12px;
            line-height: 121.2%;
            color: rgba(0, 0, 0, 0.75);
        }

        &__preview {
            width: 100%;
            height: 75%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            position: relative;
        }

        &__content {
            width: 100%;
            height: 25%;
            display: flex;
            align-items: flex-end;
        }

        &__text {
            width: 100%;
        }

        &__header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            width: 100%;
        }

        &__title {
            font-size: 12px;
            line-height: 121.2%;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.75);
            text-align: left;
        }

        &__share {
            margin-bottom: -5px;
        }

        &__description {
            text-align: left;
            font-family: 'Overpass';
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 117.5%;
            color: rgba(38, 38, 38, 0.91);
            max-width: 476px;
            // text-transform: uppercase;
        }

        &__info {
            width: 300px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        &__date {
            width: 100%;
            font-size: 18px;
            line-height: 114%;
            text-transform: uppercase;
            color: rgba(38, 38, 38, 0.91);
            margin-top: 4px;
        }

        &__buy {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
        }

        &__price {
            font-size: 12px;
            line-height: 114%;
            text-transform: uppercase;
            text-align: left;
        }

        &__price-top {
            font-size: 22px;
            line-height: 114%;
        }

        &__btn {
            font-size: 18px;
            line-height: 114%;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #DF574E;
        }
    }

    @media screen and (max-width: 1256px) {
        .events {
            &__wrapper {
                max-width: none;
                width: calc(100% - 60px);
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .calendar {
            &__link {
                height: 125px;

                &.mode-row {
                    height: auto;

                    .date {
                        height: auto;
                        min-height: 155px;
                        margin-bottom: 0;

                        &__preview {
                            height: 100%;
                        }
                    }
                }
            }
        }

        .date {
            height: 125px;
        }
    }

    @media screen and (max-width: 960px) {
        .events {
            &__wrapper {
                padding: 0 33px;
                width: calc(100% - 66px);
            }
        }
        .calendar {
            padding-top: 125px;
            padding-bottom: 74px;

            &__head {
                flex-direction: column;
                margin-bottom: 15px;
            }

            &__grid {
                display: none;
            }

            &__type {
                margin: auto;
                padding-right: 19px;

                .arrow-slide-down {
                    right: -5px;
                }

                .arrow-slide-up {
                    right: -5px;
                }
            }

            &__season {
                margin-bottom: 29px;
            }

            &__day {
                font-size: 10px;
                line-height: 12px;
                width: 12.99%;
                margin-right: 1.5%;
                margin-bottom: 17px;
                text-align: center;
                padding-left: 0;
            }

            &__body {
                margin-top: 24px;
            }

            &__table {
                & > * {
                    &:not(:nth-child(7n)) {
                        margin-right: 1.8756%;
                    }
                }
            }
        }

        .date {
            height: 88px;
            width: 12.678%;
            margin-bottom: 14px;

            &.event {
                .date__num {
                    top: 7px;
                    right: 3px;
                }

                .date__preview {
                    width: 100%;
                    height: 100%;
                }

                .date__content {
                    display: none;
                }
            }

            &.today {
                .date__num {
                    top: 7px;
                    right: 3px;
                }
            }

            &__num {
                width:auto;
                min-width: 18px;
                height:auto;
                padding: 2px 3px;
                top: 7px;
                right: 3px;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .events {
            &__wrapper {
                padding: 0;
                width: 100%;
            }
        }

        .calendar {
            padding-top: 86px;
            padding-bottom: 58px;

            &__head {
                margin-bottom: 8px;
            }

            &__season {
                font-size: 16px;
                line-height: 19px;
                margin-bottom: 19px;
                padding-left: 8px;
            }

            &__month {
                margin-right: 6px;
            }

            &__year {
                margin-left: 6px;
            }

            &__prev {
                margin-right: 15px;
            }

            &__next {
                margin-left: 15px;
            }

            &__type {
                font-size: 14px;
                line-height: 120.5%;
                padding-right: 0;

                .arrow-slide-down {
                    right: -20px;
                    bottom: 4px;
                }

                .arrow-slide-up {
                    right: -20px;
                    bottom: 4px;
                }
            }

            &__body {
                margin-top: 12px;
            }

            &__filtering-wrapper{
                padding: 15px 32px 5px;
                height: auto;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            &__filtering-field {
                padding-left: 25px;
                width: 50%;
                margin-bottom: 10px;
            }

            &__day {
                font-size: 10px;
                line-height: 12px;
                margin-bottom: 4px;
            }
        }

        .date {
            height: 53px;
            margin-bottom: 7px;

            &.today {
                .date__num {
                    top: 4px;
                    right: 3px;
                }
            }

            &.event {
                .date__num {
                    top: 4px;
                    right: 3px;
                }
            }

            &__num {
                min-width: 14px;
                height: 14px;
                padding: 0 1px;
                top: 4px;
                right: 4px;
            }
        }
    }

    @media screen and (max-width: 375px) {
        .calendar {
            padding-top: 82px;
            padding-bottom: 62px;

            &__season {
                padding-left: 0;
            }

            &__type {
                padding-right: 9px;

                .arrow-slide-down {
                    right: -10px;
                }

                .arrow-slide-up {
                    right: -10px;
                }
            }

            &__day {
                margin-bottom: 8px;
            }

            &__label {
                font-size: 9px;
            }

            &__table {
                & > * {
                    &:not(:nth-child(7n)) {
                        margin-right: 1.72%;
                    }
                }
            }
        }

        .date {
            height: 41px;
            width: 12.81%;
            margin-bottom: 5px;

            &.today {
                .date__num {
                    top: 4px;
                    right: 3px;
                }
            }

            &.event {
                .date__num {
                    top: 4px;
                    right: 3px;
                }
            }

            &__num {
                min-width: 11px;
                height: 11px;
                padding-top: 2px;
                top: 4px;
                right: 3px;
                font-size: 9px;
            }
        }
    }
</style>
