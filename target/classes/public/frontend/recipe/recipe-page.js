/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button")
    const recipeList = document.getElementById("recipe-list");

    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitInput = document.getElementById("add-recipe-submit-input");

    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitInput = document.getElementById("update-recipe-submit-input");

    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitInput = document.getElementById("delete-recipe-submit-input");


    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if(sessionStorage.getItem("auth-token")){
        logoutButton.style.display = "block";
    } else {
        logoutButton.style.display = "none";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if(sessionStorage.getItem("is-admin") === "true"){
        adminLink.style.display = "block";
    } else {
        adminLink.style.display = "none";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitInput.addEventListener("click", addRecipe);
    updateRecipeSubmitInput.addEventListener("click", updateRecipe);
    deleteRecipeSubmitInput.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    document.addEventListener("DOMContentLoaded", getRecipes);
    // getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const input = searchInput.value.trim();
        if(!input){
            alert("Recipe cannot be empty");
            return;
        }

        const recipe = recipes.find(X => X.name === input);
        if(!recipe){ return; }

        try{
            const response = await fetch(`/recipes/${recipe.id}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
            });
            if(!response.ok){
                throw new Error(`Failed to fetch recipe (status: ${response.status})`)
            }

            recipes = await response.json();
            refreshRecipeList();
        } catch(error) {
            alert(`Error fetching recipes: ${error}`);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const input = addRecipeNameInput.value.trim();
        const instructionsInput = addRecipeInstructionsInput.value.trim();
        if(!input || !instructionsInput){
            alert("Values cannot be empty");
            return;
        }

        try{
            const response = await fetch("/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ name : input, instruction : instructionsInput })
            })

            if(!response.ok){
                throw new Error(`Failed to add recipe (status: ${response.status})`);
            }

            addRecipeNameInput.value = "";
            addRecipeInstructionsInput.value = "";
            await getRecipes();
            refreshRecipeList();
        } catch(error) {
            alert(`Error adding recipe: ${error}`);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const input = updateRecipeNameInput.value.trim();
        const instructionsInput = updateRecipeInstructionsInput.value.trim();

        if(!input || !instructionsInput){
            alert("Values cannot be empty");
            return;
        }

        const recipe = recipes.find(X => X.name === input);
        if(!recipe){ return; }

        try {
            const response = await fetch(`recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                                        name : input, 
                                        instructions : instructionsInput, 
                                        author : recipe.author, 
                                        ingredients : recipe.ingredients 
                })
            })
            
            if(!response.ok){
                throw new Error(`Failed to update recipe (status: ${response.status})`);
            }

            updateRecipeNameInput.value = "";
            updateRecipeInstructionsInput.value = "";
            await getRecipes();
            refreshRecipeList();
        } catch(error) {
            alert(`Error updating recipe ${error}`);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const input = deleteRecipeNameInput.value.trim();
        if(!input){
            alert("Recipe cannot be empty");
            return;
        }

        const recipe = recipes.find(X => X.name === input);
        if(!recipe){ return; }

        try{
            const response = await fetch(`recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ name : input, instructions : instructionsInput, author : recipe.author, ingredients : recipe.ingredients })
            })

            if(!response.ok){
                throw new Error(`Failed to delete recipe (status: ${response.status})`)
            }

            refreshRecipeList();
        } catch(error) {
             alert(`Error deleting recipe: ${error}`)
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try{
            const response = await fetch(`/recipes`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
            })

            if(!response.ok){
                throw new Error(`Failed to fetch recipes (status: ${response.status})`)
            }

            recipes = await response.json();
            refreshRecipeList();
        } catch(error){
                    alert(`Failure requesting recipes: ${error}`);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        while(recipeList.firstChild){
            recipeList.removeChild(recipeList.firstChild);
        }

        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent= recipe.name + recipe.instructions;
            recipeList.appendChild(li);
        })
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try{
            const response = await fetch(`/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
            })

            if(!response.ok){
                alert(`Failure to logout: ${response.status}`);
                return;
            }

            sessionStorage.clear();
            window.location.href = "../login/login-page.html";
        } catch(error) {
            alert(`Failure to logout ${error}`);
        }
    }
});
