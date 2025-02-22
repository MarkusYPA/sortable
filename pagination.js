export let currentPage = 1;

// pagination controls
export function createPaginationControls(totalPages) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";
    // prev button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    // next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    // page indicator
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextButton);

    return { paginationDiv, prevButton, nextButton };
}