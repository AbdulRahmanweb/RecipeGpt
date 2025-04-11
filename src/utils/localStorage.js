export const saveToLocalStorage = (key, value) => {
	try {
	  console.log(`[SAVE] ${key}:`, value); //Log value being saved
	  localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
	  console.warn("Error saving to localStorage", e);
	}
  };
  
  export const loadFromLocalStorage = (key) => {
	try {
	  const value = localStorage.getItem(key);
	  const parsed = value ? JSON.parse(value) : null;
	  console.log(`[LOAD] ${key}:`, parsed); //Log value being loaded
	  return parsed;
	} catch (e) {
	  console.warn("Error loading from localStorage", e);
	  return null;
	}
  };
  