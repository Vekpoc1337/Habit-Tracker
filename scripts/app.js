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

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    if (!activeHabbit) return;

    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
}

console.log("menu element:", page.menu);

/* init */
(() => {
    loadData();
    if (habbits.length) rerender(habbits[0].id);
})();
