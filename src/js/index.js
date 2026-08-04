import Handlebars from "handlebars";
import {products} from "./data";
import usersTemplate from "../templates/template.hbs";

const formRef = document.querySelector("#bookmarkForm");
const loginRef = document.querySelector("#userForm");
const inputRef = document.querySelector("#bookmarkInput");
const btnRef = document.querySelector("#addBookmarkBtn");
const listRef = document.querySelector("#bookmarkList");
const productsBoxRef = document.querySelector(".products__box");

formRef.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const bookmark = inputRef.value;
  if (bookmark !== "") {
    const data = {
      bookmark: bookmark,
    }
    const jsonData = JSON.stringify(data)
    console.log(jsonData);
    const item = `<li class="bookmark__item">
        <a href="${bookmark}" target="_blank">${bookmark}</a>
        <button type="button" class="delete">X</button>
        </li>`;
    listRef.insertAdjacentHTML("afterbegin", item);
    inputRef.value = "";
  }
});

listRef.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("delete")) {
    const itemToDelete = evt.target.closest(".bookmark__item");
    if (itemToDelete) {
      itemToDelete.remove();
    }
  }
});

loginRef.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const inputElem = evt.currentTarget.elements;
const loginData = {
    userName: inputElem.name.value,
    userPassword: inputElem.password.value,
}
const jsonLoginData = JSON.stringify(loginData)
console.log(jsonLoginData);
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
      const matchesDescription = product.description.toLowerCase().includes(searchTerm);
      return matchesName || matchesDescription;
    });

    renderProducts(filteredProducts);
  });
}