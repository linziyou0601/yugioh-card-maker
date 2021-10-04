// only add `router.base = '/<repository_name>/'` if `DEPLOY_ENV` is `GH_PAGES`
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: ''
  }
} : {}

export default {
  ...routerBase,

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '遊戲王 卡片製造機',
    htmlAttrs: {
      lang: 'zh-tw'
    },
    meta: [
      { 'http-equiv': "refresh", content:"0; url=https://yugioh-card.linziyou.info" },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '遊戲王卡製造機，讓你製作個人化的卡片和梗圖！！' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:title', name: 'og:title', content: '遊戲王 卡片製造機' },
      { hid: 'og:description', name: 'og:description', content: '遊戲王卡製造機，讓你製作個人化的卡片和梗圖！！' },
      { hid: 'og:site_name', name: 'og:site_name', content: '遊戲王 卡片製造機' },
      { hid: 'keywords', name: 'keywords', content: '遊戲王,卡片,梗圖,產生器' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
    ],
    script: [
      {
        hid: 'gtm-script1',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-WWZYYWN8W7',
        defer: true
      },
      {
        hid: 'gtm-script2',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-WWZYYWN8W7');
        `,
        type: 'text/javascript',
        charset: 'utf-8'
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{
    src: '~/plugins/font-awesome'
  }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',

    'nuxt-font-loader',
  ],

  
  fontLoader : { 
    url: {
      local: 'fonts/font-face.css',
      google: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap',
    },
    prefetch : true,
    preconnect : true,
    preload: {
      hid: 'my-font-preload',
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',

    'nuxt-fontawesome',
  ],

  fontawesome: {
    // icon 的標籤使用 <fa>，這邊不設定就會依照 plugin 裡的設定<font-awesome-icon>
    component: 'fa', 
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['far']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      },
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
