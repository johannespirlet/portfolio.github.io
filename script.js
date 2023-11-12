"use strict";

document.addEventListener("scroll", function() {

    const sideMenu = document.querySelector(".fixed_nav");

    (window.innerHeight + Math.round(window.scrollY)+160) >= (document.body.offsetHeight) ? sideMenu.classList.add("slide-in") : sideMenu.classList.remove("slide-in");

});