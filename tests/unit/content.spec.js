import { mount } from "@vue/test-utils"
import Carousel from "@/components/carousel/Index.vue"
import Slide from "@/components/carousel/Slide.vue"

describe("the content DOM rendering", () => {
  it("should recieve content prop as required prop", () => {
    const content = [];
    const wrapper = mount(Carousel, {
      propsData: { content },
    });
    // Ensure the component renders without errors
    expect(wrapper.exists()).toBe(true);
  })
  it("should render all the items based on the content prop length", () => {
    const wrapper = mount(Carousel, {
      propsData: { content: Array(5).fill().map(() => ({ value: "", type: "image" })) },
    });
    const contentItemsElements = wrapper.findAll(".slide-item")
    expect(contentItemsElements.length).toEqual(wrapper.props().content.length)
  })
  it("respects the content type: it displays an image element for the image media type", () => {
    const item = { value: "image1", type: "image" }
    const wrapper = mount(Slide, {
      propsData: { item },
    });
    const imageElement = wrapper.find("img");
    expect(imageElement.exists()).toBe(true);
    expect(imageElement.attributes("src")).toBe(item.value)
  })

  it("respects the content type: it displays a video element for the video media type", () => {
    const item = { value: "video-url.mp4", type: "video" }
    const wrapper = mount(Slide, {
      propsData: { item },
    });
    const videoElement = wrapper.find("video");
    expect(videoElement.exists()).toBe(true);
    expect(videoElement.find("source").attributes("src")).toBe(item.value)
  })

  it("respects the content type: it displays a custom component for the custom content type", () => {
    const item = { type: "custom", component: "CustomComponent" };
    const wrapper = mount(Slide, {
      propsData: { item },
      stubs: {
        CustomComponent: {
          template: "<div>Custom Component</div>",
        },
      },
    });

    // Ensure that the custom component is rendered
    const customComponent = wrapper.find(".carousel-custom-type-container");
    expect(customComponent.exists()).toBe(true);
    expect(customComponent.text()).toBe("Custom Component");
  });
  // it("respects the media type: it displays an audio element for the audio media type", () => {})
  it("should emit an event if the media is clickable", () => {
    const content = [
      { value: "", type: "image", isClickable: true },
      { value: "", type: "image", isClickable: false },
      { value: "", type: "image" },
    ]
    const wrapper = mount(Carousel, {
      propsData: { content },
    });

    content.forEach((el, index) => {
      const clickableSlide = wrapper.find(`[data-test-id=slide-${index}`)
      clickableSlide.trigger("click");
      if (el.isClickable) {
        // assert event has been emitted
        expect(wrapper.emitted("entity-clicked")).toBeTruthy();
        // assert event payload
        expect(wrapper.emitted("entity-clicked")[index]).toEqual([{ ...content[index] }]);
      } else {
        expect(wrapper.vm.entityClicked(el)).toBeFalsy();
      }
    })
  })
})

describe("the itemsPerSlide prop", () => {
  it("should render the number of items per slide based on the itemsPerSlide prop which is 1 by default", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
      },
    })
    const carouselContentElement = wrapper.find(".carousel-content")
    const displayedItems = carouselContentElement.findAll("[data-test-id=active]")
    expect(displayedItems.length).toEqual(1)
  })
  it("should render the number of items per slide based on the itemsPerSlide prop", () => {
    const wrapper = mount(Carousel, {
      propsData: {
        content: Array(5).fill().map(() => ({ value: "", type: "image" })),
        itemsPerSlide: 2,
      },
    })
    const carouselContentElement = wrapper.find(".carousel-content")
    const displayedItems = carouselContentElement.findAll("[data-test-id=active]")
    expect(displayedItems.length).toBeLessThanOrEqual(wrapper.props().itemsPerSlide)
  })
})
