
document.addEventListener("DOMContentLoaded", () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then(response => response.json())
        .then(heroes)
        .catch(error => console.error("Error loading data:", error));
});

let icoAsc = true
let nameAsc = true
let fullNameAsc = true
let pwrAsc = true
let raceAsc = true
let genderAsc = true
let heightAsc = true
let weightAsc = true
let pobAsc = true
let aligAsc = true

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

    heroes.forEach(hero => {
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

// sum of power stats
function allPwr(powerstats) {
    let sum = 0
    console.log(powerstats)
    for (let val of Object.values(powerstats)) {
        sum += val
    }
    return sum
}

function cmToNum(str) {
    if (str == undefined) return -1
    let value = Number(str.match(/\d+/)[0])

    // The enormous are measured in meters 
    if (str.slice(-2) != 'cm') value *= 100

    return value
}

function kgToNum(str) {
    if (str == undefined) return -1
    let value = Number(str.match(/\d+/)[0])

    // The enormous are measured in tons 
    if (str.slice(-2) != 'kg') value *= 1000

    return value
}

function aligToNum(align) {
    switch(align){
        case'good':
            return -1
        case'neutral':
            return 0
        case 'bad':
            return 1
        default:
            return 10
    }
}

function sortByColumn(heroes, column = '') {
    switch (column) {
        case 'icon':
            // sort ascending or descending
            icoAsc ?
                heroes.sort((a, b) => a.images.xs.localeCompare(b.images.xs)) :
                heroes.sort((a, b) => b.images.xs.localeCompare(a.images.xs))
            // sort again so undefined are last
            heroes.sort((a, b) => (a.images.xs.includes('no-portrait') ? 1 : b.images.xs.includes('no-portrait') ? -1 : 0));
            icoAsc = !icoAsc
            break
        case 'name':
            nameAsc ?
                heroes.sort((a, b) => a.name.localeCompare(b.name)) :
                heroes.sort((a, b) => b.name.localeCompare(a.name))
            heroes.sort((a, b) => (a.name == '' ? 1 : b.name == '' ? -1 : 0));
            nameAsc = !nameAsc
            break
        case 'fullname':
            fullNameAsc ?
                heroes.sort((a, b) => a.biography.fullName.localeCompare(b.biography.fullName)) :
                heroes.sort((a, b) => b.biography.fullName.localeCompare(a.biography.fullName))
            heroes.sort((a, b) => (a.biography.fullName == '' ? 1 : b.biography.fullName == '' ? -1 : 0));
            fullNameAsc = !fullNameAsc
            break
        case 'powerstats':
            pwrAsc ?
                heroes.sort((a, b) => allPwr(a.powerstats) - allPwr(b.powerstats)) :
                heroes.sort((a, b) => allPwr(b.powerstats) - allPwr(a.powerstats))
            // Probably no empties here
            pwrAsc = !pwrAsc
            break
        case 'race':
            raceAsc ?
                heroes.sort((a, b) => a.appearance.race.localeCompare(b.appearance.race)) :
                heroes.sort((a, b) => b.appearance.race.localeCompare(a.appearance.race))
            heroes.sort((a, b) => (a.appearance.race == '' ? 1 : b.appearance.race == '' ? -1 : 0));
            raceAsc = !raceAsc
            break
        case 'gender':
            genderAsc ?
                heroes.sort((a, b) => a.appearance.gender.localeCompare(b.appearance.gender)) :
                heroes.sort((a, b) => b.appearance.gender.localeCompare(a.appearance.gender))
            heroes.sort((a, b) => (a.appearance.gender == '-' ? 1 : b.appearance.gender == '-' ? -1 : 0));
            genderAsc = !genderAsc
            break
        case 'height':
            heightAsc ?
                heroes.sort((a, b) => cmToNum(a.appearance.height[1]) - cmToNum(b.appearance.height[1])) :
                heroes.sort((a, b) => cmToNum(b.appearance.height[1]) - cmToNum(a.appearance.height[1]))
            heroes.sort((a, b) => (cmToNum(a.appearance.height[1]) <= 0 ? 1 : cmToNum(b.appearance.height[1]) <= 0 ? -1 : 0));
            heightAsc = !heightAsc
            break
        case 'weight':
            weightAsc ?
                heroes.sort((a, b) => kgToNum(a.appearance.weight[1]) - kgToNum(b.appearance.weight[1])) :
                heroes.sort((a, b) => kgToNum(b.appearance.weight[1]) - kgToNum(a.appearance.weight[1]))
            heroes.sort((a, b) => (kgToNum(a.appearance.weight[1]) <= 0 ? 1 : kgToNum(b.appearance.weight[1]) <= 0 ? -1 : 0));
            weightAsc = !weightAsc
            break
        case 'placeofbirth':
            pobAsc ?
                heroes.sort((a, b) => a.biography.placeOfBirth.localeCompare(b.biography.placeOfBirth)) :
                heroes.sort((a, b) => b.biography.placeOfBirth.localeCompare(a.biography.placeOfBirth))
            heroes.sort((a, b) => (a.biography.placeOfBirth == '-' ? 1 : b.biography.placeOfBirth == '-' ? -1 : 0));
            pobAsc = !pobAsc
            break
        case 'alignement':
            aligAsc ?
                heroes.sort((a, b) => aligToNum(a.biography.alignment) - aligToNum(b.biography.alignment)) :
                heroes.sort((a, b) => aligToNum(b.biography.alignment) - aligToNum(a.biography.alignment))
            heroes.sort((a, b) => (a.biography.alignment == '-' ? 1 : b.biography.alignment == '-' ? -1 : 0));
            aligAsc = !aligAsc
            break
        default:
            heroes.sort((a, b) => a.name.localeCompare(b.name))
            heroes.sort((a, b) => (a.name == '' ? 1 : b.name == '' ? -1 : 0));
    }
}


function sortHeroes(event, heroes) {
    const headCell = event.target.closest('th'); // Clicked header
    if (!headCell) return; // Not a header cell
    const column = headCell.dataset.col
    sortByColumn(heroes, column)
}


function heroes(heroes) {
    // replace any null values with '' so sorting works
    nullsToEmpty(heroes)
    sortByColumn(heroes) // default sorting

    /*     for (let hero of heroes) {
            if (hero.images.xs.includes('no-portrait')) {
                console.log(hero.name, hero.images.xs)
            }
        } */

    // make the table
    const table = document.createElement('table')
    table.id = 'hero-table'

    // table header
    const tHead = makeTableHead()
    table.appendChild(tHead);

    // table body
    let tBody = makeTableBody(heroes)
    table.appendChild(tBody);

    document.body.appendChild(table);

    // TODO: dropdown (<select> input) to select size of table
    // TODO: search box


    tHead.addEventListener('click', (event) => {
        sortHeroes(event, heroes)
        tBody.remove()
        tBody = makeTableBody(heroes)
        table.appendChild(tBody);
    })

    // rough example of search box behavior
    /* searchbox.addEventListener('keypress', (event) => {
        const searchfor = 'lasjd' // get input from searchbox
        heroes.filter((hero) => hero.name.toLowerCase.includes(searchfor.toLowerCase))
        tBody.remove()
        tBody = makeTableBody(heroes)
        table.appendChild(tBody)
    }) */
}
