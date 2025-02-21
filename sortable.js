/* async function fetchSuperheroes() {
    try {
        const response = await fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json(); // response to array
        return data;
    } catch (error) {
        console.error("Error fetching superheroes:", error);
        //return [];
        throw error;
    }
} */

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then(response => response.json())
        //.then(data => heroes(data))
        .then(heroes)
        .catch(error => console.error("Error loading data:", error));
});

function heroes(heroes) {
    // make the table
    const table = document.createElement('table')
    table.id = 'hero-table'
    const columns = ["Icon", "Name", "Full Name", "Powerstats", "Race", "Gender", "Height", "Weight", "Place Of Birth", "Alignement"];

    // table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columns.forEach(title => {
        const th = document.createElement("th");    // header cell (bold and centered)
        th.textContent = title;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // table body
    const tbody = document.createElement("tbody");

    // do the table:
    //fetchSuperheroes().then(heroes => {
        heroes.forEach( hero => {
            //console.log(heroes[0]);
            const row = document.createElement("tr");


            const values = [
                hero.name,
                hero.biography.fullName,
                hero.powerstats,
                hero.appearance.race,
                hero.appearance.gender,
                hero.appearance.height,
                hero.appearance.weight,
                hero.biography.placeOfBirth,
                hero.biography.alignment
            ];

            const icoCell = document.createElement("td")
            const ico = document.createElement("img")
            ico.src = hero.images.xs
            ico.alt = hero.name
            //ico.width = 50;
            //ico.height = 50;
            icoCell.appendChild(ico)
            row.appendChild(icoCell)

            values.forEach(value => {
                const td = document.createElement("td");    // standard data cell
                td.textContent = value;
                row.appendChild(td);
            });
    
            tbody.appendChild(row);
        })

        table.appendChild(tbody);
        document.body.appendChild(table);
    //});
}

//export { heroes }