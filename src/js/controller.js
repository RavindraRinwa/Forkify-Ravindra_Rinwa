import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import SearchView from './view/searchView.js';
import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async await
import resultsView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';

// import icons from '../img/icons.svg'; //Parcel 1
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    //1) Loading recipe asynce function return promise
    await model.loadRecipe(id);

    //2) Rendering recipe
    // console.log(model.state.recipe);
    // console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load search results
    await model.loadSearchResults(query);
    //3)Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4) render the intial pagination button
    paginationView.render(model.state.search);
    // paginationView.addHandlerClick('df');
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  //1)Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));
  //2) render the intial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
//Publisher and Suscriber pattern
const controlAddBookmark = function () {
  //1) Add/remove bookmark
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  //update the recipe view
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //Render bookmarks
    bookmarkView.render(model.state.bookmarks);
    //Success message
    addRecipeView.renderMessage();
    //Change Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //3 argument state , title ,url
    // window.history.back();

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😁😁', err);
    addRecipeView.renderError(err);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
