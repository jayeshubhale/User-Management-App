// Get references to HTML elements
const userList = document.getElementById("userList");
const userDetails = document.getElementById("userDetails");
const sortSelect = document.getElementById("sortSelect");

// Global variable for pagination
const itemsPerPage = 10; // Number of users displayed per page
let currentPage = 1; // Current page number

// Global variable for sorting
let currentSortAttribute = "name"; // Default sorting attribute

let users = []; // Array to store user data

//  Function to fetch random user data from the API
async function fetchRandomUsers() {
    try {
        const response = await fetch("https://randomuser.me/api/?results=100");
        const data = await response.json();
        users = data.results;  
        displayUsers();
    } catch (error) {
        console.error("Error fetching random users:", error);
    }
}

// Function to display a list of users for the current page
function displayUsers() {
    userList.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToDisplay = users.slice(startIndex, endIndex);

    usersToDisplay.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `${user.name.first} ${user.name.last}`;
        li.addEventListener("click", () => displayUserDetails(user));
        userList.appendChild(li);
    });

    updatePagination(); // Update pagination controls
}

// Event listeners for the "Next" and "Previous" buttons
document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
        changePage(1);
    }
});
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        changePage(-1);
    }
});

// Event listener for the sorting select element
sortSelect.addEventListener("change", () => {
    currentSortAttribute = sortSelect.value;
    sortUsers(currentSortAttribute);
    currentPage = 1; // Reset current page when changing sorting
    displayUsers();
});

// Function to sort the users array based on the  sorting option
function sortUsers(attribute) {
    users.sort((a, b) => {
        if (attribute === "name") {
            return (a.name.first + " " + a.name.last).localeCompare(b.name.first + " " + b.name.last);
        } else if (attribute === "size") {
             return (a.name.first + " " + a.name.last).length - (b.name.first + " " + b.name.last).length;
        } else {
            return 0; 
        }
    });
}

// Function to update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = `<span>Page ${currentPage} of ${totalPages}</span>`;

    if (totalPages > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.id = "prevPage";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => changePage(-1));

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.id = "nextPage";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => changePage(1));

        paginationElement.appendChild(prevButton);
        paginationElement.appendChild(nextButton);
    }
}

// Function to change the current page and show the next 10 records
function changePage(delta) {
    currentPage += delta;

    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const usersToDisplay = users.slice(startIndex, endIndex);
    displayUsers(usersToDisplay);
}

// Function to display user details in a popup
function displayUserDetails(user) {
    userDetails.innerHTML = `
        <h2>${user.name.first} ${user.name.last}</h2>
        <img src="${user.picture.large}" alt="User" class="user-photo">
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Location: ${user.location.city}, ${user.location.state}</p>
    `;

    // Show the user details popup
    const userDetailsPopup = document.getElementById('userDetailsPopup');
    userDetailsPopup.style.display = 'block';

    // Add a close button to the user details popup
    const closeDetails = document.getElementById('closeDetails');
    closeDetails.addEventListener('click', () => {
        userDetailsPopup.style.display = 'none'; // Close the popup
    });
}

// Event listener for the search input field
const searchQuery = document.getElementById('searchInput');

searchQuery.addEventListener('input', function () {
    const query = searchQuery.value;
    if (query === '') {
        fetchRandomUsers(); // Reset the user list if the search input is empty
    } else {
        const filterUsers = users.filter((user) => {
            return user.name.first.toLowerCase().includes(query.toLowerCase());
        });
        users = filterUsers;
    }
    currentPage = 1; 
    displayUsers();
});


fetchRandomUsers();  
