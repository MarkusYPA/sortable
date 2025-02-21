
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

function nullsToEmpty(heroes) {
    heroes.forEach(hero => replaceNullsWithEmptyString(hero));

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

function makeTableBody(heroes) {
    const tbody = document.createElement("tbody");

    heroes.forEach(hero => {
        const row = document.createElement("tr");

        const values1 = [
            hero.name,
            hero.biography.fullName,
        ];

        const values2 = [
            hero.appearance.race,
            hero.appearance.gender,
            hero.appearance.height,
            hero.appearance.weight,
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

        // name, full name
        values1.forEach(value => {
            const td = document.createElement("td");    // standard data cell
            td.innerHTML = value;
            row.appendChild(td)
        });

        // power stats
        const pwrStats = document.createElement("td")
        let powerTxt = ''
        const pwrObj = hero.powerstats
        for (let i = 0; i < Object.keys(pwrObj).length; i++) {
            const key = Object.keys(pwrObj)[i]
            powerTxt += `${key}: ${pwrObj[key]}`
            if (i != Object.keys(pwrObj).length - 1) powerTxt += '<br>'
        }
        pwrStats.innerHTML = powerTxt;  // innerHTML so line breaks work
        row.appendChild(pwrStats)

        // race, gender, height, weigth, place of birth, alignement
        values2.forEach(value => {
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

function sortByColumn(heroes, column = '') {
    switch (column) {
        case 'icon':
            icoAsc ?
                heroes.sort((a, b) => a.images.xs.localeCompare(b.images.xs)) :
                heroes.sort((a, b) => b.images.xs.localeCompare(a.images.xs))
            icoAsc = !icoAsc
            break
        case 'name':
            nameAsc ?
                heroes.sort((a, b) => a.name.localeCompare(b.name)) :
                heroes.sort((a, b) => b.name.localeCompare(a.name))
            nameAsc = !nameAsc
            break
        case 'fullname':
            fullNameAsc ?
                heroes.sort((a, b) => a.biography.fullName.localeCompare(b.biography.fullName)) :
                heroes.sort((a, b) => b.biography.fullName.localeCompare(a.biography.fullName))
            fullNameAsc = !fullNameAsc
            break
        case 'powerstats':
            pwrAsc ?
                heroes.sort((a, b) => allPwr(a.powerstats) - allPwr(b.powerstats)) :
                heroes.sort((a, b) => allPwr(b.powerstats) - allPwr(a.powerstats))
            pwrAsc = !pwrAsc
            break
        case 'race':
            console.log(heroes[0].appearance.race)
            raceAsc ?
                heroes.sort((a, b) => a.appearance.race.localeCompare(b.appearance.race)) :
                heroes.sort((a, b) => b.appearance.race.localeCompare(a.appearance.race))
            raceAsc = !raceAsc
            break
        case 'gender':
            genderAsc ?
                heroes.sort((a, b) => a.appearance.gender.localeCompare(b.appearance.gender)) :
                heroes.sort((a, b) => b.appearance.gender.localeCompare(a.appearance.gender))
            genderAsc = !genderAsc
            break
        case 'height':
            // TODO: convert to comparable
            heightAsc ?
                heroes.sort((a, b) => a.appearance.height - b.appearance.height) :
                heroes.sort((a, b) => b.appearance.height - a.appearance.height)
            heightAsc = !heightAsc
            break
        case 'weight':
            // TODO: convert to comparable
            weightAsc ?
                heroes.sort((a, b) => a.appearance.weight - b.appearance.weight) :
                heroes.sort((a, b) => b.appearance.weight - a.appearance.weight)
            weightAsc = !weightAsc
            break
        case 'placeofbirth':
            pobAsc ?
                heroes.sort((a, b) => a.biography.placeOfBirth.localeCompare(b.biography.placeOfBirth)) :
                heroes.sort((a, b) => b.biography.placeOfBirth.localeCompare(a.biography.placeOfBirth))
            pobAsc = !pobAsc
            break
        case 'alignement':
            aligAsc ?
                heroes.sort((a, b) => a.biography.alignment.localeCompare(b.biography.alignment)) :
                heroes.sort((a, b) => b.biography.alignment.localeCompare(a.biography.alignment))
            aligAsc = !aligAsc
            break
        default:
            heroes.sort((a, b) => a.name.localeCompare(b.name))
    }

    // TODO: move missing values last, every time
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
    sortByColumn(heroes)


    tHead.addEventListener('click', (event) => {
        sortHeroes(event, heroes)
        tBody.innerHTML = ''; // Clear the table body
        tBody = makeTableBody(heroes)
        table.appendChild(tBody);
    })

    // rough example of search box behavior
    /* searchbox.addEventListener('keypress', (event) => {
        const searchfor = 'lasjd' // get input from searchbox
        heroes.filter((hero) => hero.name.toLowerCase.includes(searchfor.toLowerCase))
        tBody.innerHTML = '';
        tBody = makeTableBody(heroes)
        table.appendChild(tBody);
    }) */
}
