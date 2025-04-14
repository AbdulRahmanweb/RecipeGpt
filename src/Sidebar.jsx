import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectRecipe, deleteSavedRecipe } from './Redux/recipeSlice';
import { FaTrash } from 'react-icons/fa';

const Sidebar = () => {
	const dispatch = useDispatch();
	const { saved, sidebarOpen, selectedRecipe, darkMode } = useSelector((state) => state.recipes);

	useEffect(() => {
		  document.documentElement.classList.toggle("dark", darkMode);
		}, [darkMode]);
		

	const handleDelete = (id) => {
		dispatch(deleteSavedRecipe(id));
		localStorage.removeItem("SelectedRecipe");
	
		if (selectedRecipe && selectedRecipe.id === id) {
		  dispatch(selectRecipe(null));
		}
	  };

	  const handleOpenSavedRecipe = (recipe) => {
		dispatch(selectRecipe(recipe));
		localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
		localStorage.setItem("isSavedRecipeView", "true"); // just in case you use this
	};

	return (
		<div className={`fixed md:static top-0 left-0 z-20 h-full overflow-y-auto scrollbar-hide bg-gray-100 dark:bg-gray-950 md:w-72 w-64 placeholder: p-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
				<h2 className="text-lg font-semibold mb-4">Saved Recipes</h2>
				{saved.map((item, id) => (
				  <div key={id} onClick={() => (handleOpenSavedRecipe(item))} className="cursor-pointer text-black dark:text-white dark:hover:bg-gray-700 mb-2 p-1">
					{item.title}
					<button className="text-red-500 hover:text-red-700 ml-2" 
					onClick={(e) => {e.stopPropagation()
					 handleDelete(item.id)}}> <FaTrash /></button>
				  </div>
				))}
			  </div>
	);
}

export default Sidebar;
