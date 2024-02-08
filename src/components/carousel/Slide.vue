<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        aspectRatio: null,
      };
    },
    methods: {
      calculateAspectRatio() {
        const { image } = this.$refs;
        if (image.complete) {
          const width = image.naturalWidth;
          const height = image.naturalHeight;
          this.aspectRatio = width / height;
        }
      },
    },
  };
</script>

<template>
  <div class="slide-type">
    <img
      v-if="item.type === 'image'"
      ref="image"
      :style="`aspect-ratio: ${aspectRatio};width: 100%;object-fit: contain`"
      class="carousel-img-container"
      :src="item.value"
      loading="lazy"
      @load="calculateAspectRatio"
    >

    <video
      v-if="item.type === 'video'"
      class="carousel-video-container"
      width="100%"
      height="100%"
      controls
    >
      <source :src="item.value" type="video">
      Your browser does not support the video tag.
    </video>
    <div v-if="item.type === 'custom'" class="carousel-custom-type-container">
      <component :is="item.component" />
    </div>
  </div>
</template>

<style>
</style>
