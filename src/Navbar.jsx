import { useEffect } from "react";
import { FaMoon, FaPlusCircle, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, toggleDarkMode, clearRecipes, newChat } from "./Redux/recipeSlice";

const Navbar = ({setQuery}) => {
  const dispatch = useDispatch();
  const { selectedRecipe, darkMode}  = useSelector((state) => state.recipes);

  useEffect(() => {
	  document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);
	
	//Handling new chat
	const handleNewChat = () => {
    dispatch(clearRecipes());
    dispatch(newChat());
	setQuery("");
  localStorage.removeItem("selectedRecipe");
  };

  return (
      <div className="sticky top-0 dark:bg-gray-700 border-b-2 border-gray-500 flex items-center justify-between mb-4 px-4 py-2">
		<div className="flex gap-1 items-center">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden bg-gray-300 dark:bg-gray-700 text-xl px-2 py-1 rounded">
          ☰ </button>
		<h1 className="font-semibold text-lg">RecipeGPT</h1>
		</div>

        <div className="flex">
          {selectedRecipe && (
            <button
              onClick={handleNewChat}
              className="bg-gray-300 text-xl dark:bg-gray-700 p-2 rounded"
            >
              <FaPlusCircle />
            </button>
          )}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="bg-gray-300 dark:bg-gray-700 p-2 rounded text-xl"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
		
      </div>
  );
};

export default Navbar;
