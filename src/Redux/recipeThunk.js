import { createAsyncThunk } from "@reduxjs/toolkit";
import openai from "../openai";

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes",
  async (query, { rejectWithValue }) => {
    if (!query) return rejectWithValue("Query is Required");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate a detailed recipe for ${query} with the following format:

Title: [Recipe Title]
Ingredients:
- [ingredient 1]
- [ingredient 2]

Instructions:
1. Step one
2. Step two`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      console.log("GPT response:", content);

      const titleMatch = content.match(/Title:\s*(.*)/i);
      const ingredientsMatch = content.match(/Ingredients:\s*([\s\S]*?)\n\n/i);
      const instructionsMatch = content.match(/Instructions:\s*([\s\S]*)/i);

      const recipe = {
        id: Date.now(),
        title: titleMatch?.[1]?.trim() || query,
        ingredients: ingredientsMatch?.[1]?.trim() || "No ingredients found.",
        description: instructionsMatch?.[1]?.trim() || "No instructions found.",
      };

      // Fetch image
      const imageResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await imageResponse.json();
      recipe.imageUrl = data.meals?.[0]?.strMealThumb || null;

      return [recipe]; // return as array
    } catch (error) {
      console.error("Recipe Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);


