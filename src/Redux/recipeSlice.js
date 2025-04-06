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
    selectRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
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
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { saveRecipe, selectRecipe, toggleSidebar, toggleDarkMode } = recipeSlice.actions;
export default recipeSlice.reducer;

