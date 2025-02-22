import { createPageSizeSelector } from "./pageSelector.js";
import { createPaginationControls } from "./pagination.js";
import { sortByColumn, sortHeroes } from "./sorting.js";
import { makeBackground } from "./background.js";

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then(response => response.json())
        .then(heroes)
        .catch(error => console.error("Error loading data:", error));
});

let currentPage = 1;
let rowsPerPage = 20;

let prevSort = ''
let sortBy = 'nothing'
let ascend = true

// Null values don't work in many sorting functions, so turn them to ''
function nullsToEmpty(heroes) {
    heroes.forEach(hero => replaceNullsWithEmptyString(hero));

    // "Dagger" height is set to her birth place
    heroes[135].appearance.height = ["-", "0 cm"]

    function replaceNullsWithEmptyString(heroObj) {
        for (const key in heroObj) {
            if (heroObj.hasOwnProperty(key)) {
                const value = heroObj[key];

                if (value === null) {
                    heroObj[key] = "";
                } else if (typeof value === 'object' && value !== null) {
                    replaceNullsWithEmptyString(value);
                }
            }
        }
    }
}

function makeTableHead() {
    const tHead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const columns = [
        "Icon",
        "Name",
        "Full Name",
        "Powerstats",
        "Race",
        "Gender",
        "Height",
        "Weight",
        "Place Of Birth",
        "Alignement"
    ];
    columns.forEach(title => {
        const th = document.createElement("th");    // header cell (bold and centered)
        th.textContent = title;
        th.dataset.col = title.toLowerCase().replaceAll(' ', '');   // for click event
        headerRow.appendChild(th);
    });
    tHead.appendChild(headerRow);

    return tHead
}

function objToText(obj) {
    let txt = ''
    for (let i = 0; i < Object.keys(obj).length; i++) {
        const key = Object.keys(obj)[i]
        txt += `${key}: ${obj[key]}`
        if (i != Object.keys(obj).length - 1) txt += '<br>'
    }
    return txt;
}

function arrToText(arr) {
    let txt = ''
    for (let i = 0; i < arr.length; i++) {
        txt += arr[i]
        if (i != arr.length.length - 1) txt += '<br>'
    }
    return txt;
}

function makeTableBody(heroes) {
    const tbody = document.createElement("tbody");
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedHeroes = heroes.slice(startIndex, endIndex)

    paginatedHeroes.forEach(hero => {
        const row = document.createElement("tr");

        const values = [
            hero.name,
            hero.biography.fullName,
            objToText(hero.powerstats),
            hero.appearance.race,
            hero.appearance.gender,
            arrToText(hero.appearance.height),
            arrToText(hero.appearance.weight),
            hero.biography.placeOfBirth,
            hero.biography.alignment
        ];

        // icon
        const icoCell = document.createElement("td")
        const ico = document.createElement("img")
        ico.src = hero.images.xs
        ico.alt = hero.name
        icoCell.appendChild(ico)
        row.appendChild(icoCell)

        // other values
        values.forEach(value => {
            const td = document.createElement("td");    // standard data cell
            td.innerHTML = value;
            row.appendChild(td)
        });

        tbody.appendChild(row)
    })

    return tbody
}


function heroes(heroes) {
    // replace any null values with '' so sorting works
    nullsToEmpty(heroes)
    sortByColumn(heroes) // default sorting
    makeBackground()

    let heroesFiltered = heroes

    // searchbar
    const searchbar = document.createElement('input')
    searchbar.type = 'text'
    searchbar.placeholder = 'search by name'

    //error variables
    const errorMessage = document.createElement('div');
    errorMessage.style.width = '100%'

    searchbar.addEventListener('input', (event) => {
        const searchTerm = event.target.value;

        heroesFiltered = heroes.filter((hero) =>
            hero.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (heroesFiltered.length === 0) {
            tBody.remove();
            errorMessage.innerHTML = "Sorry, the hero you were searching for does not exist!";
            errorMessage.style.color = "red";
            showedOnce = true;
        } else if (heroesFiltered.length > 0) {
            errorMessage.innerHTML = "";
            sortByColumn(heroesFiltered, prevSort, ascend, false, sortBy);
            tBody.remove();
            tBody = makeTableBody(heroesFiltered);
            table.appendChild(tBody);
        }

        updatePagination();
    });

    // make the table
    const table = document.createElement('table')
    table.id = 'hero-table'

    // table header
    const tHead = makeTableHead()
    table.appendChild(tHead);

    // table body
    let tBody = makeTableBody(heroesFiltered)
    table.appendChild(tBody);

    // Create container for table and pagination
    const container = document.createElement('div');
    container.className = 'table-container';

    const titleBanner1 = document.createElement('h1')
    titleBanner1.classList.add('title')
    titleBanner1.innerHTML = "S U P E R"
    titleBanner1.style.fontSize = '246px'
    const titleBanner2 = document.createElement('h1')
    titleBanner2.classList.add('title')
    titleBanner2.innerHTML = "H E R O E S"
    titleBanner2.style.fontSize = '200px'

    container.appendChild(titleBanner1)
    container.appendChild(titleBanner2)

    // Add page size selector 
    const { container: sizeContainer, sizeSelect } = createPageSizeSelector();
    const searchAndPages = document.createElement('div')
    searchAndPages.id = "search-and-pages"
    searchAndPages.appendChild(searchbar)
    searchAndPages.appendChild(sizeContainer);

    container.appendChild(searchAndPages);
    container.appendChild(errorMessage);
    container.appendChild(table);

    // calculate total pages and add pagination controls 
    const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
    const { paginationDiv, prevButton, nextButton } = createPaginationControls(totalPages);
    container.appendChild(paginationDiv);

    function updateTable() {
        tBody.remove();
        tBody = makeTableBody(heroesFiltered);
        table.appendChild(tBody);

        const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
        currentPage = Math.min(currentPage, totalPages); // Ensure current page is valid
        updatePagination();
    }

    // Add event listener for page size selector
    sizeSelect.addEventListener('change', (event) => {
        const newSize = event.target.value;
        rowsPerPage = newSize === 'all' ? heroes.length : parseInt(newSize);
        currentPage = 1; // Reset to first page
        updateTable();
    });

    // Add event listeners for pagination
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            tBody.remove();
            tBody = makeTableBody(heroesFiltered);
            table.appendChild(tBody);
            updatePagination();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            tBody.remove();
            tBody = makeTableBody(heroesFiltered);
            table.appendChild(tBody);
            updatePagination();
        }
    });

    function updatePagination() {
        const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        paginationDiv.querySelector('span').textContent =
            rowsPerPage === heroesFiltered.length
                ? 'Showing all results'
                : `Page ${currentPage} of ${totalPages}`;
    }

    tHead.addEventListener('click', (event) => {
        prevSort = sortBy
        sortBy = event.target.closest('th').dataset.col
        ascend = sortHeroes(event, heroesFiltered, sortBy, prevSort, ascend)
        tBody.remove()
        tBody = makeTableBody(heroesFiltered)
        table.appendChild(tBody);
        updatePagination();
    })
    document.body.appendChild(container);
}
