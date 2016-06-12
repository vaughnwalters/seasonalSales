var productsRequest = new XMLHttpRequest();
var categoriesRequest = new XMLHttpRequest();
var categoriesArray;
var productsArray;
var winter = null;
var autumn = null;
var spring = null;
// var percentageDiscount = null;

function loadCategoriesPage () {
  var categoriesObject = JSON.parse(event.target.responseText);
  categoriesArray = categoriesObject.categories;
  for (var i=0; i<categoriesArray.length; i++) {
    var category = categoriesArray[i];
    //add categories to selectDiv
    selector.innerHTML += 
    `<option id="season${i}" value="${categoriesArray[i].season_discount}">
    ${categoriesArray[i].season_discount}</option>`
  };
  winter = document.getElementById("season0");
  autumn = document.getElementById("season1");
  spring = document.getElementById("season2");

  // console.log("selector.innerHTML", selector.innerHTML);
  // get, send, load products.json and execute function
  // after categories pages loads, open and send request for products page
  productsRequest.open("GET", "products.json");
  productsRequest.send();
};


// execute when category page loads
function loadProductPage () {
  var productsObject = JSON.parse(event.target.responseText);
  productsArray = productsObject.products;
  for (var i=0; i < productsArray.length; i++) {
    var product=productsArray[i];
    // this goes into the product object and gets the key value of category_id
    // and subtracts 1 from it to get the array index number of categoriesArray
    // and apply that number to currentCategory
    // then can go into currentCategory and with dot notation,
    // get the name of the category (furniture, clothes, etc)
    var categoryIndex = product.category_id - 1;
    var currentCategory = categoriesArray[categoryIndex];

    contentEl.innerHTML +=
      `<div class="productsList">
        <div class="product">${product.name}</div>
        <div class="category">${currentCategory.name}</div>
        <div class="price" id="price--${i}">${product.price}</div>
      </div>`
  };
};

// need to find which items are on sale in each season, apply the discount,
// and repopulate the dom with those specific items
function chooseSeason () {
  selectedSeason = event.target.value;
  for (var k=0; k<categoriesArray.length; k++) {
    if (selectedSeason === `${categoriesArray[k].season_discount}`) {
      console.log("and the current season is...", `${categoriesArray[k].season_discount}`);
      percentageDiscount = (1-`${categoriesArray[k].discount}`)
      idOfCategory = `${categoriesArray[k].id}`
      // call applyDiscountfunction and pass on two variables to the arguments
      applyDiscount(percentageDiscount, idOfCategory);
    };
  };
};



function applyDiscount (percentageDiscount, idOfCategory) {
  for (var j=0; j<productsArray.length; j++) {
    var product = productsArray[j];
    idOfCategory = Number(idOfCategory);
    if (product.category_id === idOfCategory) {
      // console.log("productPrice", product.price);
      product.price = product.price * percentageDiscount;
      // console.log("productPrice", product.price);
      product.price = product.price.toFixed(2);
      // console.log("productPrice", product.price);
      var salePrice = product.price;
      // console.log("salePrice", salePrice);
      addDiscountPriceToDOM(salePrice);
    };
  };
};

function addDiscountPriceToDOM (salePrice) {
  console.log("salePrice", salePrice);
  var oldPrice = document.getElementsByClassName("price");
  // console.log("oldPrice", oldPrice)
  // for (var t = 0; t<oldPrice.length; t++) {
    // console.log("yo");
  // };
};


// open and send request are initiated w/in the loadCategoriesPage function, but 
// the load request is sent outside the function
productsRequest.addEventListener("load", loadProductPage);

//get, send, load categories.json and execute function
categoriesRequest.open("GET", "categories.json");
categoriesRequest.send();
categoriesRequest.addEventListener("load", loadCategoriesPage);

selector.addEventListener("change", chooseSeason); 
