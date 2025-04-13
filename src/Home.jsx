import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { saveRecipe, toggleSidebar, loadRecipesFromStorage, newChat, clearRecipes } from "./Redux/recipeSlice";
import { fetchRecipes } from "./Redux/recipeThunk";
import SkeletonLoading from "./SkeletonLoading";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Home = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { selectedRecipe, loading, sidebarOpen } = useSelector(state => state.recipes);

  
  const handleSearch = () => {
    if (query.trim()) {
      localStorage.setItem("lastQuery", query.trim());
      localStorage.removeItem("selectedRecipes"); //Clear saved selection
      dispatch(fetchRecipes(query.trim()));
    }
  };
  
  useEffect(() => {
    const lastQuery = localStorage.getItem("lastQuery");
    const storedRecipes = localStorage.getItem("filteredRecipes");
  
    if (storedRecipes) {
      dispatch(loadRecipesFromStorage());
    } else if (lastQuery) {
      dispatch(fetchRecipes(lastQuery.trim().toLowerCase()));
    }
  }, []);  
  
  const handleSave = () => {
    if (selectedRecipe) {
      dispatch(saveRecipe(selectedRecipe));
    }
    localStorage.setItem("selectedRecipeId", selectedRecipe.id)
  };

  const cleanQuery = (text) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g,
      ''
    ).trim();
  };


  const handleSuggestionClick = (text) => {
    const cleaned = cleanQuery(text);
    setQuery(cleaned);
    dispatch(fetchRecipes(cleaned));
  };
  
  return (
    <div className="flex h-screen dark:bg-gray-700 dark:text-white">
      {/* Overlay on mobile when sidebar is open */}
      {sidebarOpen && <div onClick={() => dispatch(toggleSidebar())} className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden" />}
        <Sidebar />

      {/*Navbar*/}
      <div className="flex-1 flex flex-col">
        <Navbar setQuery={setQuery} />

  <div className="flex-1 overflow-y-auto scrollbar-hide">
    {/*Content*/}
    {loading && (
      <SkeletonLoading />
    )}

{selectedRecipe ? (
  <div className="bg-white dark:bg-gray-700 rounded shadow p-4 flex-col items-center">
    <h1 className="text-xl font-bold mb-2">{selectedRecipe.title}</h1>
    
    {selectedRecipe.imageUrl && ( 
      <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} className="w-full rounded-lg max-w-lg mb-2 mt-4" /> )}

    {selectedRecipe.ingredients && (
      <div className="mb-4">
        {/* Source */}
        <div className="mt-2 mb-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
          ${selectedRecipe.source === "OpenAI" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800" }`}>Source: {selectedRecipe.source}</span>
          </div>

        <button onClick={handleSave} className="bg-green-600 text-white px-4 mb-2 rounded">Save</button>

        <h2 className="font-bold text-xl mt-2 mb-1">Ingredients</h2>
        <pre className="whitespace-pre-wrap">{selectedRecipe.ingredients}</pre>
        </div> )}

    {selectedRecipe.description && (
      <div>
        {selectedRecipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
          <div>
            <h2 className="font-bold text-xl mb-1">Instructions</h2>
            <ol className="list-decimal pl-5 space-y-1">
              {selectedRecipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>{step.step}</li>))}
            </ol>
          </div> )
             : 
           ( <div>
            <h2 className="font-bold text-xl mb-1">Instructions</h2>
            <pre className="whitespace-pre-wrap">
              {selectedRecipe.description}</pre>
          </div>)}
      </div>)}
  </div> )
     : !loading ?
   ( <div className="mt-36 flex flex-col items-center">
    <h2 className="text-xl font-semibold text-center mb-6 text-white">
      What do you want to eat today?</h2>

  <div className="flex flex-wrap justify-center gap-3 px-7">
    {["Pizza 🍕", "Biryani 🍲", "Pasta 🍝", "Salad 🥗", "Noodles 🍜", "Burger 🍔"].map((item) => (
      <button key={item} onClick={() => handleSuggestionClick(item)}
        className="dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-500 text-gray-300 px-4 py-2 rounded-xl transition">{item}</button>))}
        </div>
      </div>) : null}
    </div>

    <div className="flex px-2 sticky bottom-0">
      <input type="text" placeholder="Search recipe..." value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-3 rounded-l-2xl w-full dark:bg-gray-800 border-gray-400 focus:outline-none mb-1" />

      <button onClick={handleSearch} className="dark:bg-gray-800 border dark:border-gray-400 p-3 rounded-r-xl mb-1">
        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}</button>
    </div>
    </div>
    </div> )};

export default Home;
