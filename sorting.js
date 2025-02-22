// sum of power stats
function allPwr(powerstats) {
    let sum = 0
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
    switch (align) {
        case 'good':
            return -1
        case 'neutral':
            return 0
        case 'bad':
            return 1
        default:
            return 10
    }
}

function sortByColumn(heroes, prevSort, ascend, sortBy = '') {

    switch (sortBy) {
        case 'icon':
            if (prevSort != 'icon' || ascend) {
                heroes.sort((a, b) => a.images.xs.localeCompare(b.images.xs))
                ascend = false
            } else {
                heroes.sort((a, b) => b.images.xs.localeCompare(a.images.xs))
                ascend = true
            }
            // sort again so undefined are last
            heroes.sort((a, b) => (a.images.xs.includes('no-portrait') ? 1 : b.images.xs.includes('no-portrait') ? -1 : 0));
            break
        case 'name':
            if (prevSort != 'name' || ascend) {
                heroes.sort((a, b) => a.name.localeCompare(b.name))
                ascend = false
            } else {
                heroes.sort((a, b) => b.name.localeCompare(a.name))
                ascend = true
            }
            heroes.sort((a, b) => (a.name == '' ? 1 : b.name == '' ? -1 : 0));
            break
        case 'fullname':
            if (prevSort != 'fullname' || ascend) {
                heroes.sort((a, b) => a.biography.fullName.localeCompare(b.biography.fullName))
                ascend = false
            } else {
                heroes.sort((a, b) => b.biography.fullName.localeCompare(a.biography.fullName))
                ascend = true
            }

            heroes.sort((a, b) => (a.biography.fullName == '' ? 1 : b.biography.fullName == '' ? -1 : 0));
            break
        case 'powerstats':
            if (prevSort != 'powerstats' || ascend) {
                heroes.sort((a, b) => allPwr(a.powerstats) - allPwr(b.powerstats))
                ascend = false
            } else {
                heroes.sort((a, b) => allPwr(b.powerstats) - allPwr(a.powerstats))
                ascend = true
            }
            // no empties here
            break
        case 'race':
            if (prevSort != 'race' || ascend) {
                heroes.sort((a, b) => a.appearance.race.localeCompare(b.appearance.race))
                ascend = false
            } else {
                heroes.sort((a, b) => b.appearance.race.localeCompare(a.appearance.race))
                ascend = true
            }
            heroes.sort((a, b) => (a.appearance.race == '' ? 1 : b.appearance.race == '' ? -1 : 0));
            break
        case 'gender':
            if (prevSort != 'gender' || ascend) {
                heroes.sort((a, b) => a.appearance.gender.localeCompare(b.appearance.gender))
                ascend = false
            } else {
                heroes.sort((a, b) => b.appearance.gender.localeCompare(a.appearance.gender))
                ascend = true
            }
            heroes.sort((a, b) => (a.appearance.gender == '-' ? 1 : b.appearance.gender == '-' ? -1 : 0));
            break
        case 'height':
            if (prevSort != 'height' || ascend) {
                heroes.sort((a, b) => cmToNum(a.appearance.height[1]) - cmToNum(b.appearance.height[1]))
                ascend = false
            } else {
                heroes.sort((a, b) => cmToNum(b.appearance.height[1]) - cmToNum(a.appearance.height[1]))
                ascend = true
            }
            heroes.sort((a, b) => (cmToNum(a.appearance.height[1]) <= 0 ? 1 : cmToNum(b.appearance.height[1]) <= 0 ? -1 : 0));
            break
        case 'weight':
            if (prevSort != 'weight' || ascend) {
                heroes.sort((a, b) => kgToNum(a.appearance.weight[1]) - kgToNum(b.appearance.weight[1]))
                ascend = false
            } else {
                heroes.sort((a, b) => kgToNum(b.appearance.weight[1]) - kgToNum(a.appearance.weight[1]))
                ascend = true
            }
            heroes.sort((a, b) => (kgToNum(a.appearance.weight[1]) <= 0 ? 1 : kgToNum(b.appearance.weight[1]) <= 0 ? -1 : 0));
            break
        case 'placeofbirth':
            if (prevSort != 'placeofbirth' || ascend) {
                heroes.sort((a, b) => a.biography.placeOfBirth.localeCompare(b.biography.placeOfBirth))
                ascend = false
            } else {
                heroes.sort((a, b) => b.biography.placeOfBirth.localeCompare(a.biography.placeOfBirth))
                ascend = true
            }
            heroes.sort((a, b) => (a.biography.placeOfBirth == '-' ? 1 : b.biography.placeOfBirth == '-' ? -1 : 0));
            break
        case 'alignement':
            if (prevSort != 'alignement' || ascend) {
                heroes.sort((a, b) => aligToNum(a.biography.alignment) - aligToNum(b.biography.alignment))
                ascend = false
            } else {
                heroes.sort((a, b) => aligToNum(b.biography.alignment) - aligToNum(a.biography.alignment))
                ascend = true
            }
            heroes.sort((a, b) => (a.biography.alignment == '-' ? 1 : b.biography.alignment == '-' ? -1 : 0));
            break
        default:
            if (ascend) {
                heroes.sort((a, b) => a.name.localeCompare(b.name))
                ascend = false
            } else {
                heroes.sort((a, b) => (a.name == '' ? 1 : b.name == '' ? -1 : 0))
                ascend = true
            }
    }
    return ascend
}


function sortHeroes(event, heroes, sortBy, prevSort, ascend) {
    const headCell = event.target.closest('th'); // Clicked header
    if (!headCell) return; // Not a header cell
    sortBy = headCell.dataset.col
    ascend = sortByColumn(heroes, prevSort, ascend, sortBy)

    return ascend
}

export { sortHeroes, sortByColumn }