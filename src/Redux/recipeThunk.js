import { createAsyncThunk } from "@reduxjs/toolkit";
import openai from "../openai";

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes",
  async (query, { rejectWithValue }) => {
    if (!query) return rejectWithValue("Query is Required");

    try {
      //Trying OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate a detailed recipe for ${query} with the following format:

Title: [Recipe Title]
Ingredients:
 [ingredient 1]
 [ingredient 2]

Instructions:
1. Step one
2. Step two`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const titleMatch = content.match(/Title:\s*(.*)/i);
      const ingredientsMatch = content.match(/Ingredients:\s*([\s\S]*?)\n\n/i);
      const instructionsMatch = content.match(/Instructions:\s*([\s\S]*)/i);

      const recipe = {
        id: Date.now(),
        title: titleMatch?.[1]?.trim() || query,
        ingredients: ingredientsMatch?.[1]?.trim() || "No ingredients found.",
        description: instructionsMatch?.[1]?.trim() || "No instructions found.",
        source: "OpenAI",
      };

      //Trying to get image from Spoonacular
      const spoonKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
      const spoonImageRes = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=1&apiKey=${spoonKey}`
      );
      const spoonImageData = await spoonImageRes.json();
      recipe.imageUrl = spoonImageData.results?.[0]?.image || null;

      return [recipe];

    } catch (error) {
      console.warn("OpenAI failed, trying Spoonacular fallback...");

      try {
        //Spoonacular fallback
        const spoonKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
        
        const searchResponse = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=1&apiKey=${spoonKey}`
        );
        const searchData = await searchResponse.json();
        const match = searchData.results?.[0];
        
        if (!match) throw new Error("No Spoonacular match");
        
        const detailResponse = await fetch(
          `https://api.spoonacular.com/recipes/${match.id}/information?apiKey=${spoonKey}`
        );

        const detailData = await detailResponse.json();
        
       
        const recipe = {
          id: Date.now(),
          title: detailData.title || query,
          ingredients: (detailData.extendedIngredients || [])
            .map(i => `- ${i.original}`)
            .join("\n"),
          description: detailData.instructions || "Instructions not available.",
          analyzedInstructions: detailData.analyzedInstructions?.[0]?.steps?.length > 0
            ? [{ steps: detailData.analyzedInstructions[0].steps }]
            : [],
          imageUrl: detailData.image || null,
          source: "Spoonacular",
        };
        
        

        return [recipe];

      } catch (spoonError) {
        console.warn("Spoonacular failed, trying MealDB fallback...");

        try {
          //Trying mealdb fallback
          const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
          const fallbackData = await fallbackResponse.json();
          const fallbackRecipe = fallbackData.meals?.[0];

          if (!fallbackRecipe) throw new Error("No MealDB match");

          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const item = fallbackRecipe[`strIngredient${i}`];
            const measure = fallbackRecipe[`strMeasure${i}`];
            if (item && item.trim()) {
              ingredients.push(`- ${measure} ${item}`);
            }
          }

          const instructions = fallbackRecipe.strInstructions
            ?.split("\r\n")
            .filter(step => step.trim())
            .map((step, index) => `${index + 1}. ${step}`);

          const recipe = {
            id: Date.now(),
            title: fallbackRecipe.strMeal || query,
            ingredients: ingredients.join("\n"),
            description: instructions.join("\n"),
            imageUrl: fallbackRecipe.strMealThumb,
            source: "MealDB",
          };

          return [recipe];

        } catch (mealDbError) {
          console.error("MealDB failed too:", mealDbError);
          return rejectWithValue("Failed to fetch recipe from all sources.");
        }
      }
    }
  }
);
