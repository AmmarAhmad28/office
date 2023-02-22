import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLan from '@/plugins/locales/en.json'
import jaLan from '@/plugins/locales/ja.json'
import urLan from '@/plugins/locales/ur.json'

Vue.use(VueI18n)

const messages = {
  en: enLan,
  ja: jaLan,
  ur: urLan
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})
export default i18n;