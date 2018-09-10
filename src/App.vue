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
  </div>
</template>

<script>
import VueTinySlider from 'vue-tiny-slider'
import slideData from './assets/slideData.js'

export default {
  name: 'app',
  data: () => {
    return {
      slides: slideData
    }
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
    },
    imagePath (fileName) {
      return require('./assets/slides-media/' + fileName)
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
  }
}
</script>

<style lang="scss">

@import 'scss/_variables.scss';
@import 'scss/_mixins.scss';
@import 'tiny-slider/src/tiny-slider.scss';
@import 'sass-rem/_rem.scss';

#timeline {
  font-family: 'open-sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;

  img {
    max-width: 100%;
  }
}

.tns-outer {
  background-image: url('~@/assets/timeline-bg.jpg');
  background-size: cover;
  @include bp($medium) {
    background-size: contain;
  }
}

.tns-controls {
  position: absolute;
}

.slide {
  @include font-smoothing;
  position: relative;
  height: 100vh;
  display: flex;
  max-height: 780px;

  @include bp($medium) {
    height: auto;
    height: 48.75vw;
  }

  &__container {
    max-width: rem(1600px);
    margin: 0 auto;
    display: flex;
  }
}

.governor {
  display: flex;
  justify-content: center;
  flex-flow: column;

  @include bp($small) {
    flex-flow: row;
  }

  // layout
  &__info {
    padding: 0 rem(16px) rem(16px) rem(80px);

    @include bp($small) {
      text-align: right;
      width: 40%;
      padding: 0 1rem;
    }

    @include bp($medium) {
      padding: 0 #{(62px /1600px) * 100%} 0 0;
    }

    @include bp($xlarge) {
      width: rem(400px);
      padding: 0 #{(62px /1600px) * 100%} 0 0;
    }

    @include bp($xlarge) {
      width: #{(400px / 1600px) * 100%};
      padding: 0 #{(62px /1600px) * 100%} 0 0;
    }
  }

  &__other {
    display: flex;
    order: -1;

    @include bp($small) {
      order: 0;
      width: 60%;
    }

    @include bp($medium) {
      width: #{(930px / 1600px) * 100%};
      order: 0;
    }
  }

  // elements
  &__bio {
    font-size: rem(12px);

    @include bp($large) {
      font-size: rem(16px);
    }
  }

  &__note {
    font-size: rem(12px);
  }

  &__year {
    display: block;
    font-weight: 200;
    color: $orange;
    margin: 0;
    font-size: rem(32px);

    @include bp($small) {
      margin-top: rem(16px);
    }

    @include bp($medium) {
      margin-top: rem(48px);
      font-size: rem(36px);
    }

    @include bp($large) {
      font-size: rem(72px);
    }

    @include bp($xlarge) {
      font-size: rem(120px);
    }

    @include bp($xxlarge) {
      font-size: rem(150px);
    }
  }

  &__years {
    // width: #{(130px / 1600px) * 100%};
    width: rem(60px);
    border-left: 5px solid $purple;
    position: absolute;
    top: 0;
    bottom: 0;
    flex: 0 0 auto;

    @include bp($small) {
      width: rem(65px);
      position: relative;
    }

    @include bp($large) {
      width: rem(130px);
      position: relative;
    }

    &__list {
      cursor: ns-resize;
      list-style: none;
      padding: 2rem 0;
      margin: 0;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      height: 100%;

      @include bp($small) {
        padding: 1rem 0;
      }

      @include bp($medium) {
        padding: 1rem 0;
      }

      li {
        color: #9E708B;
        opacity: .29;
        font-size: rem(18px);
        font-weight: 100;
        text-align: center;
        display: block;

        @include bp($large) {
          font-size: rem(30px);
        }

        &:nth-child(4) {
          font-weight: 700;
          position: relative;
          text-indent: -9999px;
          opacity: 1;

          &:before {
            content: '';
            width: 100%;
            height: 5px;
            background: $purple;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          &:after {
            content: '';
            width: 15px;
            height: 15px;
            background: $purple;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  &__name {
    margin: 0;
    color: #000;

    @include bp($medium) {
      font-size: rem(34px);
    }
  }

  &__media {
    padding: rem(16px) rem(24px) 0 rem(82px);

    @include bp($small) {
      padding: rem(16px) rem(24px) 0 rem(24px);
    }

    @include bp($large) {
      padding-left: 2rem;
    }

    img {
      max-height: rem(600px);
    }
  }

  &__links {
    list-style: none;
    padding: 0;
    margin: 0;

    a {
      font-size: rem(12px);
      color: $teal;
      font-weight: 700;
      display: block;
      margin: 0 auto .5rem;

      @include bp($large) {
        font-size: rem(16px);
      }
    }
  }
}
</style>
