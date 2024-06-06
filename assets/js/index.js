/**
 *
 * * VARIABLE
 *
 **/
const gallery = document.querySelector(".gallery");
const categoryContainer = document.querySelector(".category-container");
//
const loged = window.localStorage.loged;
const logout = document.querySelector(".logout");
const modalsContainer = document.querySelector(".modal");
const editMod = document.querySelector(".editMod");
const openModal = document.querySelector(".modify");
const closeModal = document.querySelector(".modal-close");
const closeModal2 = document.querySelector(".modal-close2");
const modalGalery = document.querySelector(".modal-galery");
const addIMGButton = document.querySelector(".modal-button");
const modalAddWorks = document.querySelector(".modalAddWorks");
const modalDelWorks = document.querySelector(".modal-wrapper");
const arrowBack = document.querySelector(".arrow-left");
const inputFile = document.querySelector("#file");
const token = window.localStorage.getItem("token");
const formAddWorks = document.querySelector("#formAddWorks");
const previewImage = document.querySelector("#previewImage");
const containerAddImgIcon = document.querySelector(".fa-image");
const containerAddImgbtn = document.querySelector(".labelFile");
const containerAddImgText = document.querySelector(".containerAddPhoto p");
const resetArrow = document.querySelector(".rotate-right");
//
let allWorks = [];
let allCats = [];

async function init() {
  allWorks = await getData("works");
  allCats = await getData("categories");
  createCategoryButtons();
  displayWorks();
  addWorks();
  displayCategoryModal();
  displayModalImage();
}
init();

async function getData(type) {
  const response = await fetch(`http://localhost:5678/api/${type}`);
  return response.json();
}

async function displayWorks(filter = 0) {
  gallery.innerHTML = "";
  let filteredWorks = allWorks;
  if (filter != 0) {
    filteredWorks = allWorks.filter((work) => work.categoryId === filter);
  }
  const fragment = document.createDocumentFragment();
  for (const work of filteredWorks) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>`;

    fragment.appendChild(figure);
  }
  gallery.appendChild(fragment);
}

/**
 *
 * Creation Button
 *
 * */
function createCategoryButtons() {
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("category-button");
  allButton.addEventListener("click", () => {
    displayWorks(0);
    setActiveButton(allButton);
  });
  categoryContainer.appendChild(allButton);

  allCats.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("category-button");
    button.addEventListener("click", () => {
      displayWorks(category.id);
      setActiveButton(button);
    });
    categoryContainer.appendChild(button);
  });

  setActiveButton(allButton);
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".category-button");
  buttons.forEach((button) => button.classList.remove("active"));
  activeButton.classList.add("active");
}

/**
 *
 * login check
 * en faire une fonction//avec la barre noir
 *
 */
const isUserLoggedIn = () => localStorage.getItem("loged") === "true";

const loginUser = () => {
  logout.textContent = "Logout";
  openModal.classList.remove("display");
  categoryContainer.classList.add("display");
  editMod.classList.remove("display");
};

const logoutUser = () => {
  localStorage.setItem("loged", "false");
  openModal.classList.add("display");
  editMod.classList.add("display");
  window.location.reload();
};

// Vérifie l'état de connexion lors du chargement de la page
if (isUserLoggedIn()) {
  loginUser();
  logout.addEventListener("click", (event) => {
    event.preventDefault();
    logoutUser();
  });
}

/**
 *
 * MODALS
 *
 */

/**
 * Manage dispay modals
 **/
const toggleClass = (element, className, action) => {
  element.classList[action](className);
};

const showModal = () => toggleClass(modalsContainer, "display", "remove");
const hideModal = () => toggleClass(modalsContainer, "display", "add");
const hideModalAdd = () => {
  toggleClass(modalAddWorks, "display", "add");
  resetModalState();
};

const resetModalState = () => {
  toggleClass(modalsContainer, "display", "add");
  modalDelWorks.style.display = "flex";
  modalAddWorks.style.display = "none";
};

openModal.addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
closeModal2.addEventListener("click", hideModalAdd);

modalsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    hideModal();
    toggleModalVisibility(modalDelWorks, modalAddWorks, true);
  }
});

const toggleModalVisibility = (modalToShow, modalToHide, reset = false) => {
  modalToHide.style.display = "none";
  modalToShow.style.display = "flex";
  if (reset) {
    modalDelWorks.style.display = "flex";
    modalAddWorks.style.display = "none";
  }
};

addIMGButton.addEventListener("click", () => {
  toggleModalVisibility(modalAddWorks, modalDelWorks);
});

arrowBack.addEventListener("click", () => {
  toggleModalVisibility(modalDelWorks, modalAddWorks);
});

/**
 * display galery modal
 **/
async function displayModalImage() {
  modalGalery.innerHTML = "";
  const works = await getData("works");
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <span class="delete-button" data-id="${work.id}">
      <i class="fa-solid fa-trash-can"></i></span>
    `;
    modalGalery.appendChild(figure);
  });
  deleteWork();
}

/**
 * Préview
 **/
if (inputFile && previewImage && modalDelWorks && resetArrow) {
  const elementsToReset = [
    containerAddImgIcon,
    containerAddImgText,
    containerAddImgbtn,
  ];

  const resetPreview = () => {
    inputFile.value = "";
    previewImage.src = "";
    previewImage.style.display = "none";
    elementsToReset.forEach((element) => (element.style.opacity = 1));
  };

  const handleFileChange = () => {
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        elementsToReset.forEach((element) => (element.style.opacity = 0));
      };
      reader.readAsDataURL(file);
    } else {
      resetPreview();
    }
  };

  inputFile.addEventListener("change", handleFileChange);
  modalDelWorks.addEventListener("click", resetPreview);
  resetArrow.addEventListener("click", resetPreview);
}
/**
 * Catégories
 **/
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categorys = await getData("categories");
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

/**
 * Manage Add
 **/
function addWorks() {
  formAddWorks.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formAddWorks);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du fichier");
      }

      const data = await response.json();
      console.log("Fichier envoyé avec succès :", data);
      allWorks.push(data);
      displayWorks();
      displayModalImage();
      formAddWorks.reset();
      modalDelWorks.style.display = "flex";
      modalAddWorks.style.display = "none";
    } catch (error) {
      console.error("Erreur :", error);
    }
  });
}
/**
 * Manage Delete
 **/
async function handleDelete(workID) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du fichier");
    }

    // Mise à jour de allWorks et réaffichage
    allWorks = allWorks.filter((work) => work.id !== parseInt(workID));
    displayWorks();
    displayModalImage();

    console.log(`Travail supprimé avec l'ID : ${workID}`);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

function deleteWork() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", async () => {
      const workID = deleteButton.dataset.id;
      console.log(`ID du travail à supprimer : ${workID}`);
      await handleDelete(workID);
    });
  });
}
