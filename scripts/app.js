"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

/* page */

const page = {
    menu: document.querySelector(".menu__list"),
    header: {
        h1: document.querySelector(".h1"),
        progressPercent: document.querySelector(".progress__percent"),
        progressCoverBar: document.querySelector(".progress__cover-bar"),
    },
    content: {
        daysContainer: document.getElementById("days"),
        nextDay: document.querySelector(".habbit__day"),
    },
};

/* utils */

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* rendering */

function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(
            `[menu-habbit-id="${habbit.id}"]`
        );
        if (!existed) {
            const element = document.createElement("button");
            element.setAttribute("menu-habbit-id", habbit.id);
            element.classList.add("menu__item");
            element.addEventListener("click", () => rerender(habbit.id));
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;

            if (activeHabbit.id === habbit.id) {
                element.classList.add("menu__item_active");
            }
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add("menu__item_active");
        } else {
            existed.classList.remove("menu__item_active");
        }
    }
}

function rerenderHead(activeHabbit) {
    const done = activeHabbit.days.length;
    const target = activeHabbit.target || 1;

    const progress = Math.min(100, Math.round((done / target) * 100));

    page.header.h1.textContent = activeHabbit.name;
    page.header.progressCoverBar.style.width = `${progress}%`;
    page.header.progressPercent.textContent = `${progress}%`;
}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = "";

    activeHabbit.days.forEach((day, index) => {
        const element = document.createElement("div");
        element.classList.add("habbit");

        element.innerHTML = `
        <div class="habbit__day">День ${index + 1}</div>
        <div class="habbit__comment">${day.comment ?? ""}</div>
        <button class="habbit__delete" type="button" data-index="${index}">
            <img src="./images/delete.svg" alt="Удалить день ${index + 1}" />
        </button>
    `;

        page.content.daysContainer.appendChild(element);
    });

    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    if (!activeHabbit) return;

    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

console.log("menu element:", page.menu);

/* init */
(() => {
    loadData();
    if (habbits.length) rerender(habbits[0].id);
})();
