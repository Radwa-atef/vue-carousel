<script>
  import RightIcon from "./icons/Right.vue";
  import LeftIcon from "./icons/Left.vue";
  import DotIcon from "./icons/Dot.vue";
  import Slide from "./Slide.vue";

  export default {
    components: {
      RightIcon,
      LeftIcon,
      DotIcon,
      Slide,
    },
    props: {
      content: {
        type: Array,
        required: true,
        validator(value) {
          value.forEach((el) => {
            const requiredKeys = ["value", "type"];
            requiredKeys.forEach((key) => {
              if (el[key] === undefined) {
                /* eslint-disable */
              console.log(`missing ${key} key`);
              /* eslint-enable */
                return false;
              }
              return true;
            });
            if (!["image", "video", "custom"].includes(el.type)) {
              /* eslint-disable */
            console.log(`unexpecting slide type: ${el.type}`);
            /* eslint-enable */
              return false;
            }

            if (el.type === "custom") {
              if (!el.component) {
                /* eslint-disable */
              console.log("There is no custom component passed");
              /* eslint-enable */
                return false;
              }
            }
            return true;
          });
          return true;
        },
      },
      direction: {
        type: String,
        required: false,
        default: "ltr",
        validator(value) {
          return ["ltr", "rtl"].includes(value);
        },
      },
      showDelimiters: {
        type: Boolean,
        required: false,
        default: true,
      },
      showNavigators: {
        type: Boolean,
        required: false,
        default: true,
      },
      hideControls: {
        type: Boolean,
        required: false,
        default: false,
      },
      autoplay: {
        type: Boolean,
        required: false,
        default: true,
      },
      interval: {
        type: Number,
        required: false,
        default: 5000,
      },
      itemsPerSlide: {
        type: Number,
        required: false,
        default: 1,
      },

    },
    data() {
      return {
        activeSlideIndex: 0,
        carouselInterval: null,
      };
    },
    computed: {
      lengthOfData() {
        return this.content.length;
      },
      isPreviousSlideDisabled() {
        return this.activeSlideIndex === 0;
      },
      isNextSlideDisabled() {
        return (
          this.activeSlideIndex + this.itemsPerSlide >= this.lengthOfData
        );
      },
      displayNavigators() {
        return this.showNavigators && !this.hideControls && this.lengthOfData > 1;
      },
      delimitersLength() {
        let num = 0;
        if (this.lengthOfData > this.itemsPerSlide) {
          num = Math.ceil(this.lengthOfData / this.itemsPerSlide);
        }
        return num;
      },
    },
    mounted() {
      if (this.autoplay && this.lengthOfData > 1) {
        this.handleInterval();
      }
    },
    beforeDestroy() {
      this.stopInterval();
    },
    methods: {
      handleInterval() {
        const self = this;
        this.carouselInterval = setInterval(() => {
          self.autoPlaySlides();
        }, self.interval);
      },
      stopInterval() {
        clearInterval(this.carouselInterval);
      },
      rePlayInterval() {
        if (!this.autoplay) return;
        this.stopInterval();
        this.handleInterval();
      },
      autoPlaySlides() {
        if (this.isNextSlideDisabled) {
          this.activeSlideIndex = 0;
        } else {
          this.activeSlideIndex += this.itemsPerSlide;
        }
      },
      setActiveSlideIndex(i) {
        this.activeSlideIndex = i * this.itemsPerSlide;
        this.rePlayInterval();
      },
      previousSlide() {
        if (this.isPreviousSlideDisabled) return
        this.activeSlideIndex -= this.itemsPerSlide;
        this.rePlayInterval();
      },
      nextSlide() {
        if (this.isNextSlideDisabled) return
        this.activeSlideIndex += this.itemsPerSlide;
        this.rePlayInterval();
      },
      entityClicked(item) {
        if (!item.isClickable) return;
        this.$emit("entity-clicked", item);
      },
    },
  };
</script>

<template>
  <div v-if="lengthOfData" class="carousel-container">
    <!-- previous navigator -->
    <div
      v-if="displayNavigators"
      data-test-id="carousel-previous-navigator"
      class="carousel-navigator previous"
      :class="{ 'cursor-no-drop': isPreviousSlideDisabled }"
      @click="previousSlide"
    >
      <slot name="previous-navigator">
        <span v-if="direction === 'rtl'"><RightIcon :color="isPreviousSlideDisabled ? 'var(--carousel-secondary)' : 'var(--carousel-black)'" /></span>
        <span v-else><LeftIcon :color="isPreviousSlideDisabled ? 'var(--carousel-secondary)' : 'var(--carousel-black)'" /></span>
      </slot>
    </div>
    <!-- end -->

    <!-- content -->
    <!--
      - (activeSlideIndex + itemsPerSlide) to handle case if the activeSlideIndex = 0
      - this condition implemented to render all items with d-none class and add d-block
      if the items indexes are between the current index and the activeSlideIndex (0-3), (3-6) ...
     -->
    <div class="carousel-content">
      <div
        v-for="(item, index) in content" :key="index"
        :class="index >= activeSlideIndex + itemsPerSlide ? 'd-none' :
          index < activeSlideIndex ? 'd-none':'d-block'"
        :data-test-id="index >= activeSlideIndex + itemsPerSlide ? 'not-active' :
          index < activeSlideIndex ? 'not-active':'active'"
      >
        <Slide
          :data-test-id="`slide-${index}`"
          class="slide-fade slide-item"
          :class="{ 'cursor-pointer': item.isClickable}"
          :item="item"
          @click.native="entityClicked(item)"
        />
      </div>
    </div>
    <!-- end -->

    <!-- next navigator -->
    <div
      v-if="displayNavigators"
      data-test-id="carousel-next-navigator"
      class="carousel-navigator next"
      :class="{ 'cursor-no-drop': isNextSlideDisabled }"
      @click="nextSlide()"
    >
      <slot name="next-navigator">
        <span v-if="direction === 'rtl'"><LeftIcon :color="isNextSlideDisabled ? 'var(--carousel-secondary)' : 'var(--carousel-black)'" /></span>
        <span v-else><RightIcon :color="isNextSlideDisabled ? 'var(--carousel-secondary)' : 'var(--carousel-black)'" /></span>
      </slot>
    </div>
    <!-- end -->

    <!-- delimiters -->
    <div
      v-if="showDelimiters && !hideControls && lengthOfData > 1"
      class="carousel-delimiters"
    >
      <div
        v-for="(_, index) in delimitersLength"
        :key="index"
        class="delimiter-container"
        @click="setActiveSlideIndex(index)"
      >
        <slot
          name="delimiter"
          :slot-props="{
            activeDelimiter: !!index * itemsPerSlide === activeSlideIndex
          }"
        >
          <span class="dot-delimiter">
            <DotIcon
              :color="
                index * itemsPerSlide === activeSlideIndex
                  ? 'var(--carousel-primary)'
                  : 'var(--carousel-secondary)'
              "
            />
          </span>
        </slot>
      </div>
    </div>
    <!-- end -->
  </div>
  <div v-else class="text-center">
    There is no carousel data
  </div>
</template>

<style lang="sass">
@import "./style.sass"
</style>
