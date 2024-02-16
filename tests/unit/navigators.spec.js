import { mount } from "@vue/test-utils"
import Carousel from "@/components/carousel/Index.vue"
import randomValue from "../utils/randomValue";

describe("the navigator component", () => {
  it("should display the navigator by default if showNavigators = true && hideControls = false && content.length > 1", () => {
    const testCases = [
      { lengthOfData: 1, showNavigators: true, hideControls: false },
      { lengthOfData: 1, showNavigators: true, hideControls: true },
      { lengthOfData: 2, showNavigators: true, hideControls: false },
      { lengthOfData: 2, showNavigators: false, hideControls: false },
      { lengthOfData: 2, showNavigators: false, hideControls: true },
      { lengthOfData: 2, showNavigators: true, hideControls: true },
    ];
    testCases.forEach((el) => {
      const wrapper = mount(Carousel, {
        propsData: {
          content: Array(el.lengthOfData).fill().map(() => ({ value: "", type: "image" })),
          showNavigators: el.showNavigators,
          hideControls: el.hideControls,
        },
      });
      const navigatorElements = wrapper.findAll(".carousel-navigator");
      const { content } = wrapper.props();
      const { showNavigators } = wrapper.props();
      const { hideControls } = wrapper.props();

      if (showNavigators && !hideControls && content.length > 1) {
        expect(navigatorElements).toHaveLength(2); // next & pervious navigators
      } else {
        expect(navigatorElements).toHaveLength(0);
      }
    })
  })
  it("should display the next index slide with content based on itemsPerSlide when clicking the right arrow", async () => {
    const content = Array(10).fill().map(() => ({ value: "", type: "image" }))
    const wrapper = mount(Carousel, {
      propsData: { content, itemsPerSlide: 2 },
    });
    const nextNavigatorElement = wrapper.find("[data-test-id=carousel-next-navigator]")
    const carouselContentElement = wrapper.find(".carousel-content")
    const displayedItems = carouselContentElement.findAll("[data-test-id=active]")

    const randomPosition = randomValue([1, 2, 3, 4,5,6,7,8,9])

    wrapper.setData({ activeSlideIndex: randomPosition })
    await nextNavigatorElement.trigger("click")

    expect(wrapper.vm.activeSlideIndex).toBe(randomPosition + 1)
    expect(displayedItems.length).toBeLessThanOrEqual(wrapper.props().itemsPerSlide)
  })

  it("should display the previous index slide with content based on itemsPerSlide when clicking the left arrow", async () => {
    const content = Array(10).fill().map(() => ({ value: "", type: "image" }))
    const wrapper = mount(Carousel, {
      propsData: { content, itemsPerSlide: 2 },
    });
    const nextNavigatorElement = wrapper.find("[data-test-id=carousel-previous-navigator]")
    const carouselContentElement = wrapper.find(".carousel-content")
    const displayedItems = carouselContentElement.findAll("[data-test-id=active]")

    const randomPosition = randomValue([2, 3, 4, 5])

    wrapper.setData({ activeSlideIndex: randomPosition })
    await nextNavigatorElement.trigger("click")

    expect(wrapper.vm.activeSlideIndex).toBe(randomPosition - 1)
    expect(displayedItems.length).toEqual(wrapper.props().itemsPerSlide)
  })

  it("should display the next arrow disabled if the current index is the last index", async () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
        itemsPerSlide: 2,
      },
    });
    wrapper.setData({ activeSlideIndex: 3 })
    const nextNavigatorElement = wrapper.find("[data-test-id=carousel-next-navigator]")
    await nextNavigatorElement.trigger("click")
    expect(wrapper.vm.isNextSlideDisabled).toBe(true);
    expect(nextNavigatorElement.classes()).toContain("cursor-no-drop");
  })

  it("should display the previous arrow disabled if the current index is the first index", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
        itemsPerSlide: 2,
      },
    });
    const previousNavigatorElement = wrapper.find("[data-test-id=carousel-previous-navigator]");
    wrapper.setData({ activeSlideIndex: 1 })
    expect(wrapper.vm.isPreviousSlideDisabled).toBe(true);
    expect(previousNavigatorElement.classes()).toContain("cursor-no-drop");
  })
})

describe("the direction prop", () => {
  it("should render the arrows direction based on the direction prop which is ltr by default", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
        direction: "ltr",
      },
    });
    const previousElement = wrapper.find("[data-test-id=carousel-previous-navigator]");
    const previousLeftIconComponent = previousElement.findComponent({ name: "LeftIcon" });
    const previousRightIconComponent = previousElement.findComponent({ name: "RightIcon" });
    expect(previousLeftIconComponent.exists()).toBe(true);
    expect(previousRightIconComponent.exists()).toBe(false);

    const nextElement = wrapper.find("[data-test-id=carousel-next-navigator]");
    const nextLeftIconComponent = nextElement.findComponent({ name: "LeftIcon" });
    const nextRightIconComponent = nextElement.findComponent({ name: "RightIcon" });
    expect(nextLeftIconComponent.exists()).toBe(false);
    expect(nextRightIconComponent.exists()).toBe(true);
  })
  it("should render the arrows direction to be rtl if the prop is rtl", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
        direction: "rtl",
      },
    });
    const previousElement = wrapper.find("[data-test-id=carousel-previous-navigator]");
    const previousLeftIconComponent = previousElement.findComponent({ name: "LeftIcon" });
    const previousRightIconComponent = previousElement.findComponent({ name: "RightIcon" });
    expect(previousLeftIconComponent.exists()).toBe(false);
    expect(previousRightIconComponent.exists()).toBe(true);

    const nextElement = wrapper.find("[data-test-id=carousel-next-navigator]");
    const nextLeftIconComponent = nextElement.findComponent({ name: "LeftIcon" });
    const nextRightIconComponent = nextElement.findComponent({ name: "RightIcon" });
    expect(nextLeftIconComponent.exists()).toBe(true);
    expect(nextRightIconComponent.exists()).toBe(false);
  })
})

describe("the navigators slots", () => {
  it("should have a named slot for the next navigator called next-navigator", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      },
      slots: {
        "next-navigator": '<div class="custom-next-navigator"> + </div>',
      },
    });
    const customNextNavigator = wrapper.find(".custom-next-navigator");
    // Assert that the specific element exists
    expect(customNextNavigator.exists()).toBe(true);
    expect(customNextNavigator.text()).toEqual("+")

    const nextElement = wrapper.find("[data-test-id=carousel-next-navigator]");
    const nextLeftIconComponent = nextElement.findComponent({ name: "LeftIcon" });
    const nextRightIconComponent = nextElement.findComponent({ name: "RightIcon" });
    expect(nextLeftIconComponent.exists()).toBe(false);
    expect(nextRightIconComponent.exists()).toBe(false);
  })

  it("should have a named slot for the previous navigator called previous-navigator", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      },
      slots: {
        "previous-navigator": '<div class="custom-previous-navigator"> - </div>',
      },
    });
    const customPreviousNavigator = wrapper.find(".custom-previous-navigator");
    // Assert that the specific element exists
    expect(customPreviousNavigator.exists()).toBe(true);
    expect(customPreviousNavigator.text()).toEqual("-")

    const previousElement = wrapper.find("[data-test-id=carousel-previous-navigator]");
    const leftIconComponent = previousElement.findComponent({ name: "LeftIcon" });
    const rightIconComponent = previousElement.findComponent({ name: "RightIcon" });
    expect(leftIconComponent.exists()).toBe(false);
    expect(rightIconComponent.exists()).toBe(false);
  })
})
