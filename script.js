"use strict";

import CustomSelect from "./components/customSelect.js";

//create custom select box for languages
const languageSelect = document.querySelector("select");
const mySelect = new CustomSelect(languageSelect);
const image_of_mine = document.querySelector("#me");

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
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
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


//Slide-In Event for fixed menu bar in case scroll top is beyond welcome-pic or bottom is beyond footer
document.addEventListener("scroll", function () {

    const sm_fixed_nav = document.querySelector(".fixed_nav");

    ((window.innerHeight + Math.round(window.scrollY) + 160) >= (document.body.offsetHeight) || image_of_mine.getBoundingClientRect().bottom > 0)
        ? sm_fixed_nav.classList.add("slide-in") :
        sm_fixed_nav.classList.remove("slide-in");

});

//Slide-in Event for Sidemenu from mobile view
const burgerInput = document.querySelector("input[type='checkbox']");
const burger = document.querySelector("#burger");
const sideMenu = document.querySelector("#sidemenu");
const sideMenuLinks = sideMenu.querySelectorAll("a");

//Change Event that toggles Menu with toggleSideMenu function
burgerInput.addEventListener("change", function () {
    toggleSideMenu();
});

//Resize Event for to close sidemenu
window.addEventListener("resize", () => {
    burger.classList.remove("to-fixed");
    mySelect.selectContainer.style.marginRight = "0";
    burgerInput.checked = false;
    sideMenu.classList.add("slide-in");
});

//Click Event for each link in Sidemenu to close it
sideMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
        toggleSideMenu();
        burgerInput.checked = false;
    });
});

//Toggle Function for the side menu
function toggleSideMenu() {
    sideMenu.classList.toggle("slide-in");
    burger.classList.toggle("to-fixed");
    mySelect.selectContainer.style.marginRight == "3.5rem" ? mySelect.selectContainer.style.marginRight = "0" : mySelect.selectContainer.style.marginRight = "3.5rem";
}

//Observer which starts animation when Sektion comes into view
const observer = new IntersectionObserver(entries => {
    // Loop over the entries
    entries.forEach(entry => {
        // If the element is visible
        if (entry.isIntersecting) {
            // Add the animation class
            entry.target.classList.remove("animatable");
            entry.target.classList.add("animated");
        }
    });
});

document.querySelectorAll('.animatable').forEach(section => {
    observer.observe(section);
});

//Submit Event that sends an Email via smtp
const formular = document.querySelector("form");
formular.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;

    Email.send({
        SecureToken: "8eb57486-6ffe-4df2-aed3-a2d222a5fb60",
        To: 'jpirlet32@googlemail.com',
        From: 'jpirlet32@googlemail.com',
        Subject: `Portfolio: Anfrage von ${name}`,
        Body: `<b>Name:</b>  ${name}<br><b>E-Mail:</b>  ${email}<br><b>Message:</b><br><br>${message}`
    }).then(() => {
        formular.nextElementSibling.style.opacity = "1";
    }
    );

    formular.reset();

});

//loads new, unloads old language file and updates lang in local storage
export let changeLanguageJS = function () {

    unloadJS();
    loadJS(`./lang/lang.${mySelect.value}.js`);

    if (localStorage) {
        localStorage.setItem("lang", mySelect.value);
    }
}

//dynamically load js file
let loadJS = function (FILE_URL) {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");

    document.body.appendChild(scriptEle);

    // success event 
    scriptEle.addEventListener("load", () => {
        //console.log(`File loaded: ${scriptEle.src}`);
        insertLanguage();
    });
    // error event
    scriptEle.addEventListener("error", (ev) => {
        console.log("Error on loading file", ev);
    });


}

//unload js file
let unloadJS = function () {
    const allScriptNodes = document.querySelectorAll("script");
    for (let i = 0; i < allScriptNodes.length; i++) {
        if (allScriptNodes[i].src == "http://127.0.0.1:5500/portfolio.github.io/lang/lang.en.js" || allScriptNodes[i].src == "http://127.0.0.1:5500/portfolio.github.io/lang/lang.de.js") {
            //console.log(`File unloaded: ${allScriptNodes[i].src}`);
            allScriptNodes[i].remove();
            return;
        }
    }
}

//inserts texts, placeholders, titles, labels and alts to elements
let insertLanguage = function () {

    const allTexts = document.querySelectorAll("[lang]");
    const allPlaceholders = document.querySelectorAll("[placeholder]");
    const allTitles = document.querySelectorAll("[title]");
    const allAriaLabels = document.querySelectorAll("[aria-label]");
    const allAlts = document.querySelectorAll("[alt]");

    for (let i = 1; i < allTexts.length; i++) {
        allTexts[i].textContent = texts[i];
        allTexts[i].lang = mySelect.value;
    }

    for (let i = 0; i < allPlaceholders.length; i++) {
        allPlaceholders[i].placeholder = placeholder[i];
    }

    for (let i = 0; i < allTitles.length; i++) {
        allTitles[i].title = titles[i];
    }

    for (let i = 0; i < allAriaLabels.length; i++) {
        allAriaLabels[i].ariaLabel = ariaLabels[i];
    }

    for (let i = 0; i < allAlts.length; i++) {
        allAlts[i].alt = alts[i];
    }

};

if (!localStorage.getItem("lang")) {
    loadJS(`./lang/lang.en.js`);
    localStorage.setItem("lang", "en");
} else {
    mySelect.selectValue(localStorage.getItem("lang"));
}


//if motion is reduced show headings statically else start animation
const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

if (!!isReduced) {
    document.querySelector("#greeting").style.opacity = 1;
    const introduction = document.querySelector("#introduction");
    introduction.style.opacity = 1;
    introduction.style.transform = `translateX(0)`;
    document.querySelector("#sub_introduction").style.opacity = 1;
} else {
    const greeting_element = document.querySelector("#greeting");
    const introduction = document.querySelector("#introduction");
    const sub_introduction = document.querySelector("#sub_introduction");

    const showImage = function () {

        image_of_mine.style.opacity = +image_of_mine.style.opacity + easeInCubic(0.3);

        return (image_of_mine.style.opacity >= 1);
    }
    const showGreeting = function () {

        greeting_element.style.opacity = +greeting_element.style.opacity + easeInLinear(0.1);

        return (greeting_element.style.opacity > 1);
    }
    const showIntroduction = function () {

        introduction.style.transform = `translateX(0)`;
        introduction.style.opacity = +introduction.style.opacity + easeInLinear(0.1);

        return (introduction.style.opacity > 1);
    }
    const showSubIntroduction = function () {

        sub_introduction.style.opacity = +sub_introduction.style.opacity + easeInLinear(0.15);
        return (sub_introduction.style.opacity > 1);
    }

    let playing = true;
    let animStack = [showImage, showGreeting, showIntroduction, showSubIntroduction];
    let currentAnim;

    //Picture Fade and Text Slides with requestanimationframe
    function startGreetingAnimation() {
        if (currentAnim === undefined) {

            if (animStack.length > 0) {
                currentAnim = animStack.shift();
            } else {
                playing = false;
                return;
            }
        }
        if (currentAnim()) {
            if (animStack.length > 0) {
                currentAnim = animStack.shift();
            } else {
                playing = false;
                currentAnim = undefined;
            }
        }

        if (playing) {
            requestAnimationFrame(startGreetingAnimation);
        }
    }

    requestAnimationFrame(startGreetingAnimation);
}

// utility functions
function easeInCubic(t) {
    return t ** 3;
}

function easeInLinear(t) {
    return 2 * t / 10;
}
