const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Homepage route
app.get('/', (req, res) => {
  res.render('index');
});

// Route to get a random cocktail
app.get('/cocktail', async (req, res) => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const drink = response.data.drinks[0];

    // Extract ingredients and measurements
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      if (drink[`strIngredient${i}`]) {
        ingredients.push({
          ingredient: drink[`strIngredient${i}`],
          measure: drink[`strMeasure${i}`] || ''
        });
      }
    }

    res.render('cocktail', {
      name: drink.strDrink,
      category: drink.strCategory,
      instructions: drink.strInstructions,
      image: drink.strDrinkThumb,
      ingredients: ingredients
    });
  } catch (error) {
    console.error("Failed to fetch cocktail", error);
    res.send("Something went wrong fetching the cocktail.");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

