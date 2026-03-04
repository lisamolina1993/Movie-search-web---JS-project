const API_KEY = '932ec934';
const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie`;

const moviesWrapper = document.querySelector(".movies__wrapper");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Utility function to simulate loading delay


let moviesData = []; // global variable to store current results for filtering

//The Search function
async function onSearchChange() {
    const searchTerm = document.getElementById("searchInput").value; // The text the user types in the search input
    const moviesWrapper = document.querySelector(".movies__wrapper"); // Where movies will go/results will be rendered
    const loading = document.querySelector(".results__loading"); // The spinner container

    const results = document.querySelector(".results__wrapper");

    if (!searchTerm.trim()) { //trim removes any accidental spaces. If a user hits "space" and then "enter". trim() truns " " into "" which counts as empty
        window.location.reload(); //tells the browse to do do exactly what the "refresh" button does- start the page over from scratch
        return; //This is the "emergency exit". It makes sure that the page doesn't fetch data or show a spinner 
    }

    loading.classList.add("modal__overlay--visible"); // Show the loading spinner
    moviesWrapper.innerHTML = ""; // Clears old movies so the new search starts fresh and doesn't just add on to the old results

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`); 
        const data = await response.json(); //converts the raw data into a JavaScript object that we can work with

        await sleep(2000); // Simulate loading delay

        loading.classList.remove("modal__overlay--visible"); //hides the spinner once the data arrives

        results.classList.add("results__wrapper--visible"); 

        if (data.Response === "True") { // OMBd returns a string "True" if it found movies that match the search term, otherwise it returns "False"
            moviesData = data.Search; //Save the array of 10 movies into the global variable for later use in filtering
            renderMovies(moviesData); // pass the data to the render function to display the movies on the page
        } else {
            moviesWrapper.innerHTML = `<p class="results__error">No movies found for "${searchTerm}". Please try another search.</p>`;
        }
    } catch (error) {
        loading.classList.remove("modal__overlay--visible");
        moviesWrapper.innerHTML = `<p class="results__error">An error occurred while fetching data. Please try again later.</p>`;
    }
}

function renderMovies(movies) { // This function takes the raw data and turns it into HTML
    const moviesWrapper = document.querySelector(".movies__wrapper");
    moviesWrapper.innerHTML = movies.map(movie => { //It loops through all 10 movies and creates a <figure> block for each one
        return `
            <figure class="movie__list">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}" alt="Movie Poster">
                <figcaption class="fig__caption fig__caption--title">${movie.Title}</figcaption>
                <figcaption class="fig__caption">${movie.Year}</figcaption>
            </figure>
        `
    }).join(""); 
}

//Sort Function

function filterMovies(event) {
    const filter = event.target.value; // Get the selected filter value from the dropdown
    
    if (filter === "OLDEST_TO_NEWEST") {
        moviesData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    } else if (filter === "NEWEST_TO_OLDEST") {
        moviesData.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (filter === "TITLE_ASC") {
        moviesData.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (filter === "TITLE_DESC") {
        moviesData.sort((a, b) => b.Title.localeCompare(a.Title));
    }
    
    renderMovies(moviesData); // Re-render the movies with the new sorted order
}

function openMenu() {
    document.body.classList.add("open--menu");
}

function closeMenu() {
    document.body.classList.remove("open--menu");
}


document.getElementById("searchButton").addEventListener("click", onSearchChange) //This is the "attachment". It tells
//the browser: "When the user clicks the ID search button, run the onSearchChange function"
