import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';
import recipeView from './view/recipeView.js';
import resultView from './view/resultView.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // console.log(recipe);
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); //now url upload both recipe which contain key or not
    // console.log(data);
    // let data = data.data.recipe;
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

//Search
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //Reset the page to 1 for new search
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = state.search.resultsPerPage * (page - 1); // 0 10 not include last index
  const end = state.search.resultsPerPage * page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // console.log(newServings);
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(ing => {
    if (ing.quantity)
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  //Remove from bookmark array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as Not
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        console.log(ingArr);
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients fromat ! Please use correct format:)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
