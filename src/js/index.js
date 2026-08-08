import Handlebars, { log } from "handlebars";
import { products } from "./data";
import usersTemplate from "../templates/template.hbs";

const formRef = document.querySelector("#bookmarkForm");
const loginRef = document.querySelector("#userForm");
const inputRef = document.querySelector("#bookmarkInput");
const btnRef = document.querySelector("#addBookmarkBtn");
const listRef = document.querySelector("#bookmarkList");
const productsBoxRef = document.querySelector(".products__box");
const savedData = localStorage.getItem("bookmarks");
const bookmarksData = savedData ? JSON.parse(savedData) : [];
function createBookmark(mark) {
  const item = `<li class="bookmark__item">
  <a href="${mark}" target="_blank">${mark}</a>
  <button type="button" class="delete">X</button>
  </li>`;
  listRef.insertAdjacentHTML("afterbegin", item);
  inputRef.value = "";
}
bookmarksData.forEach(({ bookmark }) => createBookmark(bookmark));

formRef.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const bookmark = inputRef.value.trim();
  if (bookmark !== "") {
    const data = { bookmark: bookmark };
    bookmarksData.push(data);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarksData));
    createBookmark(bookmark);
  }
});
listRef.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("delete")) {
    const itemToDelete = evt.target.closest(".bookmark__item");
    if (itemToDelete) {
      const urlToRemove = itemToDelete.querySelector("a").getAttribute("href");
      const index = bookmarksData.findIndex(
        (item) => item.bookmark === urlToRemove,
      );
      if (index !== -1) {
        bookmarksData.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarksData));
      }
      itemToDelete.remove();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem("loginData");
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      loginRef.elements.name.value = parsedData.userName || "";
      loginRef.elements.password.value = parsedData.userPassword || "";
    } catch (error) {
      console.error("Помилка парсингу даних з localStorage:", error);
    }
  }
});

loginRef.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const inputElem = evt.currentTarget.elements;
  const loginData = {
    userName: inputElem.name.value,
    userPassword: inputElem.password.value,
  };
  const jsonLoginData = JSON.stringify(loginData);
  localStorage.setItem("loginData", jsonLoginData);
  console.log("Збережено:", jsonLoginData);
  evt.currentTarget.reset();
});

const searchInputRef = document.querySelector("#search-input");

function renderProducts(list) {
  if (list.length === 0) {
    productsBoxRef.innerHTML = "<p>Товарів не знайдено.</p>";
    return;
  }

  productsBoxRef.innerHTML = usersTemplate(list);
}

renderProducts(products);

if (searchInputRef) {
  searchInputRef.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    const filteredProducts = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description
        .toLowerCase()
        .includes(searchTerm);
      return matchesName || matchesDescription;
    });

    renderProducts(filteredProducts);
  });
}
