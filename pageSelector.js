// Create a dropdown to select the number of items per page
export function createPageSizeSelector() {
    const sizeSelect = document.createElement("select");
    sizeSelect.className = "page-size-select";

    const sizes = [10, 20, 50, 100, "all"];
    sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size === "all" ? "All results" : size;
        if (size === 20) option.selected = true;
        sizeSelect.appendChild(option);
    });
    const label = document.createElement('label');
    label.textContent = 'Items per page: ';
    
    const container = document.createElement('div');
    container.className = 'page-size-container';
    container.appendChild(label);
    container.appendChild(sizeSelect);
    
    return { container, sizeSelect }; 
}