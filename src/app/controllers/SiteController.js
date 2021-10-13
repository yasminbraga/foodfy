const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const File = require("../models/File");

const LoadRecipesService = require("../services/LoadRecipesService");
const LoadChefsService = require("../services/LoadChefsService");

module.exports = {
  async index(req, res) {
    try {
      const allRecipes = await LoadRecipesService.load("recipes");

      const recipes = allRecipes.filter((recipe, index) =>
        index > 5 ? false : true
      );

      console.log("recipes");
      return res.render("site/index", { recipes });
    } catch (error) {
      console.error(error);
    }
    // return res.render("site/index");
  },
  about(req, res) {
    return res.render("site/about");
  },
  async showRecipes(req, res) {
    try {
      const allRecipes = await LoadRecipesService.load("recipes");
      const recipes = allRecipes.filter((recipe, index) =>
        index > 10 ? false : true
      );

      return res.render("site/recipes", { recipes });
    } catch (error) {
      console.error(error);
    }
  },
  async showChefs(req, res) {
    try {
      const chefs = await LoadChefsService.load("chefs");
      console.log(chefs);
      console.log("chegou aqyu");
      return res.render("site/chefs");
    } catch (error) {
      console.error(error);
    }
  },
};
