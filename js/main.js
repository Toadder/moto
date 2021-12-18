function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector("body").classList.add("webp");
  } else {
    document.querySelector("body").classList.add("no-webp");
  }
});

function _removeClass(array, removedClass) {
  for (let el of array) el.classList.remove(removedClass);
}

function _addClass(array, addedClass) {
  for (let el of array) el.classList.add(addedClass);
}

function getInputNumbersValue(input) {
  // Return stripped input value — just numbers
  return input.value.replace(/\D/g, "");
}

function ymap() {
  let sectionMap = document.querySelector(".top-footer__map");

  function ymapInit() {
    if (typeof ymaps === "undefined") return;
    let ymap = document.getElementById("ymap");

    ymaps.ready(function () {
      let map = new ymaps.Map("ymap", {
        center: [44.574939115459905, 38.070559675407345],
        zoom: 18,
        controls: ["zoomControl"],
        behaviors: ["drag"],
      });

      // Placemark
      let placemark = new ymaps.Placemark(
        [44.574939115459905, 38.070559675407345],
        {
          // Hint
          hintContent: "CFMOTO",
          balloonContentHeader: "CFMOTO",
          balloonContentBody: "г. Геленджик",
        },
        {
          preset: "islands#icon",
          iconColor: "#037e8c",
        }
      );

      map.geoObjects.add(placemark);
    });
  }

  window.addEventListener("scroll", checkYmapInit);
  checkYmapInit();

  function checkYmapInit() {
    let sectionMapTop = sectionMap.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let sectionMapOffsetTop = sectionMapTop + scrollTop;

    if (scrollTop + window.innerHeight > sectionMapOffsetTop) {
      ymapLoad();
      window.removeEventListener("scroll", checkYmapInit);
    }
  }

  function ymapLoad() {
    let script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    document.body.appendChild(script);
    script.onload = ymapInit;
  }

  window.addEventListener("resize", moveMap);
  moveMap();

  function moveMap() {
    const map = document.querySelector(".top-footer__map"),
      content = document.querySelector(".top-footer__content"),
      grid = document.querySelector(".top-footer__grid");
    if (window.matchMedia("(max-width: 1200px)").matches) {
      if (!content.querySelector(".top-footer__map")) {
        content.insertBefore(map, grid);
      }
    } else {
      if (content.querySelector(".top-footer__map")) {
        document.querySelector(".top-footer").appendChild(map);
      }
    }
  }
}

function formAddError(el) {
  el.classList.add("_error");
  el.parentElement.classList.add("_error");
}

function formRemoveError(el) {
  el.classList.remove("_error");
  el.parentElement.classList.remove("_error");
}

function emailTest(input) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input.value);
}

// Phone mask
function phoneMask() {
  let phoneInputs = document.querySelectorAll("input[data-tel-input]");

  for (let phoneInput of phoneInputs) {
    phoneInput.addEventListener("keydown", onPhoneKeyDown);
    phoneInput.addEventListener("input", onPhoneInput, false);
    phoneInput.addEventListener("paste", onPhonePaste, false);
  }

  function onPhonePaste(e) {
    let input = e.target,
      inputNumbersValue = getInputNumbersValue(input);
    let pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      let pastedText = pasted.getData("Text");
      if (/\D/g.test(pastedText)) {
        // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
        // formatting will be in onPhoneInput handler
        input.value = inputNumbersValue;
        return;
      }
    }
  }

  function onPhoneInput(e) {
    let input = e.target,
      inputNumbersValue = getInputNumbersValue(input),
      selectionStart = input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return (input.value = "");
    }

    if (input.value.length != selectionStart) {
      // Editing in the middle of input, not last symbol
      if (e.data && /\D/g.test(e.data)) {
        // Attempt to input non-numeric symbol
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9")
        inputNumbersValue = "7" + inputNumbersValue;
      let firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
  }

  function onPhoneKeyDown(e) {
    // Clear input after remove last symbol
    let inputValue = e.target.value.replace(/\D/g, "");
    if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
    }
  }
}

// Popup
function popup() {
  const popupLinks = document.querySelectorAll(".popup-link");
  const body = document.querySelector("body");
  const lockPadding = document.querySelectorAll(".lock-padding");
  let unlock = true;
  const timeout = 550;

  if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
        const popupName = popupLink.getAttribute("href").replace("#", "");
        const currentPopup = document.getElementById(popupName);
        popupOpen(currentPopup);
        e.preventDefault();
      });
    }
  }

  const popupCloseIcon = document.querySelectorAll(".close-popup");
  if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
        popupClose(el.closest(".popup"));
        e.preventDefault();
      });
    }
  }

  function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
      const popupActive = document.querySelector(".popup._open");
      if (popupActive && !popupActive.classList.contains('tour')) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }
      currentPopup.classList.add("_open");
      currentPopup.addEventListener("click", function (e) {
        if (!e.target.closest(".popup__content")) {
          popupClose(e.target.closest(".popup"));
        }
      });
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
      popupActive.classList.remove("_open");
      if (doUnlock && document.querySelectorAll('.popup._open').length === 0) {
        bodyUnlock();
      }
    }
  }

  function bodyLock() {
    const lockPaddingValue =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add("_lock");

    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }

  function bodyUnlock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = "0px";
        }
      }
      body.style.paddingRight = "0px";
      if (!document.querySelector(".menu").classList.contains("_active")) {
        body.classList.remove("_lock");
      }
    }, timeout);

    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }

  document.addEventListener("keydown", function (e) {
    if (e.which === 27) {
      const popupActive = document.querySelector(".popup._open");
      popupClose(popupActive);
    }
  });
}

// Anchors scroll
function anchorScroll() {
  const links = document.querySelectorAll("a._anchor-scroll");

  for (let index = 0; index < links.length; index++) {
    const link = links[index];

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const href = link.getAttribute("href").replace("#", ""),
        header = document.querySelector(".header"),
        scrollTarget = document.getElementById(href);
      let topOffset;
      if (
        header.classList.contains("_scroll") ||
        window.matchMedia("(max-width: 1200px)").matches
      ) {
        topOffset = header.offsetHeight;
      } else {
        topOffset = 106;
      }
      const elementPosition = scrollTarget.getBoundingClientRect().top,
        offsetPosition = elementPosition - topOffset;

      document.querySelector(".menu").classList.remove("_active");
      document.querySelector(".header__burger").classList.remove("_active");
      document.body.classList.remove("_lock");

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  }
}

// Form Validation
function formCheck() {
  const forms = document.querySelectorAll("form");
  for (var i = 0; i < forms.length; i++) {
    form = forms[i];

    form.addEventListener("submit", formSend);
  }
  async function formSend(e) {
    e.preventDefault();
    let form = e.currentTarget;

    let error = formValidate(form);

    if (error === 0) {
      // ОТПРАВКА ФОРМЫ
    }
  }
  function formValidate(form) {
    let error = 0;
    let formReq = form.querySelectorAll("._req");

    for (var i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      formRemoveError(input);

      if (input.value == "") {
        formAddError(input);
        error++;
      }
    }

    return error;
  }
}

window.onload = function(e) {
   
   // Form Validation & Send
   const forms = document.querySelectorAll("form");
   for (var i = 0; i < forms.length; i++) {
     form = forms[i];

     form.addEventListener("submit", formSend);
   }
   async function formSend(e) {
     e.preventDefault();

     let error = formValidate(form);
     let formData = new FormData(form);

     if (error === 0) {
       // ОТПРАВКА ФОРМЫ
     }
   }
   function formValidate(form) {
     let error = 0;
     let formReq = form.querySelectorAll("._req");

     for (var i = 0; i < formReq.length; i++) {
       const input = formReq[i];
       formRemoveError(input);

       if (input.classList.contains("_email")) {
         if (!emailTest(input)) {
           formAddError(input);
           error++;
         }
       } else if (input.value == "") {
         formAddError(input);
         error++;
       }
     }
   }

   function numberInput() {
     const
     wrappers = document.querySelectorAll('.book-tour__counter');
     
     for(const wrapper of wrappers) {
       const input = wrapper.querySelector('._tour-number'),
     plus = wrapper.querySelector('.book-tour__plus'),
     minus = wrapper.querySelector('.book-tour__minus');

     plus.addEventListener('click', () => {
        if(+input.value < 100) {
          input.value = +input.value + 1;
        }
       });

       minus.addEventListener('click', () => {
        if(+input.value > 1) {
          input.value = +input.value - 1;
        }
       });

     input.addEventListener('input', () => {
       let correctValue = getInputNumbersValue(input);

       if(correctValue < 1 && correctValue != '') correctValue = 1;
       else if(correctValue > 100) correctValue = 100;

        input.value = correctValue;
     });
     }
   }

   function fillFeature() {
     const 
      links = document.querySelectorAll('.price-tour__info'),
      placePower = document.querySelector('.feature__item_power'),
      placeVolume = document.querySelector('.feature__item_volume');

     for(const link of links) {
       link.addEventListener('click', () => {
        placePower.querySelector('b').innerText = link.parentElement.getAttribute('data-power');
        placeVolume.querySelector('b').innerText = link.parentElement.getAttribute('data-volume');
       });
     }
   }

   function spoilers(blockWithSpoilers, accordion = true, duration = 500) {
  const block = blockWithSpoilers,
    spoilersArray = block.querySelectorAll("[data-spoiler]");

   if(spoilersArray.length > 0) {
      for (let index = 0; index < spoilersArray.length; index++) {
         const spoiler = spoilersArray[index];

         spoiler.addEventListener('click', (e) => {
            const spoilerBody = spoiler.nextElementSibling;

            if(!block.querySelectorAll('._slide').length) {
               if(accordion && !spoiler.classList.contains('_active')) {
                  hideSpoilerBody();
               }
               spoiler.classList.toggle('_active');
               spoiler.parentElement.classList.toggle("_active");
               _slideToggle(spoilerBody, duration);
            }
            e.preventDefault();
         });
      }
   }

   function hideSpoilerBody() {
      const activeSpoiler = block.querySelector('[data-spoiler]._active');
      if (activeSpoiler) {
        activeSpoiler.classList.remove("_active");
        activeSpoiler.parentElement.classList.remove("_active");
        _slideUp(activeSpoiler.nextElementSibling, duration);
      }
   }

}

/* SLIDE UP */
const _slideUp = (target, duration = 500) => {
  if(!target.classList.contains('_slide')) {
     target.classList.add('_slide');
     target.style.transitionProperty = "height, margin, padding";
     target.style.transitionDuration = duration + "ms";
     target.style.boxSizing = "border-box";
     target.style.height = target.offsetHeight + "px";
     target.offsetHeight;
     target.style.overflow = "hidden";
     target.style.height = 0;
     target.style.paddingTop = 0;
     target.style.paddingBottom = 0;
     target.style.marginTop = 0;
     target.style.marginBottom = 0;
     window.setTimeout(() => {
       target.style.display = "none";
       target.style.removeProperty("height");
       target.style.removeProperty("padding-top");
       target.style.removeProperty("padding-bottom");
       target.style.removeProperty("margin-top");
       target.style.removeProperty("margin-bottom");
       target.style.removeProperty("overflow");
       target.style.removeProperty("transition-duration");
       target.style.removeProperty("transition-property");
       target.classList.remove("_slide");
     }, duration);
  }
};

/* SLIDE DOWN */
const _slideDown = (target, duration = 500) => {
  if(!target.classList.contains('_slide')) {
     target.classList.add("_slide");
     target.style.removeProperty("display");
     let display = window.getComputedStyle(target).display;
     if (display === "none") display = "block";
     target.style.display = display;
     let height = target.offsetHeight;
     target.style.overflow = "hidden";
     target.style.height = 0;
     target.style.paddingTop = 0;
     target.style.paddingBottom = 0;
     target.style.marginTop = 0;
     target.style.marginBottom = 0;
     target.offsetHeight;
     target.style.boxSizing = "border-box";
     target.style.transitionProperty = "height, margin, padding";
     target.style.transitionDuration = duration + "ms";
     target.style.height = height + "px";
     target.style.removeProperty("padding-top");
     target.style.removeProperty("padding-bottom");
     target.style.removeProperty("margin-top");
     target.style.removeProperty("margin-bottom");
     window.setTimeout(() => {
       target.style.removeProperty("height");
       target.style.removeProperty("overflow");
       target.style.removeProperty("transition-duration");
       target.style.removeProperty("transition-property");
       target.classList.remove("_slide");
     }, duration);
  }
};

/* TOOGLE */
const _slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === "none") {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};

spoilers(document.querySelector(".ask__spoilers"), true, 700);

const tourItems = document.querySelectorAll(".main-tour__item");
for(const item of tourItems) {
  spoilers(item, true, 700);
}


   function sliders() {
  // Team Slider
  const teamSlider = new Swiper(".team__slider", {
    slidesPerView: 4,
    speed: 1200,
    loop: true,
    slidesPerGroup: 4,
    autoHeight: true,
    preventInteractionOnTransition: true,
    spaceBetween: 30,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".team__slider",
    },

    pagination: {
      el: ".team__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.6,
        slidesPerGroup: 1,
        speed: 800,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        speed: 1200,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
    },
  });

  //  Photo Slider
  const photoSlider = new Swiper(".photo__slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 3.4,
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    parallax: true,
    slidesPerGroup: 1,
    speed: 1000,
    loopedSlides: 5,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    pagination: {
      el: ".photo__pagination",
      type: "bullets",
      clickable: true,
    },

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".photo__slider",
    },

    breakpoints: {
      320: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      768: {
        spaceBetween: 20,
        slidesPerView: 1.9,
      },
      992: {
        slidesPerView: 3.4,
        spaceBetween: 30,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide,
              prev = active.previousElementSibling,
              next = active.nextElementSibling;

            if (window.matchMedia("(max-width: 991.98px)").matches) {
              active.querySelector(".photo__img").classList.add("_big");
            } else {
              prev.querySelector(".photo__img").classList.add("_big");
              next.querySelector(".photo__img").classList.add("_big");
              active.querySelector(".photo__img").classList.add("_big");
            }
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".photo__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide,
              prev = active.previousElementSibling
                ? active.previousElementSibling
                : slides[slides.length - 1],
              next = active.nextElementSibling
                ? active.nextElementSibling
                : slides[0];

            if (window.matchMedia("(max-width: 991.98px)").matches) {
              active.querySelector(".photo__img").classList.add("_big");
            } else {
              prev.querySelector(".photo__img").classList.add("_big");
              next.querySelector(".photo__img").classList.add("_big");
              active.querySelector(".photo__img").classList.add("_big");
            }
          }
        }
      },
    },
  });

  // Intro Slider
  const introSlider = new Swiper(".intro__slider", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    loop: true,
    parallax: true,
    slidesPerGroup: 1,
    speed: 1200,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".intro__body",
    },

    pagination: {
      el: ".intro__pagination",
      type: "bullets",
      clickable: true,
    },
    autoplay: {
      delay: 4000,
    },
  });

  const pathSlider_one = new Swiper(".item-path__slider_one", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".item-path__wrapper_one",
    },

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.9,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });

  const pathSlider_two = new Swiper(".item-path__slider_two", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,
    rtl: true,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".item-path__wrapper_two",
    },

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.9,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });
    

  const pathSlider_three = new Swiper(".item-path__slider_three", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".item-path__wrapper_three",
    },

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.9,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });

  const tourSlider_base = new Swiper(".main-tour__slider_base", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".main-tour__wrapper_base",
    },

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.6,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });

  const tourSlider_medium = new Swiper(".main-tour__slider_medium", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".main-tour__wrapper_medium",
    },

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.6,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });

  const tourSlider_expert = new Swiper(".main-tour__slider_expert", {
    observer: true,
    observeParents: true,
    slidesPerView: 2.2,
    loop: true,
    parallax: true,
    speed: 1000,
    spaceBetween: 15,

    mousewheel: {
      sensitivity: 1,
      eventsTarget: ".main-tour__wrapper_expert",
    },

    lazy: {
      loadPrevNext: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibillity: true,

    pagination: {
      el: ".item-path__pagination",
      type: "bullets",
      clickable: true,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.6,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 15,
      },
    },

    on: {
      init: function () {
        let slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        for (let slide of slides) {
          if (slide.classList.contains("swiper-slide-active")) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
      slideChange: function () {
        const slider = this,
          slides = [];

        for (let i = 0; i < slider.slides.length; i++) {
          slides.push(slider.slides[i]);
        }

        slides.forEach((slide) =>
          slide.querySelector(".item-path__img").classList.remove("_big")
        );

        for (let slide of slides) {
          if (
            slide.getAttribute("data-swiper-slide-index") == slider.realIndex
          ) {
            const active = slide;

            active.querySelector(".item-path__img").classList.add("_big");
          }
        }
      },
    },
  });
}

sliders();

   function video() {
   const    
      video = document.querySelector('.video__video video'),
      playButton = document.querySelector('.video__play'),
      name = document.querySelector('.video__name');

   playButton.addEventListener('click', startVideo);

   function startVideo() {
      video.controls = true;
      playButton.classList.add("_unactive");
      name.classList.add("_unactive");
      video.parentElement.classList.add("_unbordered");

      video.play();

      playButton.removeEventListener('click', startVideo);
   }

}

video();
   function header() {
   // Header on scroll
   const header = document.querySelector('.header');

   changeHeader();
   window.addEventListener('scroll', changeHeader);

   function changeHeader() {
      
         if (window.pageYOffset > header.clientHeight) {
            if (window.innerWidth > 1200) {
              header.classList.add("_scroll");
            } 
            header.classList.add("_bg");
         } else {
            header.classList.remove("_scroll");
            header.classList.remove("_bg");
         }
   }

   // Header Burger
   const 
      burger = document.querySelector('.header__burger'),
      menu = document.querySelector('.menu');

   burger.addEventListener('click', function (e) {
      burger.classList.toggle('_active');
      document.body.classList.toggle('_lock');
      menu.classList.toggle('_active');
   });
}

header();

   ymap();
   phoneMask();
   popup();
   anchorScroll();
   formCheck();
   numberInput();
   fillFeature();
   

}



