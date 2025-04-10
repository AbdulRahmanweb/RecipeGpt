import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSun, FaMoon, FaSpinner, FaTrash, FaSearch } from "react-icons/fa";
import {
  saveRecipe,
  selectRecipe,
  toggleSidebar,
  toggleDarkMode,
  deleteSavedRecipe,
  loadFromStorage
} from "./Redux/recipeSlice";

import { fetchRecipes } from "./Redux/recipeThunk";

const Home = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const {
    selectedRecipe,
    saved,
    loading,
    sidebarOpen,
    darkMode,
    recipes
  } = useSelector(state => state.recipes);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  
  const handleSearch = () => {
    if (query.trim()) {
      localStorage.setItem("lastQuery", query.trim());
      localStorage.removeItem("cachedRecipes"); // Clear previous cache
      localStorage.removeItem("selectedSavedRecipeId"); // Clear saved selection
      dispatch(fetchRecipes(query.trim()));
    }
  };
  

  
  
  useEffect(() => {
    const selectedSavedId = localStorage.getItem("selectedSavedRecipeId");
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
  
    //If a saved recipe was selected, restore that first
    if (selectedSavedId) {
      const selected = savedRecipes.find(r => r.id === selectedSavedId);
      if (selected) {
        dispatch({ type: "recipes/selectRecipe", payload: selected });
        return; // ⛔ skip loading search results
      }
    }
  
    //lse load last searched results
    const lastQuery = localStorage.getItem("lastQuery");
    const storedRecipes = localStorage.getItem("cachedRecipes");
  
    if (storedRecipes) {
      const parsed = JSON.parse(storedRecipes);
      dispatch({
        type: "recipes/fetchRecipes/fulfilled", // trigger success manually
        payload: parsed,
      });
    } else if (lastQuery) {
      dispatch(fetchRecipes(lastQuery.trim().toLowerCase()));
    }
  }, []);    
  
  

  const handleSave = () => {
    if (selectedRecipe) {
      dispatch(saveRecipe(selectedRecipe));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteSavedRecipe(id));

    if (selectedRecipe && selectedRecipe.id === id) {
      dispatch(selectRecipe(null));
    }
  };

  const cleanQuery = (text) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g,
      ''
    ).trim();
  };

  const handleSuggestionClick = (text) => {
    const cleaned = cleanQuery(text);
    setQuery(cleaned); // for UI
    dispatch(fetchRecipes(cleaned));
  };
  
  

  return (
    <div className="flex h-screen dark:bg-gray-800 dark:text-white">
      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 z-20 h-full overflow-y-auto scrollbar-hide bg-gray-100 dark:bg-gray-950 md:w-72 w-64 placeholder: p-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <h2 className="text-lg font-semibold mb-4">Saved Recipes</h2>
        {saved.map((item, id) => (
          <div key={id} onClick={() => dispatch(selectRecipe(item))} className="cursor-pointer text-black dark:text-white dark:hover:bg-gray-700 mb-2 p-1">
            {item.title}
            <button className="text-red-500 hover:text-red-700 ml-2" 
            onClick={(e) => {e.stopPropagation()
             handleDelete(item.id)}}> <FaTrash /></button>
          </div>
        ))}
      </div>
      {/* Overlay on mobile when sidebar is open */}
      {sidebarOpen && <div onClick={() => dispatch(toggleSidebar())} className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden" />}

      {/*Navbar*/}
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 dark:bg-gray-700 border-b-2 border-gray-500 flex items-center justify-between mb-4 px-4 py-2">
    <button onClick={() => dispatch(toggleSidebar())} className="md:hidden bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-lg px-2 py-1 rounded">
      ☰
    </button>
    <h1 className="font-semibold text-lg">RecipeGPT</h1>
    <button onClick={() => dispatch(toggleDarkMode())} className="bg-gray-500 text-white p-2 rounded">
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  </div>

  <div className="flex-1 overflow-y-auto scrollbar-hide">
    {/*Content*/}
    {loading && loading && (
  <div className="animate-pulse space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
    <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Title */}
    <div className="h-60 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded" /> {/* Image */}

    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Ingredients */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Instructions */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Instructions */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
)}

{selectedRecipe ? (
  <div className="bg-white dark:bg-gray-700 rounded shadow p-4 flex-col items-center">
    <h1 className="text-xl font-bold mb-2">{selectedRecipe.title}</h1>
    
    {selectedRecipe.imageUrl && (
      <img
        src={selectedRecipe.imageUrl}
        alt={selectedRecipe.title}
        className="w-full rounded-lg max-w-lg mb-2 mt-4"
      />
    )}

    {selectedRecipe.ingredients && (
      <div className="mb-4">
        {/* Source */}
        <div className="mt-2 mb-2">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium 
            ${
              selectedRecipe.source === "OpenAI"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            Source: {selectedRecipe.source}
          </span>
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 mb-2 rounded"
        >
          Save
        </button>

        <h2 className="font-semibold text-lg mb-1">🧂 Ingredients</h2>
        <pre className="whitespace-pre-wrap">{selectedRecipe.ingredients}</pre>
      </div>
    )}

    {selectedRecipe.description && (
      <div>
        {selectedRecipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
          <div>
            <h2 className="font-semibold text-lg mb-1">Instructions</h2>
            <ol className="list-decimal pl-5 text-gray-100 space-y-1">
              {selectedRecipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-lg mb-1">Instructions</h2>
            <pre className="whitespace-pre-wrap">
              {selectedRecipe.description}
            </pre>
          </div>
        )}
      </div>
    )}
  </div>
) : (

  <div className="mt-36 flex flex-col items-center">
  <h2 className="text-xl font-semibold text-center mb-6 text-white">
    What do you want to eat today?
  </h2>
  <div className="flex flex-wrap justify-center gap-3 px-7">
    {["Pizza 🍕", "Biryani 🍲", "Pasta 🍝", "Salad 🥗", "Noodles 🍜", "Burger 🍔"].map((item) => (
      <button
        key={item}
        onClick={() => handleSuggestionClick(item)}
        className="bg-gray-700 hover:bg-gray-600 border border-gray-500 text-gray-300 px-4 py-2 rounded-xl transition"
      >
        {item}
      </button>
    ))}
  </div>
  
</div>
)}

  </div>
    <div className="flex px-2 sticky bottom-0">
      <input
        type="text"
        placeholder="Search recipe..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-3 rounded-l-2xl w-full dark:bg-gray-800 dark:border-gray-400 focus:outline-none mb-1"
      />
      <button onClick={handleSearch} className="dark:bg-gray-800 text-white border dark:border-gray-400 p-3 rounded-r-xl mb-1">
        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
      </button>
    </div>

      </div>
    </div>
  );
};

export default Home;
