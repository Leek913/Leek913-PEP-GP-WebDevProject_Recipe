/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
document.addEventListener("DOMContentLoaded", getIngredients);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const ingredient = addIngredientNameInput.value.trim();
    if(!ingredient){
        alert("Ingredient cannot be empty");
        return; 
    }

    try {
        const response = await fetch("/ingredients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ name : ingredient })
        });
        if(response.ok){
            addIngredientNameInput.value = "";
            await getIngredients();
            refreshIngredientList();
        } else {
            throw new Error(`Failed to add ingredient (status: ${response.status})`);
        }
    } catch (error) {
        alert(`Error adding ingredient: ${error}`);
    }

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try{
        const response = await fetch("/ingredients", {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
        })

        if(response.ok){
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            throw new Error(`Failed to fetch ingredients (status: ${response.status})`)
        }
         
    } catch(error){
        alert(`Failure requesting ingredients: ${error}`);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const ingredient = deleteIngredientNameInput.value.trim();
    if(!ingredient){
        alert("Ingredient cannot be empty");
        return;
    }

    const index = ingredients.findIndex(X => X.name === ingredient);

    if (index === -1) {
        alert("Ingredient not found");
        return;
    }
    const id = ingredients[index].id;

    try{
        const response = await fetch(`/ingredients/${id}`,{
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
        })

        if(response.ok){
            await getIngredients();
            refreshIngredientList();
            deleteIngredientNameInput.value = "";
        } else {
            throw new Error(`Failed to delete ingredients (status: ${response.status})`)
        }
    } catch(error){
        alert(`Failure deleting request: ${error}`);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    while(ingredientListContainer.firstChild){
        ingredientListContainer.removeChild(ingredientListContainer.firstChild)
    }

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.append(p);
        ingredientListContainer.appendChild(li);
    })
}
