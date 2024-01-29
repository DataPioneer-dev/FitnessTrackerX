$(document).ready(function ($) {
    "use strict";

    var book_table = new Swiper(".book-table-img-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 3,
            stretch: 2,
            depth: 100,
            modifier: 5,
            slideShadows: false,
        },
        loopAdditionSlides: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var team_slider = new Swiper(".team-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    jQuery(".filters").on("click", function () {
        jQuery("#menu-dish").removeClass("bydefault_show");
    });

    $(function () {
        var filterList = {
            init: function () {
                $("#menu-dish").mixItUp({
                    selectors: {
                        target: ".dish-box-wp",
                        filter: ".filter",
                    },
                    animation: {
                        effects: "fade",
                        easing: "ease-in-out",
                    },
                    load: {
                        filter: ".all, .breakfast, .lunch, .dinner",
                    },
                });
            },
        };
        filterList.init();
    });

    jQuery(".menu-toggle").click(function () {
        jQuery(".main-navigation").toggleClass("toggled");
    });

    jQuery(".header-menu ul li a").click(function () {
        jQuery(".main-navigation").removeClass("toggled");
    });

    gsap.registerPlugin(ScrollTrigger);

    var elementFirst = document.querySelector('.site-header');
    ScrollTrigger.create({
        trigger: "body",
        start: "30px top",
        end: "bottom bottom",

        onEnter: () => myFunction(),
        onLeaveBack: () => myFunction(),
    });

    function myFunction() {
        elementFirst.classList.toggle('sticky_head');
    }

    var scene = $(".js-parallax-scene").get(0);
    var parallaxInstance = new Parallax(scene);
});

jQuery(window).on('load', function () {
    $('body').removeClass('body-fixed');

    //activating tab of filter
    let targets = document.querySelectorAll(".filter");
    let activeTab = 0;
    let old = 0;
    let dur = 0.4;
    let animation;

    for (let i = 0; i < targets.length; i++) {
        targets[i].index = i;
        targets[i].addEventListener("click", moveBar);
    }

    // initial position on first === All 
    gsap.set(".filter-active", {
        x: targets[0].offsetLeft,
        width: targets[0].offsetWidth
    });

    function moveBar() {
        if (this.index != activeTab) {
            if (animation && animation.isActive()) {
                animation.progress(1);
            }
            animation = gsap.timeline({
                defaults: {
                    duration: 0.4
                }
            });
            old = activeTab;
            activeTab = this.index;
            animation.to(".filter-active", {
                x: targets[activeTab].offsetLeft,
                width: targets[activeTab].offsetWidth
            });

            animation.to(targets[old], {
                color: "#0d0d25",
                ease: "none"
            }, 0);
            animation.to(targets[activeTab], {
                color: "#fff",
                ease: "none"
            }, 0);

        }
    }
});

const wrapper_1 = document.querySelector('.wrapper-1');
const btnPopup_1 = document.querySelector('.new-meal');
const iconClose_1 = document.querySelector('.icon-close-1');

btnPopup_1.addEventListener('click', () => {
    wrapper_1.classList.add('active-popup');
});

iconClose_1.addEventListener('click', () => {
    wrapper_1.classList.remove('active-popup');
    resetAddNewMealForm();
});

const wrapper_2 = document.querySelector('.wrapper-2');
const btnPopup_2 = document.querySelector('.default-meal');
const iconClose_2 = document.querySelector('.icon-close-2');

btnPopup_2.addEventListener('click', () => {
    wrapper_2.classList.add('active-popup');
});

iconClose_2.addEventListener('click', () => {
    wrapper_2.classList.remove('active-popup');
    resetDefaultNewMealForm();
});

function addIngredient() {
    // Clone the template node
    const ingredientTemplate = document.querySelector('.ingredient-row');
    const newIngredient = ingredientTemplate.cloneNode(true);

    // Clear input values in the cloned template
    newIngredient.querySelectorAll('input').forEach((input) => {
        input.value = '';
    });

    // Append the cloned template to the container
    document.getElementById('ingredientsContainer').appendChild(newIngredient);

    // Attach event listeners for autocompletion on the new line
    attachAutocompleteIngredientListeners();
    attachCalculCaloriesListeners();
}


document.querySelector(".ingredient-name").onchange = ()=>{
	console.log("hello wolrd inside change")
}


function attachAutocompleteIngredientListeners() {
	console.log("Hello wolrd inside attachAuto")
    const inputBoxes = document.querySelectorAll('.ingredient-name');
    const resultsBoxes = document.querySelectorAll('.result-box');

    const hideResultsBox = (event, index) => {
        // Check if the click is outside the current input box and its result-box
        if (!inputBoxes[index].contains(event.target) && !resultsBoxes[index].contains(event.target)) {
            resultsBoxes[index].innerHTML = '';
            document.removeEventListener('click', hideResultsBox);
        }
    };

    inputBoxes.forEach((inputBox, index) => {
        inputBox.addEventListener('keyup', async () => {
            const input = inputBox.value;

            try {
                const result = await fetchIngredientData(input);
                display(result, index, resultsBoxes[index]);
                if (!result.length) {
                    resultsBoxes[index].innerHTML = '';
                }

                document.addEventListener('click', (event) => hideResultsBox(event, index));
            } catch (error) {
                console.error("An error occurred while fetching ingredient suggestions:", error);
            }
        });
    });
}

function attachCalculCaloriesListeners() {
	    console.log("start")

    const ingredientInputs = document.querySelectorAll('.ingredient-name, .ingredient-quantity');
    ingredientInputs.forEach((input) => {
        input.addEventListener('input', calculateCalories);
    });
    
}

async function fetchRecipeData(input) {
    try {
        const res = await $.ajax({
            url: `https://api.spoonacular.com/recipes/autocomplete?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&number=3&query=${input}`,
        });
        return res.map(item => item.title);
    } catch (error) {
        throw error;
    }
}

async function fetchIngredientData(input) {
    try {
        const res = await $.ajax({
            url: `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&number=3&query=${input}`,
        });

        return res.map(item => item.name);
    } catch (error) {
        throw error;
    }
}

function display(result, index, resultsBox) {
    const content = result.map(list => `<li onclick="selectInput(this, ${index})">${list}</li>`).join("");
    resultsBox.innerHTML = `<ul>${content}</ul>`;
}

function selectInput(list, index) {
    const inputBox = document.querySelectorAll('.ingredient-name')[index];
    inputBox.value = list.innerText;
    document.querySelectorAll('.result-box')[index].innerHTML = '';
}

function removeLastIngredient() {
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const ingredientsRows = ingredientsContainer.getElementsByClassName('ingredient-row');

    if (ingredientsRows.length > 1) {
        const lastIngredient = ingredientsRows[ingredientsRows.length - 1];
        ingredientsContainer.removeChild(lastIngredient);
        updateTotalCalories();
    }
}

function testButton() {
    // Event listener for the filter buttons
    const filterButtons = document.querySelectorAll('.filter');
    const addNewMealButton = document.querySelector('.dish-add-btn.new-meal');
    const chooseFromOurMealsButton = document.querySelector('.dish-add-btn.default-meal');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter;

            // Show or hide buttons based on the filter clicked
            if (filterValue === '.breakfast' || filterValue === '.lunch' || filterValue === '.dinner') {
                addNewMealButton.style.display = 'block';
                chooseFromOurMealsButton.style.display = 'block';
            } else {
                addNewMealButton.style.display = 'none';
                chooseFromOurMealsButton.style.display = 'none';
            }
        });
    });
}

testButton();

document.addEventListener('DOMContentLoaded', () => {
	console.log("load");
    attachAutocompleteRecipesListeners();
    updateTotalCalories();
    attachAutocompleteIngredientListeners();
    attachCalculCaloriesListeners();
    const mealForm = document.getElementById('mealForm');
    mealForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        // Get the selected category (breakfast, lunch, or dinner)
        const selectedCategory = getCurrentState();
        // Create a new card based on the selected category
        createNewCard(selectedCategory);

        // Close the form
        wrapper_1.classList.remove('active-popup');
    });

    const ourMealForm = document.getElementById('DefaultMealForm');
    ourMealForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const mealNameInput = document.getElementById('ourMealName');
        const mealName = mealNameInput.value;

        const totalCaloriesElement = document.querySelector('.total-calories.total-calories-recipe');

        const dataCaloriesValue = totalCaloriesElement.getAttribute('data-calories');

        const selectedCategory = getCurrentState();
        // Fetch details for the chosen recipe
        const recipeDetails = await fetchRecipeDetails(mealName);

        // Create a new custom meal card
        createCustomMealCard(recipeDetails, selectedCategory, dataCaloriesValue);

        wrapper_2.classList.remove('active-popup');
    });
});

async function fetchRecipeDetails(mealName) {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&query=${mealName}&number=1`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        return data.results[0];
    } else {
        throw new Error('Recipe not found');
    }
}

function createCustomMealCard(recipeDetails, category, calories) {
    const menuDish = document.getElementById('menu-dish');
    const customMealCard = document.createElement('div');
    customMealCard.classList.add('col-lg-4', 'col-sm-6', 'dish-box-wp', category);
    customMealCard.setAttribute('data-cat', category);

    customMealCard.innerHTML = `
        <div class="dish-box text-center">
            <div class="dist-img">
                <img src="${recipeDetails.image}" alt="">
            </div>
            <div class="dish-title">
                <h3 class="h3-title meal-title">${recipeDetails.title}</h3>
                <p class="meal-calories">${calories} calories</p>
            </div>
        </div>
    `;

    menuDish.appendChild(customMealCard);

    document.getElementById('ourMealName').value = '';
}

function getCurrentState() {
    const filters = document.querySelectorAll('.menu-tab-wp .filters .filter');

    for (const filter of filters) {
        if (filter.classList.contains('active')) {
            return filter.getAttribute('data-filter').replace('.', ''); // Remove the dot to get the category
        }
    }
}

function createNewCard(category) {
    // Get the values from the form inputs
    const mealName = document.getElementById('MealName').value;
    const ingredientNames = document.querySelectorAll('.ingredient-name');
    const ingredientQuantities = document.querySelectorAll('.ingredient-quantity');
    const caloriesInputs = document.querySelectorAll('.calories');

    // Create a new card element
    const newCard = document.createElement('div');
    newCard.className = `col-lg-4 col-sm-6 dish-box-wp ${category}`;
    newCard.setAttribute('data-cat', category);

    // Populate the new card with the form values
    newCard.innerHTML = `
        <div class="dish-box text-center">
            <div class="dist-img">
                <!-- You can replace the image source with a dynamic value if needed -->
                <img src="assets/images/dish/${category}.png" alt="">
            </div>
            <div class="dish-title">
                <h3 class="h3-title">${mealName}</h3>
                <!-- You can replace the calories with a dynamic value if needed -->
                <p>${calculateTotalCalories()} calories</p>
            </div>
        </div>
    `;

    // Append the new card to the menu-dish container
    document.getElementById('menu-dish').appendChild(newCard);

    // Optionally, you can clear the form inputs after creating the card
    document.getElementById('MealName').value = '';
    ingredientNames.forEach(input => (input.value = ''));
    ingredientQuantities.forEach(input => (input.value = ''));
    caloriesInputs.forEach(input => (input.value = ''));
}

async function fetchCalories(ingredient, quantity) {
    try {
        const res = await $.ajax({
            url: `https://api.spoonacular.com/food/ingredients/search?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&query=${ingredient}`,
        });

        const itemId = res.results[0].id;

        const info = await $.ajax({
            url: `https://api.spoonacular.com/food/ingredients/${itemId}/information?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&amount=1`,
        });

        const calories = (info.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0) * quantity;
        return calories;
    } catch (error) {
        throw error;
    }
}

async function fetchCaloriesRecipe(ingredient) {
    try {
        const res = await $.ajax({
            url: `https://api.spoonacular.com/food/ingredients/search?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&query=${ingredient}`,
        });

        const itemId = res.results[0].id;

        const info = await $.ajax({
            url: `https://api.spoonacular.com/food/ingredients/${itemId}/information?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&amount=1`,
        });

        const calories = (info.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0) * 1; // Assuming quantity is 1
        return calories;
    } catch (error) {
        throw error;
    }
}

function calculateCalories(event) {
    const row = event.target.closest('.ingredient-row');
    console.log(row)
    
    if (!row) {
        return;
    }

    const ingredientInput = row.querySelector('.ingredient-name');
    const quantityInput = row.querySelector('.ingredient-quantity');
    const caloriesInput = row.querySelector('.calories');
    

    const ingredient = ingredientInput.value;
    const quantity = quantityInput.value;
    
    if (ingredient && quantity) {
        fetchCalories(ingredient, quantity)
            .then(calories => {
                caloriesInput.value = calories;
                updateTotalCalories();
            })
            .catch(error => {
                console.error("An error occurred while calculating calories:", error);
            });
    }
}

function calculateTotalCalories() {
    const calorieInputs = document.querySelectorAll('.calories');

    let totalCalories = Array.from(calorieInputs)
        .map(caloriesInput => parseFloat(caloriesInput.value) || 0)
        .reduce((sum, value) => sum + value, 0);
    return totalCalories;
}

function updateTotalCalories() {
    const calorieInputs = document.querySelectorAll('.calories');
    const totalCaloriesElement = document.querySelector('.total-calories');

    let totalCalories = Array.from(calorieInputs)
        .map(caloriesInput => parseFloat(caloriesInput.value) || 0)
        .reduce((sum, value) => sum + value, 0);
    totalCaloriesElement.textContent = `Total Calories: ${totalCalories} cal`;
}

async function fetchTotalCalories(recipeTitle) {
    try {
        const res = await $.ajax({
            url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&query=${recipeTitle}&number=1`,
        });

        if (res.results.length > 0) {
            const recipe = res.results[0];
            const totalCalories = await calculateTotalRecipeCalories(recipe);
            displayTotalCalories(totalCalories);
        } else {
            console.error("Recipe not found.");
        }
    } catch (error) {
        console.error("An error occurred while fetching recipe information:", error);
    }
}

async function calculateTotalRecipeCalories(recipe) {
    return new Promise((resolve, reject) => {
        const id_recipe = recipe.id;
        $.ajax({
            url: `https://api.spoonacular.com/recipes/${id_recipe}/information?apiKey=697c8d2d9a2443e8a2b006ee564e31ce&includeNutrition=true`,
            success: function (res) {
                const servings = res.servings;
                const calories = (res.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0) * servings;
                resolve(calories);
            },
            error: function (xhr, status, error) {
                reject(error);
            },
        });
    });
}

function displayTotalCalories(totalCalories) {
    const totalCaloriesElement = document.querySelector('.total-calories-recipe');
    totalCaloriesElement.textContent = `Total Calories: ${totalCalories} cal`;
}

function attachAutocompleteRecipesListeners() {
	
    const inputBox = document.getElementById('DefaultMealForm:ourMealName');
    const resultsBox = document.querySelector('.result-box-recepe');

    const hideResultsBox = (event) => {
        // Check if the click is outside the current input box and its result-box
        if (!inputBox.contains(event.target) && !resultsBox.contains(event.target)) {
            resultsBox.innerHTML = '';
            document.removeEventListener('click', hideResultsBox);
        }
    };
	
    inputBox.addEventListener('input', async () => {
        const input = inputBox.value;

        try {
            const result = await fetchRecipeData(input);
            displayRecipes(result, resultsBox);
            if (!result.length) {
                resultsBox.innerHTML = '';
            }

            document.addEventListener('click', hideResultsBox);
        } catch (error) {
            console.error("An error occurred while fetching recipe suggestions:", error);
        }
    }); 
}

function displayRecipes(result, resultsBox) {
    const content = result.map(recipe => `<li onclick="selectRecipe('${recipe}')">${recipe}</li>`).join("");
    resultsBox.innerHTML = `<ul>${content}</ul>`;
}

function selectRecipe(recipeTitle) {
    const inputBox = document.getElementById('DefaultMealForm:ourMealName');
    inputBox.value = recipeTitle;
    document.querySelector('.result-box-recepe').innerHTML = '';
    fetchTotalCalories(recipeTitle);
}

function resetAddNewMealForm() {
    const mealForm = document.getElementById('mealForm');
    
    // Reset the form
    mealForm.reset();

    // Additional custom reset logic for specific fields
    const ingredientInputs = document.querySelectorAll('.ingredient-name');
    const quantityInputs = document.querySelectorAll('.ingredient-quantity');
    const caloriesInputs = document.querySelectorAll('.calories');

    ingredientInputs.forEach(input => (input.value = ''));
    quantityInputs.forEach(input => (input.value = ''));
    caloriesInputs.forEach(input => (input.value = ''));

    // Clear the autocomplete results
    const resultBoxes = document.querySelectorAll('.result-box');
    resultBoxes.forEach(box => (box.innerHTML = ''));

    // Clear the total calories display
    const totalCaloriesElement = document.querySelector('.total-calories');
    totalCaloriesElement.textContent = '';
}

function resetDefaultNewMealForm() {
    const DefaultMealForm = document.getElementById('DefaultMealForm');
    
    // Reset the form
    DefaultMealForm.reset();

    // Additional custom reset logic for specific fields
    const ingredientInputs = document.querySelectorAll('.ingredient-name');
    const quantityInputs = document.querySelectorAll('.ingredient-quantity');
    const caloriesInputs = document.querySelectorAll('.calories');

    ingredientInputs.forEach(input => (input.value = ''));
    quantityInputs.forEach(input => (input.value = ''));
    caloriesInputs.forEach(input => (input.value = ''));

    // Clear the autocomplete results
    const resultBoxes = document.querySelectorAll('.result-box-recepe');
    resultBoxes.forEach(box => (box.innerHTML = ''));

    // Clear the total calories display
    const totalCaloriesElement = document.querySelector('.total-calories-recipe');
    totalCaloriesElement.textContent = '';
}
