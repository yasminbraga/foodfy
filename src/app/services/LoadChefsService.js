const Chef = require("../models/Chef");
const Recipe = require("../models/Recipe");
const File = require("../models/File");

const LoadRecipesService = require("./LoadRecipesService");

async function getAvatar(fileId) {
  let avatar = await File.find(fileId);
  avatar = {
    ...avatar,
    src: `${avatar.path.replace("public", "")}`,
  };

  return avatar;
}

async function getRecipes(chefId) {
  let recipes = await LoadRecipesService.load("recipes", { chef_id: chefId });
  return recipes;
}

async function format(chef) {
  const avatar = await getAvatar(chef.file_id);
  const chefRecipes = await getRecipes(chef.id);

  chef.avatar = avatar;
  chef.recipes = chefRecipes;
  chef.totalRecipes = chefRecipes.length;
  console.log("chegou aqui");
  return chef;
}

const LoadService = {
  load(service, filter) {
    this.filter;
    return this[service]();
  },
  async chef() {
    try {
      const chef = await Chef.findOne(this.filter);
      console.log(chef);
      return format(chef);
    } catch (error) {
      console.error(error);
    }
  },
  async chefs() {
    try {
      const chefs = await Chef.findAll(this.filter);
      const chefsPromise = chefs.map(format);
      return Promise.all(chefsPromise);
    } catch (error) {
      console.error(error);
    }
  },
  format,
};

module.exports = LoadService;
