import { mount } from "@vue/test-utils"
import Carousel from "@/components/carousel/Index.vue"
import randomValue from "../utils/randomValue";

it("should display the delimiter elements by default if showDelimiters = true && hideControls = false && content.length > 1", () => {
  const testCases = [
    { lengthOfData: 1, showDelimiters: true, hideControls: false },
    { lengthOfData: 1, showDelimiters: true, hideControls: true },
    { lengthOfData: 2, showDelimiters: true, hideControls: false },
    { lengthOfData: 2, showDelimiters: false, hideControls: false },
    { lengthOfData: 2, showDelimiters: false, hideControls: true },
    { lengthOfData: 2, showDelimiters: true, hideControls: true },
  ];
  testCases.forEach((el) => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(el.lengthOfData).fill().map(() => ({ value: "", type: "image" })),
        showDelimiters: el.showDelimiters,
        hideControls: el.hideControls,
      },
    });
    const delimiterElements = wrapper.findAll(".dot-delimiter");
    const { content } = wrapper.props();
    const { showDelimiters } = wrapper.props();
    const { hideControls } = wrapper.props();

    if (showDelimiters && !hideControls && content.length > 1) {
      expect(delimiterElements).toBeTruthy();
      expect(delimiterElements).toHaveLength(content.length);
    } else {
      expect(delimiterElements).toHaveLength(0);
    }
  })
})
it("should render delimiters based on content length and number of items per slide ", () => {
  const testCases = [
    { lengthOfData: 10, itemsPerSlide: 2, expectedDelimitersLength: 5 },
    { lengthOfData: 8, itemsPerSlide: 3, expectedDelimitersLength: 3 },
    { lengthOfData: 5, itemsPerSlide: 1, expectedDelimitersLength: 5 },
    { lengthOfData: 0, itemsPerSlide: 1, expectedDelimitersLength: 1 },
    { lengthOfData: 4, itemsPerSlide: 5, expectedDelimitersLength: 1 },
  ];
  testCases.forEach((el) => {
    const wrapper = mount(Carousel, {
      propsData: { content: Array(el.lengthOfData).fill().map(() => ({ value: "", type: "image" })), itemsPerSlide: el.itemsPerSlide },
    });
    if (el.lengthOfData > el.itemsPerSlide) {
      expect(wrapper.vm.numOfSlides).toEqual(el.expectedDelimitersLength)
    } else {
      expect(wrapper.vm.numOfSlides).toEqual(1)
    }
  })
})

it("should display the clicked index slide item with content based on itemsPerSlide", async () => {
  const wrapper = mount(Carousel, {
    propsData: { content: Array(5).fill().map(() => ({ value: "", type: "image" })), itemsPerSlide: 2 },
  });
  const carouselContentElement = wrapper.find(".carousel-content")
  const displayedItems = carouselContentElement.findAll("[data-test-id=active]")

  const randomElementPosition = randomValue([1, 2])

  const delimiterElement = wrapper.findAll(".delimiter-container").at(randomElementPosition)
  await delimiterElement.trigger("click");

  expect(wrapper.vm.activeSlideIndex).toBe(randomElementPosition+1);
  expect(displayedItems.length).toBeLessThanOrEqual(wrapper.props().itemsPerSlide)
})

it("should do nothing when clicking on the active index", async () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      itemsPerSlide: 2,
    },
  });
  const randomElementPosition = randomValue([1, 2])

  wrapper.setData({ activeSlideIndex: randomElementPosition })
  // const delimiterElement = wrapper.findAll(".delimiter-container").at(randomElementPosition)
  wrapper.vm.setActiveSlideIndex(randomElementPosition)
  // await delimiterElement.trigger("click");
  expect(wrapper.vm.activeSlideIndex).toEqual(randomElementPosition)
})

it("should have a named slot for the delimiters called delimiters", () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      itemsPerSlide: 2,
    },
    slots: {
      delimiter: "<div class='custom-delimiter'><p class='delimiter'> * </p></div>",
    },
  });

  const customDelimiter = wrapper.findAll(".custom-delimiter");
  expect(customDelimiter).toHaveLength(3)
  expect(wrapper.find(".delimiter").text()).toEqual("*")

  const dotDelimiterElement = wrapper.findAll(".dot-delimiter");
  expect(dotDelimiterElement).toHaveLength(0)
})
