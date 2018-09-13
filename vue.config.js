module.exports = {
  outputDir: 'dist',
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_mixins.scss";
          @import "@/scss/_variables.scss";
          @import 'sass-rem/_rem.scss';
        `
      }
    }
  },
  baseUrl: process.env.NODE_ENV === 'production' ? '/sites/all/themes/scetv/etv_timeline/dist/' : '',
  filenameHashing: false,
  lintOnSave: undefined
}
