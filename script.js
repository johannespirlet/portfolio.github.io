"use strict";

//use requestAnimationFrame in any Browser
(function () {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame =
        window[vendors[x] + "CancelAnimationFrame"] ||
        window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16-(currTime-lastTime));
        var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
  })();

const image_of_mine = document.querySelector("#me");

// fade in my image and text on me-image
function easeInCubic(t) {
    return t ** 3;
}

function easeInLinear(t) {
    return 2*t/10;
}

const greeting_element = document.querySelector("#greeting");
const introduction = document.querySelector("#introduction");
const sub_introduction = document.querySelector("#sub_introduction");
let animationId = null;

const showImage = function() {
    image_of_mine.style.opacity = +image_of_mine.style.opacity + easeInCubic(0.3);
    return (image_of_mine.style.opacity > 1);
}

const showGreeting = function() {
    greeting_element.style.opacity = +greeting_element.style.opacity + easeInLinear(0.1);
    return (greeting_element.style.opacity > 1);
}

const showIntroduction = function() {
    introduction.style.transform = `translateX(0)`;
    introduction.style.opacity = +introduction.style.opacity + easeInLinear(0.1);
    return (introduction.style.opacity > 1);
}

const showSubIntroduction = function() {
    sub_introduction.style.opacity = +sub_introduction.style.opacity + easeInLinear(0.15);
    return (sub_introduction.style.opacity > 1);
}


let playing = true;
let animStack = [showImage, showGreeting, showIntroduction, showSubIntroduction];
let currentAnim;

function startGreetingAnimation() {
    if(currentAnim === undefined){

        if(animStack.length > 0){
            currentAnim = animStack.shift();
        }else{
            playing = false;
            return;
        }
    }
    if(currentAnim()){
        if(animStack.length > 0){
            currentAnim = animStack.shift();
        }else{
            playing = false;
            currentAnim = undefined;
        }
    } 

    if(playing){
        requestAnimationFrame(startGreetingAnimation);
    }
}

//slide-in event for fixed menu bar in case scroll top is beyond welcome-pic or bottom is beyond footer
const sm_fixed_nav = document.querySelector(".fixed_nav");

document.addEventListener("scroll", function () {

    ((window.innerHeight + Math.round(window.scrollY) + 160) >= (document.body.offsetHeight) || image_of_mine.getBoundingClientRect().bottom > 0)
        ? sm_fixed_nav.classList.add("slide-in") :
        sm_fixed_nav.classList.remove("slide-in");
});

const mobile_nav = document.querySelector("#sidemenu");
const burger_input = document.querySelector("input[type='checkbox']");
const burger = document.querySelector("#burger");

burger_input.addEventListener("change", function() {
    mobile_nav.classList.toggle("slide-in");
    burger.classList.toggle("to-fixed");
});

window.onload = function () {
    requestAnimationFrame(startGreetingAnimation);
 }

 const observer = new IntersectionObserver(entries => {
    // Loop over the entries
    entries.forEach(entry => {
      // If the element is visible
      if (entry.isIntersecting) {
        // Add the animation class
        entry.target.classList.add('image-animation');
      }
    });
  });
  
  const viewbox = document.querySelectorAll('.intersec_container');
  viewbox.forEach(section => {
    observer.observe(section);
  });