<template>
  <div id="timeline">
    <vue-tiny-slider
      ref="tinySlider"
      :loop="false"
      :controls="false"
      :touch="false"
      :axis="'vertical'"
      class="timeline"
    >
      <section
        class="slide"
        :data-timeline-decade="slide.decade"
        v-for="(slide, index) in slides" :key="index"
      >
        <div class="slide__container">
          <article class="governor">
            <div class="governor__info">
              <h2 class="governor__year">{{ slide.year }}</h2>
              <h3 class="governor__name">{{ slide.governor.name }}</h3>
              <p class="governor__bio">{{ slide.governor.bio }}</p>
              <ul class="governor__links">
                <li v-for="(link, index) in slide.links" :key="link.url + index">
                  <a :href="link.url">{{ link.text }}</a>
                </li>
              </ul>
              <p v-if="slide.note" class="governor__note">
                <strong>Note:</strong> {{ slide.note }}
              </p>
            </div>
            <div class="governor__other">
              <div class="governor__years">
                <ul class="governor__years__list" v-hammer:swipe="timelineMove">
                  <li v-for="(year, index) in surroundingYears(slide.year)" :key="slide.governor.name.split(' ')[0] + index">{{ year }}</li>
                </ul>
              </div>
              <div class="governor__media">
                <img :src="imagePath(slide.governor.image)">
              </div>
            </div>
          </article>
        </div>
      </section>
    </vue-tiny-slider>
    <section class="decades">
      <ul class="decades__list">
        <li
          @click="goToSlideByDecade(decade.year)"
          v-for="decade in decades"
          :key="decade.year"
          :class="[
            { 'active': theCurrentDecade === decade.year ? true : false }
          ]"
        >{{ decade.year }}s</li>
      </ul>
    </section>
  </div>
</template>

<script>
import VueTinySlider from 'vue-tiny-slider'
import slideData from './assets/slideData.js'

export default {
  name: 'app',
  data: () => {
    return {
      slides: slideData,
      currentDecade: null,
      decades: [
        { year: 1940 },
        { year: 1950 },
        { year: 1960 },
        { year: 1970 },
        { year: 1980 },
        { year: 1990 },
        { year: 2000 },
        { year: 2010 }
      ]
    }
  },
  mounted () {
    this.currentDecade = parseInt(this.getCurrentSlideInfo().dataset['timelineDecade'])
  },
  components: {
    VueTinySlider
  },
  methods: {
    getInfo (event) {
      this.$refs.tinySlider.slider.getInfo()
    },
    timelineMove (event) {
      // if swipe up
      if (event.direction === 8) {
        this.$refs.tinySlider.slider.goTo('next')
      }

      // if swipe down
      if (event.direction === 16) {
        this.$refs.tinySlider.slider.goTo('prev')
      }

      this.updateCurrentDecade()
    },
    getSlideByDecade (decade) {
      const slideItems = Array.from(this.$refs.tinySlider.slider.getInfo().slideItems)
      return slideItems.find(slide => parseInt(slide.dataset['timelineDecade']) === decade)
    },
    goToSlideByDecade (decade) {
      let targetSlideIndex = this.getSlideByDecade(decade)['id'].split('item').pop()
      this.$refs.tinySlider.slider.goTo(targetSlideIndex)
      this.updateCurrentDecade()
    },
    updateCurrentDecade () {
      const currentSlideInfo = this.getCurrentSlideInfo()
      this.currentDecade = parseInt(currentSlideInfo.dataset['timelineDecade'])
    },
    imagePath (fileName) {
      return require('./assets/slides-media/' + fileName)
    },
    getCurrentSlideInfo () {
      let slideItems = Array.from(this.$refs.tinySlider.slider.getInfo().slideItems)
      return slideItems.filter(slide => slide.classList.contains('tns-slide-active'))[0]
    },
    surroundingYears (year) {
      let yearsBefore = []
      let yearsAfter = []

      for (let i = 1; i <= 3; i++) {
        yearsBefore.push(year - i)
      }

      for (let i = 1; i <= 4; i++) {
        yearsAfter.push(year + i)
      }

      return [...yearsBefore.reverse(), year, ...yearsAfter]
    }
  },
  computed: {
    theCurrentDecade () {
      return this.currentDecade
    }
  }
}
</script>

<style lang="scss">
@import 'scss/_variables.scss';
@import 'scss/_mixins.scss';
@import 'tiny-slider/src/tiny-slider.scss';
@import 'sass-rem/_rem.scss';
@import 'scss/etv-timeline.scss';
</style>
