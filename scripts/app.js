"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

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
    popup: {
        cover: document.getElementById("add-habbit-popup"),
        iconField: document.querySelector(".popup__form input[name='icon']"),
    },
};

page.content.daysContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".habbit__delete");
    if (!btn) return;

    const index = Number(btn.dataset.index);
    if (Number.isNaN(index)) return;

    deleteDay(index);
});

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

function togglePopup() {
    if (page.popup.cover.classList.contains("cover_hidden")) {
        page.popup.cover.classList.remove("cover_hidden");
    } else {
        page.popup.cover.classList.add("cover_hidden");
    }
}

/* form */

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = "";
    }
}

function validateAndGetFormData(form, fields) {
    const res = {};
    let isValid = true;

    for (const field of fields) {
        const input = form.elements[field];

        if (!input) {
            console.error(
                `Field "${field}" not found in this form. Check name="${field}"`
            );
            console.log("Form:", form);
            console.log(
                "Form elements:",
                [...form.elements].map((el) => el.name)
            );
            return;
        }

        const value = input.value?.trim();
        input.classList.remove("error");

        if (!value) {
            input.classList.add("error");
            isValid = false;
        }

        res[field] = value;
    }

    if (!isValid) return;
    return res;
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

    const progress =
        activeHabbit.days.length / activeHabbit.target > 1
            ? 100
            : (activeHabbit.days.length / activeHabbit.target) * 100;

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

    page.content.nextDay.textContent = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    if (!activeHabbit) return;

    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

/* work with days */

function addDays(event) {
    event.preventDefault();

    const data = validateAndGetFormData(event.target, ["comment"]);

    if (!data) return;

    habbits = habbits.map((habbit) => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment: data.comment }]),
            };
        }

        return habbit;
    });

    resetForm(event.target, ["comment"]);
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(index) {
    habbits = habbits.map((habbit) => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days,
            };
        }
        return habbit;
    });
    rerender(globalActiveHabbitId);
    saveData();
}

/* working with habbits */

function setIcon(context, icon) {
    page.popup.iconField.value = icon;

    const activeIcon = document.querySelector(".icon.icon_active");
    if (activeIcon) activeIcon.classList.remove("icon_active");

    context.classList.add("icon_active");
}

function addHabbit(event) {
    event.preventDefault();

    const data = validateAndGetFormData(event.target, [
        "name",
        "icon",
        "target",
    ]);

    if (!data) return;

    const maxId = habbits.reduce(
        (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
        0
    );

    habbits.push({
        id: maxId + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: [],
    });
    resetForm(event.target, ["name", "target"]);
    togglePopup();
    saveData();
    rerender(maxId + 1);
}

/* init */
(() => {
    loadData();
    const hashId = Number(document.location.hash.replace("#", ""));
    const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
    if (urlHabbit) {
        rerender(urlHabbit.id);
    } else {
        rerender(habbits[0].id);
    }
})();
