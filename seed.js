const faker = require("faker");
const { hash } = require("bcryptjs");

const User = require("./src/app/models/User");
const Recipe = require("./src/app/models/Recipe");
const File = require("./src/app/models/File");
const Chef = require("./src/app/models/Chef");

let usersIds = [];
let totalRecipes = 6;
let totalUsers = 3;
let totalFiles = 15;

async function createUsers() {
  const users = [];
  const password = await hash("123456", 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      is_admin: false,
    });
  }

  const usersPromise = users.map((user) => User.create(user));

  usersIds = await Promise.all(usersPromise);
}

async function createChefs() {
  const avatar = {
    name: faker.image.image(),
    path: `public/images/placeholder.png`,
  };

  const chefs = [];

  while (chefs.length < totalUsers) {
    const fileId = await File.create(avatar);
    chefs.push({
      name: faker.name.findName(),
      file_id: fileId,
    });
  }

  const chefsPromise = chefs.map((chef) => Chef.create(chef));
  chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes() {
  let recipes = [];

  while (recipes.length < totalRecipes) {
    recipes.push({
      title: faker.commerce.productName(),
      ingredients: Array.from(
        faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" ")
      ),
      preparation: Array.from(
        faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(" ")
      ),
      information: faker.commerce.productDescription(),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      chef_id: chefsIds[Math.floor(Math.random() * totalUsers)],
    });
  }

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
  recipesIds = await Promise.all(recipesPromise);

  let files = [];

  while (files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
    });
  }

  const filesPromise = files.map((file) => File.create(file));
  filesIds = await Promise.all(filesPromise);

  recipesFiles = [];

  while (recipesFiles.length < totalFiles) {
    recipesFiles.push({
      recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
      file_id: filesIds[Math.floor(Math.random() * totalFiles)],
    });
  }

  const recipesFilesPromise = recipesFiles.map((recipeFile) =>
    File.insertId(recipeFile)
  );
  await Promise.all(recipesFilesPromise);
}

async function init() {
  await createUsers();
  await createChefs();
  await createRecipes();
}

init();
