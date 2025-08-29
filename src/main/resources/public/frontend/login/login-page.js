/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
const loginInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
loginButton.addEventListener("click", processLogin);


/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    // TODO: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty

    // TODO: Create a requestBody object with username and password
    const username = loginInput.value.trim();
    const password = passwordInput.value.trim();
    if(!username || !password){
        alert(`Fields cannot be empty`);
        return;
    }
    
    const requestBody = {username, password};
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };

    try {
        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions

        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
        // - Store both in sessionStorage using sessionStorage.setItem()

        // TODO: Optionally show the logout button if applicable

        // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page

        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"

        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"
        const response = await fetch(`${BASE_URL}/login`, requestOptions);
        if(response.status === 401){
            alert("Incorrect login!");
            return;
        }
        if(!response.ok){
            alert(`Error logging in: (status: ${response.status})`);
            return;
        }
        
        const text = await response.text();
        const string = text.split(" ");
        const token = string[0];
        const isAdmin = string[1];

        sessionStorage.setItem("auth-token", token);
        sessionStorage.setItem("is-admin", isAdmin);

        logoutButton.style.display = "block";

        setTimeout(() => {
            window.location.href = "../recipe/recipe-page.html";
        }, 500);

    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        alert(`Network error`);
        console.error(`Network error ${error}`);
    }
}

