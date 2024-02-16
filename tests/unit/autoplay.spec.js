import { mount } from "@vue/test-utils"
import Carousel from "@/components/carousel/Index.vue"
import randomValue from "../utils/randomValue";

jest.useFakeTimers(); // Mock the timers

it("shouldn't display the next slide after the interval time if the autoplay prop is false", () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      autoplay: false,
    },
  });
  jest.advanceTimersByTime(wrapper.props().interval); // by default = 5000
  expect(wrapper.vm.activeSlideIndex).toBe(1); // by default starts with 1
  jest.runOnlyPendingTimers();
  expect(wrapper.vm.activeSlideIndex).toBe(1);
})

it("should display the next slide after the interval time if the autoplay prop is true", () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(10).fill().map(() => ({ value: "", type: "image" })),
    },
  });

  const randomIndex = randomValue([0, 1, 2, 3, 4, 5, 6, 7, 8]) // depends on itemsPerSlide, by defualt = 1
  wrapper.setData({ activeSlideIndex: randomIndex })

  jest.advanceTimersByTime(wrapper.props().interval); // by default 5000
  expect(wrapper.vm.activeSlideIndex).toBe(randomIndex + wrapper.props().itemsPerSlide);
})
it("should display the next slide after the number of seconds passed into the interval prop if the autoplay prop is true", () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      interval: 3000,
    },
  });
    // itemsPerSlide by defualt = 1
  const randomIndex = randomValue([0, 1, 2, 3]) // depends on itemsPerSlide
  wrapper.setData({ activeSlideIndex: randomIndex })
  jest.advanceTimersByTime(3000);
  expect(wrapper.vm.activeSlideIndex).toBe(randomIndex + wrapper.props().itemsPerSlide);
})

it("should autoloop over the media", () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      interval: 3000,
      itemsPerSlide: 2,
    },
  });

  wrapper.setData({ activeSlideIndex: 3 }) // based on itemsPerSlide, the last index will be 3
  jest.advanceTimersByTime(3000);
  expect(wrapper.vm.activeSlideIndex).toBe(1);
})

it("should clear the interval in the beforeDestroy hook", () => {
  // we need to search to find a solution to test clear interval
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      interval: 3000,
      itemsPerSlide: 2,
    },
  });
  const stopInterval = jest.spyOn(wrapper.vm, "stopInterval"); // mock function
  wrapper.destroy();
  expect(stopInterval).toHaveBeenCalled()
})

it("should reset the timer if the autoplay is true and a navigator is clicked", async () => {
  const wrapper = mount(Carousel, {
    propsData: {
      content: Array(10).fill().map(() => ({ value: "", type: "image" })),
      interval: 3000,
    },
  });
  const rePlayInterval = jest.spyOn(wrapper.vm, "rePlayInterval"); // mock function
  const nextNavigatorElement = wrapper.find("[data-test-id=carousel-next-navigator]")

  const randomIndex = randomValue([0, 1, 2, 3, 4, 5, 6, 7]) // depends on itemsPerSlide, by defualt = 1
  wrapper.setData({ activeSlideIndex: randomIndex })

  jest.advanceTimersByTime(2000);
  await nextNavigatorElement.trigger("click")

  // called rePlayInterval to reset the interval value
  expect(rePlayInterval).toHaveBeenCalled()
  expect(wrapper.vm.activeSlideIndex).toBe(randomIndex + wrapper.props().itemsPerSlide);

  // after the interval value will get the next slide
  const { activeSlideIndex } = wrapper.vm
  jest.advanceTimersByTime(3000);
  expect(wrapper.vm.activeSlideIndex).toBe(activeSlideIndex + wrapper.props().itemsPerSlide);
})
