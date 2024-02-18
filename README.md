# Carousel
This is a beta version 👩🏼‍💻.

## Tags
![Vue 2](https://img.shields.io/badge/Vue-%5E2.6.14-brightgreen)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)]()
[![Vue Carousel](https://img.shields.io/badge/Vue%20Carousel-1.0-blue.svg)]()
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen.svg)]()

## ⬇️ Installation
```
npm install @radwa-atef/vue-carousel
```
```
yarn add @radwa-atef/vue-carousel
```

## ✨ Features
- Implemented from scratch without external dependencies.
- More customizable.
- Support (images, videos, GIF, Custom).
- Direction (ltr, rtl).
- Autoplay and Interval time 🕐.
- Display one or more items per slide.
- Responsive.

## 📚 Documentation 

### GitHub Repository

You can find the source code for this project on [GitHub](https://github.com/Radwa-atef/vue-carousel).

### 👀 Options

Description of your Vue component.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | Array | true | - | An array of objects representing the content for each slide. Each object must have `value` and `type` properties. The `type` must be one of: "image", "video", "custom". If `type` is "custom", the object must also have a `component` property. |
| `direction` | String | false | ltr | The text direction of the component. Should be either ltr / rtl. |
| `showDelimiters` | Boolean | false | true | Flag to determine whether to show delimiters. |
| `showNavigators` | Boolean | false | true | Flag to determine whether to show navigators. |
| `hideControls` | Boolean | false | false | Flag to hide controls. |
| `autoplay` | Boolean | false | true | Flag to enable autoplay. |
| `interval` | Number | false | 5000 | Interval (in milliseconds) for autoplay. |
| `itemsPerSlide` | Number | false | 1 | Number of items to display per slide. |


#### Slots

| Slot Name | Description |
|-----------|-------------|
| `previous-navigator` | Slot for custom content inside the previous navigator. You can customize the appearance based on the `isDisabled` slot prop.|
| `next-navigator` | Slot for custom content inside the next navigator. You can customize the appearance based on the `isDisabled` slot prop.|
| `delimiter` | Slot for custom content inside the delimiters. You can customize the appearance based on the `activeDelimiter` slot prop. |


#### Emits

| Emit Name | Description |
|------------|-------------|
| `entity-clicked` | Emitted when a clickable item is clicked. The emitted event represents the clicked item. |


### 🤩 Usage

```vue
<template>
  <div>
    <Carousel
    :content="content"
    @entity-clicked="entityClicked"
    />
  </div>
</template>

<script>
import Carousel from '@radwa-atef/carousel-vue'

export default {
    components: {
        Carousel,
    },

    data() {
        return {
        content:[
        {
        value:"https://wallpapercave.com/wp/wp3194559.jpg", 
        isClickable: true, 
        type: "image"
        },
        {
        value:"https://wallpapercave.com/wp/wp3194559.jpg", 
        isClickable: true, 
        type: "image"
        },
        ]
        }
    },
    methods: {
        entityClicked(item) {
          console.log(item)
        },
    }
}
</script>
```
