import { createPageSizeSelector } from "./pageSelector.js";
import { createPaginationControls } from "./pagination.js";
import { sortByColumn, sortHeroes } from "./sorting.js";
import { makeBackground } from "./background.js";

document.addEventListener("DOMContentLoaded", () => {
    currentPage = getPageFromURL();

    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then(response => response.json())
        .then(showHeroes)
        .catch(error => console.error("Error loading data:", error));
});

let currentPage = 1;
let rowsPerPage = 20;

let prevSort = ''
let sortBy = 'nothing'
let ascend = true

let table
let tHead
let tBody

let paginationDiv
let prevButton
let nextButton

let heroes = []
export let heroesFiltered = []

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

        if (Array.isArray(obj[key])) {
            const vals = arrToText(obj[key])
            txt += `${key}: ${vals}`
            console.log(txt)
        } else {
            txt += `${key}: ${obj[key]}`
        }

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

            if (value == hero.name) {
                // Add click event to hero names
                td.addEventListener("click", function () {
                    const slug = hero.slug;
                    window.location.href = `?slug=${slug}`;
                    //window.location.href = `${window.location.pathname}?slug=${slug}`;
                });
            }

            row.appendChild(td)
        });

        tbody.appendChild(row)
    })

    return tbody
}

// Display hero details on hero.html
function displayHeroDetails() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const hero = heroes.find(h => h.slug === slug);

    const newURL = `${window.location.pathname}?slug=${slug}`;
    window.history.replaceState({}, '', newURL);

    if (!hero) {
        document.body.innerHTML = "<h1>Hero not found</h1>";
        return;
    }

    const container = document.createElement('div')
    container.classList.add('hero-container')

    const innercont = document.createElement('div')
    innercont.classList.add('hero-inner')

    // title
    const tit = document.createElement("h1");    // standard data cell
    tit.innerHTML = hero.name;
    innercont.appendChild(tit)

    // image
    const img = document.createElement("img")
    img.src = hero.images.lg
    img.alt = hero.name
    innercont.appendChild(img)

    const values = [
        objToText(hero.powerstats),
        objToText(hero.appearance),
        objToText(hero.biography),
        objToText(hero.work),
        objToText(hero.connections),
    ];

    // values
    values.forEach(value => {
        const para = document.createElement("p");    // standard data cell
        para.innerHTML = value;
        innercont.appendChild(para)
    })

    container.appendChild(innercont)
    document.body.appendChild(container)
}



function makeSearchBar(table, heroes) {
    // searchbar
    const searchbar = document.createElement('input')
    searchbar.type = 'text'
    searchbar.placeholder = 'search by name'

    //error variables
    const errorMessage = document.createElement('div');
    errorMessage.style.width = '100%'
    errorMessage.classList.add('error-message')
    const errorText = document.createElement('p')


    searchbar.addEventListener('input', (event) => {
        const searchTerm = event.target.value;

        currentPage = 1;

        heroesFiltered = heroes.filter((hero) =>
            hero.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (heroesFiltered.length === 0) {
            tBody.remove();
            errorMessage.appendChild(errorText)
            errorText.innerHTML = "Sorry, the hero you were searching for does not exist!";
            errorText.style.color = "red";
            errorText.style.margin = "10px";
        } else if (heroesFiltered.length > 0) {
            errorText.remove();
            sortByColumn(heroesFiltered, prevSort, ascend, sortBy);
            tBody.remove();
            tBody = makeTableBody(heroesFiltered);
            table.appendChild(tBody);
        }


        updatePagination();
    });

    return [searchbar, errorMessage]
}

function updateTable() {
    tBody.remove();
    tBody = makeTableBody(heroesFiltered);
    table.appendChild(tBody);

    const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
    currentPage = Math.min(currentPage, totalPages); // Ensure current page is valid
    updatePagination();
}
// Update the URL with the current page number
function updateURL(pageNumber) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber);
    window.history.pushState({}, '', url);
}
// Get the current page number from the URL
function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page'));
    if (isNaN(page) || page < 1) {
        page = 1;
        updateURL(page);
    }
    return (page);
}

function updatePagination() {
    const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    paginationDiv.querySelector('span').textContent =
        rowsPerPage === heroesFiltered.length
            ? 'Showing all results'
            : `Page ${currentPage} of ${totalPages}`;

    updateURL(currentPage);
}

function addListeners() {
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
        const totalPages = Math.ceil(heroesFiltered.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            tBody.remove();
            tBody = makeTableBody(heroesFiltered);
            table.appendChild(tBody);
            updatePagination();
        }
    });

    // Listener for sorting
    tHead.addEventListener('click', (event) => {
        prevSort = sortBy
        sortBy = event.target.closest('th').dataset.col
        ascend = sortHeroes(event, heroesFiltered, sortBy, prevSort, ascend)
        tBody.remove()
        tBody = makeTableBody(heroesFiltered)
        table.appendChild(tBody);
        updatePagination();
    })


}

function showHeroes(rawHeroes) {
    heroes = rawHeroes

    // replace any null values with '' so sorting works
    nullsToEmpty(heroes)
    sortByColumn(heroes) // default sorting
    makeBackground()

    if (window.location.search.includes("slug")) {
        displayHeroDetails();
    } else {


        // make the table
        table = document.createElement('table')
        table.id = 'hero-table'

        heroesFiltered = heroes
        const [searchbar, errorMessage] = makeSearchBar(table, heroes)


        // table header
        tHead = makeTableHead()
        table.appendChild(tHead);

        // table body
        tBody = makeTableBody(heroesFiltered)
        table.appendChild(tBody);

        // Create container for table and pagination
        const container = document.createElement('div');
        container.className = 'table-container';

        /*         const titleBanner1 = document.createElement('h1')
                titleBanner1.classList.add('title')
                titleBanner1.innerHTML = "SUPER"
                titleBanner1.style.fontSize = '234px'
                titleBanner1.style.letterSpacing = "10px";
                const titleBanner2 = document.createElement('h1')
                titleBanner2.classList.add('title')
                titleBanner2.innerHTML = "HEROES"
                titleBanner2.style.fontSize = '190px'
                titleBanner2.style.letterSpacing = "10px"; */



        // Create a div to hold the letters
        const titleDiv1 = document.createElement("div");
        titleDiv1.classList.add("title-container"); // Add a class for styling

        // Create individual span elements for each letter
        "SUPER".split("").forEach(letter => {
            const h1 = document.createElement("h1");
            h1.textContent = letter;
            h1.classList.add('title')
            h1.style.fontSize = '300px'
            titleDiv1.appendChild(h1);
        });

        const titleDiv2 = document.createElement("div");
        titleDiv2.classList.add("title-container"); // Add a class for styling

        // Create individual span elements for each letter
        "HEROES".split("").forEach(letter => {
            const h1 = document.createElement("h1");
            h1.textContent = letter;
            h1.classList.add('title')
            h1.style.fontSize = '270px'
            titleDiv2.appendChild(h1);
        });

        container.appendChild(titleDiv1)
        container.appendChild(titleDiv2)



        /*         container.appendChild(titleBanner1)
                container.appendChild(titleBanner2) */

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
        [paginationDiv, prevButton, nextButton] = createPaginationControls(totalPages);
        container.appendChild(paginationDiv);


        // Add event listener for page size selector
        sizeSelect.addEventListener('change', (event) => {
            const newSize = event.target.value;
            rowsPerPage = newSize === 'all' ? heroesFiltered.length : parseInt(newSize);
            currentPage = 1; // Reset to first page        
            updateTable();
        });

        addListeners()
        updatePagination();

        document.body.appendChild(container);
    }
}
