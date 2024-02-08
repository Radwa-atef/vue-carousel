<script>
  import Carousel from "@/components/carousel/Index.vue";

  export default {
    name: 'App',
    components: {
      Carousel,
    },
    data(){
      return{
      /** content => array of objects that has
       * {
       *  value:"required",
       *  isClickable:"Boolean|optional",
       *  type:"image/video/custom|required",
       *  component:"required incase the type is custom"
       * }
       * */
        content:[
          {value:"https://wallpapercave.com/wp/wp3194559.jpg", isClickable: true, type: "image"},
          {value:"https://www.pixelstalk.net/wp-content/uploads/2016/09/Best-Beautiful-Images-For-Desktop-Nature.png", isClickable: true, type: "image"},
        ]
      }
    },
    methods: {
      entityClicked(item) {
        console.log(item)
      },
    },
  };
</script>

<template>
  <div id="app h-100">
    <Carousel
      :content="content"
      @entity-clicked="entityClicked"
    />
  </div>
</template>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
.h-100
  height: 100%
</style>
