import { changeLanguageJS } from "../script.js";

export default class CustomSelect {
    
    constructor(selectElem) {
        this.selectElem = selectElem;
        this.options = getFormattedOptions(selectElem.querySelectorAll("option"));
        this.selectContainer = document.createElement("div");
        this.selectLabel = document.createElement("span");
        this.selectList = document.createElement("ul");
        this.value = selectElem.value;
        setup(this);
        selectElem.style.display = "none";
        selectElem.after(this.selectContainer);
    }

    get selectedOption() {
        return this.options.find(option => option.selected);
    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption);
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        })
        const prevSelectedOption = this.selectedOption;
        prevSelectedOption.selected = false;
        prevSelectedOption.element.selected = false;
        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.selectLabel.innerText = newSelectedOption.value;
        this.selectList.querySelector(`[data-value=${prevSelectedOption.value}]`).classList.remove("selected");
        const newCustomElement = this.selectList.querySelector(`[data-value=${newSelectedOption.value}]`);
        newCustomElement.classList.add("selected");
        newCustomElement.scrollIntoView({ block: 'nearest'});
        this.value = newSelectedOption.value;
        changeLanguageJS();
    }

}

function setup(select) {
    select.selectContainer.classList.add("custom-select-container");
    select.selectContainer.tabIndex = 0;
    select.selectContainer.ariaLabel = "";
    select.selectLabel.classList.add("custom-select-label");
    select.selectLabel.innerText = select.selectedOption.label;

    select.selectContainer.append(select.selectLabel);

    select.selectList.classList.add("custom-select-list");
    select.options.forEach(option => {
        const optionElement = document.createElement("li");
        optionElement.classList.add("custom-select-option");
        optionElement.classList.toggle("selected", option.selected);
        optionElement.innerText = option.label;
        optionElement.dataset.value = option.value;
        optionElement.addEventListener("click", () => {
            select.selectValue(option.value);
            select.selectList.classList.remove("show");
        });
        select.selectList.append(optionElement);
    })
    select.selectContainer.append(select.selectList);

    select.selectLabel.addEventListener("click", () => {
        select.selectList.classList.toggle("show");
    });

    select.selectContainer.addEventListener("blur", () => {
        select.selectList.classList.remove("show");
    })

    let debounceTimout;
    let searchTerm = "";

    select.selectContainer.addEventListener("keydown", e => {
        switch(e.code) {
            case "Space":
                e.preventDefault();
                select.selectList.classList.toggle("show");
                break;
            case "ArrowUp":
                e.preventDefault();
                const prevOption = select.options[select.selectedOptionIndex - 1 ];
                if(prevOption) {
                    select.selectValue(prevOption.value);
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                const nextOption = select.options[select.selectedOptionIndex + 1 ];
                if(nextOption) {
                    select.selectValue(nextOption.value);
                }
                break;
            case "Enter":
            case "Escape":
                e.preventDefault();
                select.selectList.classList.remove("show");
                break;
            default:
                clearTimeout(debounceTimout);
                searchTerm += e.key;
                debounceTimout = setTimeout(() => {
                    searchTerm = "";
                }, 300);

                const searchedOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchTerm)
                });
                if(searchedOption) select.selectValue(searchedOption.value);

        }
    })
}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(element => {
        return {
            label: element.label,
            value: element.value,
            selected: element.selected,
            element: element
        }
    })
}
