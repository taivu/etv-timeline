<template>
  <div
    id="timeline"
    :class="[{
      'timeline--pristine': isTimelinePristine
    }]"
  >
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
        :data-timeline-year="slide.year"
        v-for="(slide, index) in slides" :key="index"
      >
        <div class="slide__container">
          <article class="governor">
            <div class="governor__info">
              <h2 class="governor__year">{{ slide.year }}</h2>
              <h3 class="governor__name">{{ slide.governor.name }}</h3>
              <p class="governor__inauguration-date">Inaugration: {{ slide.inaugurationDate }}</p>
              <p class="governor__bio">{{ slide.governor.bio }}</p>
              <ul class="governor__links">
                <li v-for="(link, index) in slide.links" :key="link.url + index">
                  <a v-if="link.type !== 'video'" :href="link.url" target="_blank" rel="external" class="governor__link">
                    {{ link.text }}
                  </a>
                  <p v-else class="governor__link" @click="popup(link.url)">
                    {{ link.text }}
                  </p>
                </li>
              </ul>
              <p v-if="slide.note" class="governor__note">
                <strong>Note:</strong> {{ slide.note }}
              </p>
            </div>
            <div class="governor__other">
              <div class="governor__years" v-hammer:swipe="timelineMove">
                <span class="timeline-arrow timeline-arrow--prev" @click="timelineArrow('prev')">Previous Timeline</span>
                <span class="timeline-arrow timeline-arrow--next" @click="timelineArrow('next')">Previous Timeline</span>
                <ul class="governor__years__list">
                  <li v-for="(year, index) in surroundingYears(slide.year)" :key="slide.governor.name.split(' ')[0] + index">{{ year }}</li>
                </ul>
              </div>
              <div class="governor__media">
                <img :src="imagePath(slide.governor.image)" :alt="slide.inaugurationYear">
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
            { 'active': theCurrentDecade === decade.year }
          ]"
        >{{ decade.year }}s</li>
      </ul>
    </section>
    <modals-container />
  </div>
</template>

<script>
import VueTinySlider from 'vue-tiny-slider'
import slideData from './assets/slideData.js'
import YoutubeModal from './components/YoutubeModal.vue'

export default {
  name: 'timeline',
  data: () => {
    return {
      slides: slideData,
      currentDecade: null,
      isPristine: true,
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
    this.$nextTick(function () {
      this.currentDecade = parseInt(this.getCurrentSlideInfo().dataset['timelineDecade'])
    })
  },
  components: {
    VueTinySlider
  },
  methods: {
    timelineMove (event) {
      // if swipe up (8) or swipe down (16)
      if (event.direction === 8) {
        this.$refs.tinySlider.slider.goTo('next')
        if (this.isPristine) {
          this.isPristine = false
        }
      } else if (event.direction === 16) {
        this.$refs.tinySlider.slider.goTo('prev')
      }
      this.updateCurrentDecade()
    },
    timelineArrow (direction) {
      if (direction === 'next') {
        this.timelineMove({ direction: 8 })
      } else if (direction === 'prev') {
        this.timelineMove({ direction: 16 })
      }
    },
    // gets id of first slide found by decade
    getSlideIndexByDecade (decade) {
      // convert from HTMLCollection to Array to run array methods
      const slideItems = Array.from(this.$refs.tinySlider.slider.getInfo().slideItems)
      return slideItems.find(slide => parseInt(slide.dataset['timelineDecade']) === decade)
    },
    goToSlideByDecade (decade) {
      const targetSlideIndex = this.getSlideIndexByDecade(decade)['id'].split('item').pop()
      this.$refs.tinySlider.slider.goTo(targetSlideIndex)
      this.updateCurrentDecade()
    },
    updateCurrentDecade () {
      const currentSlideInfo = this.getCurrentSlideInfo()
      this.currentDecade = parseInt(currentSlideInfo.dataset['timelineDecade'])
    },
    // this goes through webpack's img optimizations
    imagePath (fileName) {
      return require('./assets/slides-media/' + fileName)
    },
    getCurrentSlideInfo () {
      const slideItems = Array.from(this.$refs.tinySlider.slider.getInfo().slideItems)
      return slideItems.filter(slide => slide.classList.contains('tns-slide-active'))[0]
    },
    surroundingYears (year) {
      const yearsBefore = []
      const yearsAfter = []

      // get years before
      for (let i = 1; i <= 3; i++) {
        yearsBefore.push(year - i)
      }

      // get years after
      for (let i = 1; i <= 4; i++) {
        yearsAfter.push(year + i)
      }

      // combine and return
      return [...yearsBefore.reverse(), year, ...yearsAfter]
    },
    getYoutubeVideoId (url) {
      const id = url.split('&')[0].slice(-11)
      return id
    },
    popup (url) {
      const youtubeId = this.getYoutubeVideoId(url)
      this.$modal.show(YoutubeModal,
        { youtubeId },
        {
          adaptive: true
        })
    }
  },
  computed: {
    theCurrentDecade () {
      return this.currentDecade
    },
    isTimelinePristine () {
      return this.isPristine
    }
  }
}
</script>

<style lang="scss">
@keyframes bounce {
  from { transform: translateY(0) }
  50% { transform: translateY(0) }
  85% { transform: translateY(1rem) }
  90% { transform: translateY(-1rem) }
  100% { transform: translateY(0rem) }
}
</style>

<style lang="scss" scoped>
@import 'tiny-slider/src/tiny-slider.scss';
@import 'scss/etv-timeline.scss';
</style>

<style lang="scss">
.tns-outer {
  background-image: url('~@/assets/timeline-bg.jpg');
  background-size: cover;
  @include bp($medium) {
    background-size: contain;
  }
}
</style>
