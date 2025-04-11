import { createSlice } from "@reduxjs/toolkit";
import { fetchRecipes } from "./recipeThunk";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";


const cachedRecipes = loadFromLocalStorage("cachedRecipes") || [];
const selectedId = localStorage.getItem("selectedRecipeId");

const initialState = {
  recipes: cachedRecipes,
  saved: loadFromLocalStorage("savedRecipes") || [],
  loading: false,
  error: null,
  selectedRecipe: cachedRecipes.find(r => r.id === Number(selectedId)) || null,
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

    loadRecipesFromStorage: (state) => {
      const local = loadFromLocalStorage("filteredRecipes") || [];
      state.recipes = local;
    
      const selectedId = localStorage.getItem("selectedRecipeId");
      const selected = local.find((r) => r.id === Number(selectedId));
      state.selectedRecipe = selected || local[0] || null;
    },    

    deleteSavedRecipe: (state, action) => {
      const idToDelete = action.payload;
    
      //Remove from saved list
      state.saved = state.saved.filter(recipe => recipe.id !== idToDelete);
      saveToLocalStorage("savedRecipes", state.saved);
    
      //Add to deleted IDs
      const deleted = loadFromLocalStorage("deletedRecipeIds") || [];
      if (!deleted.includes(idToDelete)) {
        deleted.push(idToDelete);
        saveToLocalStorage("deletedRecipeIds", deleted);
      }
    
      //Remove from cached
      const cached = loadFromLocalStorage("cachedRecipes") || [];
      const updatedCached = cached.filter(recipe => recipe.id !== idToDelete);
      saveToLocalStorage("cachedRecipes", updatedCached);
      saveToLocalStorage("filteredRecipes", updatedCached);
    
      //Deselect if needed
      if (state.selectedRecipe?.id === idToDelete) {
        state.selectedRecipe = null;
        localStorage.removeItem("selectedRecipeId");
      }
    },    

    selectRecipe: (state, action) => {
      state.selectedRecipe = action.payload;

      if (action.payload?.id) {
        localStorage.setItem("selectedRecipeId", action.payload.id);
      } else {
        localStorage.removeItem("selectedRecipeId");
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

      }).addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
      
        const savedIds = new Set(state.saved.map(r => r.id));
        const deletedIds = new Set(loadFromLocalStorage("deletedRecipeIds") || []);
      
        const filtered = action.payload.filter(
          recipe => !savedIds.has(recipe.id) && !deletedIds.has(recipe.id)
        );
      
        state.recipes = filtered;
      
        saveToLocalStorage("cachedRecipes", filtered);
        saveToLocalStorage("fullRecipes", action.payload);
        saveToLocalStorage("filteredRecipes", filtered);
      
        const selectedId = localStorage.getItem("selectedRecipeId");
        const selected = filtered.find(r => r.id === Number(selectedId));
        state.selectedRecipe = selected || filtered[0] || null;

      }).addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const {
  saveRecipe,
  selectRecipe,
  toggleSidebar,
  toggleDarkMode,
  deleteSavedRecipe,
  loadRecipesFromStorage
} = recipeSlice.actions;

export default recipeSlice.reducer;
