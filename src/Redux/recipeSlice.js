import { createSlice } from "@reduxjs/toolkit";
import { fetchRecipes } from "./recipeThunk";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

const initialState = {
  recipes: [],
  saved: loadFromLocalStorage("savedRecipes") || [],
  loading: false,
  error: null,
  selectedRecipe: null,
  sidebarOpen: false,
  darkMode: loadFromLocalStorage("darkMode") || false,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    saveRecipe: (state, action) => {
      state.saved.push(action.payload);
      saveToLocalStorage("savedRecipes", state.saved);
    },

    loadFromStorage: (state, action) => {
      state.recipes = action.payload;
      state.selectedRecipe = action.payload[0] || null;
    },

    clearRecipes: (state) => {
      state.recipes = [];
      state.selectedRecipe = null;
    },  

    deleteSavedRecipe: (state, action) => {
      const idToDelete = action.payload;
      state.saved = state.saved.filter(recipe => recipe.id !== idToDelete);

      if (state.selectedRecipe?.id === idToDelete) {
        state.selectedRecipe = null;
      }
      saveToLocalStorage("savedRecipes", state.saved); // persist update
    },

    selectRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    
      // If it's a saved recipe, save its ID in localStorage
      if (action.payload && state.saved.find(recipe => recipe.id === action.payload.id)) {
        saveToLocalStorage("selectedSavedRecipeId", action.payload.id);
      } else {
        localStorage.removeItem("selectedSavedRecipeId");
      }
    },    

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      saveToLocalStorage("darkMode", state.darkMode);
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.selectedRecipe = action.payload[0];
        saveToLocalStorage("cachedRecipes", action.payload);
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { saveRecipe, selectRecipe, toggleSidebar, toggleDarkMode, deleteSavedRecipe, loadFromStorage, clearRecipes } = recipeSlice.actions; 
export default recipeSlice.reducer;