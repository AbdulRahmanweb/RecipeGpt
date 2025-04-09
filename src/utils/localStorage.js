export const saveToLocalStorage = (key, value) => {
	try {
	  localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
	  console.warn("Error saving to localStorage", e);
	}
  };
  
  export const loadFromLocalStorage = (key) => {
	try {
	  const value = localStorage.getItem(key);
	  return value ? JSON.parse(value) : null;
	} catch (e) {
	  console.warn("Error loading from localStorage", e);
	  return null;
	}
  };
  