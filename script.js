// it makes a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

let arr = JSON.parse(localStorage.getItem("favouritesList"));

async function getMealsDetailsFromAPI(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  console.log(value);
  return meals;
}

function startFetchingFromAPI() {
  let inputValue = document.getElementById("search_input").value;
  // console.log(inputValue);
  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  let meals = getMealsDetailsFromAPI(url, inputValue);

  showMealsDetails(meals);
}

function showMealsDetails(meals) {
  let html = "";
  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          html += `
          <div class="meal_card">
          <img
            src="${element.strMealThumb}"
            alt=""
            class="meal_image"
          />
          <h3 class="meal_title">${element.strMeal}</h3>
          
          <button class="btn btn-outline-light active add_to_favoutires" onclick="addRemoveToFavList(${element.idMeal})">
            <i class="fa-solid fa-heart fa"></i>
          </button>
          <button class="get_recipe" id=${element.strMeal} onclick="showMealFullDetails(${element.idMeal})">Get Recipe!!</button>
        </div>
          
          `;
        } else {
          html += `
              <div class="meal_card">
              <img
                src="${element.strMealThumb}"
                alt=""
                class="meal_image"
              />
              <h3 class="meal_title">${element.strMeal}</h3>
              
              <button class="btn btn-outline-light add_to_favoutires" onclick="addRemoveToFavList(${element.idMeal})">
                <i class="fa-solid fa-heart fa"></i>
              </button>
              <button class="get_recipe" id=${element.strMeal} onclick="showMealFullDetails(${element.idMeal})">Get Recipe!!</button>
            </div>
              
              `;
        }

        document.getElementById("search_results_container").innerHTML = html;
      });
    } else {
      html += `
              
              <h3 class="meal_ot_foud">Meal ot found</h3>
              
            
              
              `;
    }
    document.getElementById("search_results_container").innerHTML = html;
  });
}
function showMealFullDetails(id) {
  // console.log(id);

  const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

  let item = getMealsDetailsFromAPI(url, id);
  display(item);
}

function display(item) {
  let html = "";
  item.then((data) => {
    html += `
        
        <div id="fulldt">
        
        <div id="bsdt">
        <div id="itemImage">
        <img
        src="${data.meals[0].strMealThumb}"
        alt=""
        class="meal_image"
      />
        </div>
        <div id="bsdthead">
        <h2>${data.meals[0].strMeal}</h2>
            <h4>Category : ${data.meals[0].strCategory}</h4>
            <h4>Area : ${data.meals[0].strArea}</h4>
        </div>
        </div>
          
          <div id="ins">

          <p>
          ${data.meals[0].strInstructions}
          </p>
          <button class="btn btn-success btn-round-2"><a href="${data.meals[0].strYoutube}" target="_blank">Watch Recipe</a></button>
          </div>
        </div>
              
              `;
    document.getElementById("search_results_container").innerHTML = html;
  });
}
function clearDisplay() {
  // document.getElementById("details_on_top").innerHTML = "";
  startFetchingFromAPI();
}
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
    html += `
          <div class="page-wrap d-flex flex-row align-items-center">
              <div class="container">
                  <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                          <span class="display-1 d-block">404</span>
                          <div class="mb-4 lead">
                              No meal added in your favourites list.
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await getMealsDetailsFromAPI(url, arr[index]).then((data) => {
        html += `
        <div id="card" class="card mb-3" style="width: 20rem;">
        <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${data.meals[0].strMeal}</h5>
            <div class="d-flex justify-content-between mt-5">
                <button type="button" id="details-btn" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart" style="color: #ff0000;"></i></button>
            </div>
        </div>
    </div>


              `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html;
}
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = false;
  for (let index = 0; index < arr.length; index++) {
    if (id == arr[index]) {
      contain = true;
    }
  }
  if (contain) {
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("Meal removed from favourites list");
  } else {
    arr.push(id);
    alert("Meal added to favourites list");
  }
  localStorage.setItem("favouritesList", JSON.stringify(arr));
  // showMealsDetails();
  showFavMealList();
}
