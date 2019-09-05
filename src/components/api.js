import axios from 'axios';

export default {
    events: {
        get () {
            return axios.get('http://ribs.pro/trybasa/backend/wp-json/wp/v2/events/')
        }
    },
    main: {
        get () {
            return axios.get('http://ribs.pro/trybasa/backend/wp-json/wp/v2/vpages/?slug=main')
        }
    },
    about: {
        get () {
            return axios.get('http://ribs.pro/trybasa/backend/wp-json/wp/v2/vpages/?slug=about')
        }
    },
    faq: {
        get () {
            return axios.get('http://ribs.pro/trybasa/backend/wp-json/wp/v2/faq')
        }
    },
    contacts: {
        get () {
            return axios.get('http://ribs.pro/trybasa/backend/wp-json/wp/v2/vpages/?slug=contacts')
        }
    },
    inst: {
        get() {
            return axios.get('http://ribs.pro/trybasa/backend/wp-instagram.php')
        }
    },
    sendFormSubsribe (email) {
        axios.get(`https://app.mailerlite.com/webforms/submit/g7f0w8?fields[email]=${email}&ml-submit=1&ajax=1`).then(resp => {
            console.log(resp);
        });
    },
    signUp(email) {
        axios.get(`https://app.mailerlite.com/webforms/submit/g7f0w8?fields[email]=${email}&ml-submit=1&ajax=1`).then(resp => {
            console.log(resp);
        });
    }
};