<template>
  <div class="timeline-modal">
    <youtube :video-id="youtubeId" :player-vars="playerVars" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      playerVars: {
        autoplay: 0,
        controls: 1
      }
    }
  },
  props: ['youtubeId']
}
</script>

<style lang="scss">
.timeline-modal {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.v--modal-overlay {
  .v--modal-box {
    height: auto !important;
  }
}
</style>
