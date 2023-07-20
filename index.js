import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

const deleteEvent = () => {
  const deleteButtons = document.querySelectorAll("i.delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const deleteRef = doc(db, "bookmarks", button.dataset.id);
      deleteDoc(deleteRef).then(() => {
        button.parentElement.parentElement.parentElement.parentElement.remove();
      });
    });
  });
};

const generateTemplate = (response, id) => {
  return `<div class="card">
                <p>${response.title}</p>
                <div class="options">
                   <p>
                      <span class="category ${response.category.toLowerCase()}">${
    response.category
  }</span>
                   </p>
                   <div>
                      <a href="${response.link}" target="_blank"
                      ><i class="bi bi-box-arrow-up-right redirect"></i
                      ></a>
                      <a href="https://www.google.com/search?q=${
                        response.title
                      }" target="_blank"
                      ><i class="bi bi-google google"></i
                      ></a>
                      <span>
                          <i class="bi bi-trash3-fill delete" data-id="${id}"></i>
                      </span>
                   </div>
                </div>
          </div>`;
};

const cards = document.querySelector(".cards");
const showCard = () => {
  cards.innerHTML = "";
  getDocs(colRef)
    .then((data) => {
      data.docs.forEach((document) => {
        cards.innerHTML += generateTemplate(document.data(), document.id);
      });
      deleteEvent();
    })
    .catch((error) => {
      console.log(error);
    });
};
showCard();

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addDoc(colRef, {
    link: addForm.url.value,
    title: addForm.topic.value,
    category: addForm.channels.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addForm.reset();
    showCard();
  });
});

const filteredCards = (category) => {
  if (category === "All") {
    showCard();
  } else {
    const qRef = query(colRef, where("category", "==", category));
    cards.innerHTML = "";
    getDocs(qRef)
      .then((data) => {
        data.docs.forEach((document) => {
          cards.innerHTML += generateTemplate(document.data(), document.id);
        });
        deleteEvent();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");

categoryList.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    filteredCards(event.target.innerText);
    categorySpan.forEach((span) => {
      span.classList.remove("active");
    });
    event.target.classList.add("active");
  }
});
