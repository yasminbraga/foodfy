// MODAL RECEITAS

const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".site-card");

for (let card of cards) {
  card.addEventListener("click", function () {
    const imgSrc = card.querySelector(".site-card-image").getAttribute("src");
    const cardTitle = card.querySelector(".site-recipe-title").innerHTML;
    const cardAuthor = card.querySelector(".site-recipe-chef").innerHTML;

    modalOverlay.classList.add("active");
    modalOverlay.querySelector("img").src = imgSrc;
    modalOverlay.querySelector(".modal-title").innerHTML = cardTitle;
    modalOverlay.querySelector(".modal-author").innerHTML = cardAuthor;
  });
}
const closeModal = document.querySelector(".close-modal");
if (closeModal) {
  closeModal.addEventListener("click", function () {
    modalOverlay.classList.remove("active");
  });
}

// HIGHLIGHT LINKS

let currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .site-links a");
const adminLinks = document.querySelectorAll("header .links a");

if (menuItems) {
  for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
      item.classList.add("active");
    }
  }
}

if (adminLinks) {
  for (item of adminLinks) {
    if (currentPage.includes(item.getAttribute("href"))) {
      item.classList.add("active");
    }
  }
}

// ADD FIELD FORM
function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false;

  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

const addIngredientField = document.querySelector(".add-ingredient");
if (addIngredientField) {
  addIngredientField.addEventListener("click", addIngredient);
}

function addPreparation() {
  const preparations = document.querySelector("#preparations");
  const fieldContainer = document.querySelectorAll(".preparation");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false;

  newField.children[0].value = "";
  preparations.appendChild(newField);
}

const addPreparationField = document.querySelector(".add-preparation");
if (addPreparationField) {
  addPreparationField.addEventListener("click", addPreparation);
}

// PAGINATION
function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }
      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }
      pages.push(currentPage);
      oldPage = currentPage;
    }
  }
  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
      console.log(elements);
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }
  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if (pagination) {
  createPagination(pagination);
}

// PHOTOS UPLOAD
const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == "photo")
        photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos");
      event.preventDefault();
      return true;
    }
    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");

    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photosDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photosDiv);

    PhotosUpload.files.splice(index, 1);

    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photosDiv.remove();
  },
  removeOldPhoto(event) {
    const photosDiv = event.target.parentNode;
    if (photosDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      );
      if (removedFiles) {
        removedFiles.value += `${photosDiv.id},`;
      }
    }
    photosDiv.remove();
  },
};

// AVATAR UPLOAD
const AvatarUpload = {
  input: "",
  uploadLimit: 1,
  preview: document.querySelector("#avatar-preview"),
  files: [],
  handleFileInput(event) {
    const { files: fileAvatar } = event.target;
    AvatarUpload.input = event.target;

    if (AvatarUpload.hasLimit(event)) return;

    Array.from(fileAvatar).forEach((file) => {
      AvatarUpload.files.push(file);
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.src = String(reader.result);

        const div = AvatarUpload.getContainer(image);
        AvatarUpload.preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });

    AvatarUpload.input.files = AvatarUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = AvatarUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert("Apenas 1 avatar por chef");
      event.preventDefault();
      return true;
    }

    const photoDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value == "avatar")
        photoDiv.push(item);
    });

    const totalPhotos = fileList.length + photoDiv.length;
    if (totalPhotos > uploadLimit) {
      alert("apenas 1 foto");
      event.preventDefault();
      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new DataTransfer() || new ClipboardEvent("").clipboardData;

    AvatarUpload.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("avatar");

    div.onclick = AvatarUpload.removeAvatar;

    div.appendChild(image);

    div.appendChild(AvatarUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removeAvatar(event) {
    const photoDiv = event.target.parentNode; // <div class="avatar">
    const photosArray = Array.from(AvatarUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    AvatarUpload.files.splice(index, 1);
    AvatarUpload.input.files = AvatarUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldAvatar(event) {
    const photosDiv = event.target.parentNode;
    if (photosDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      );
      if (removedFiles) {
        removedFiles.value += `${photosDiv.id},`;
      }
    }
    photosDiv.remove();
  },
};

// GALERIA DE IMAGENS
const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach((preview) =>
      preview.classList.remove("active")
    );
    target.classList.add("active");

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  },
};

const Lightbox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = 0;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeButton.style.top = "-80px";
  },
};

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) Validate.displayError(input, results.error);
  },
  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error");
    if (errorDiv) errorDiv.remove();
  },
  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = "Email inválido";

    return {
      error,
      value,
    };
  },
};
