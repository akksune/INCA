// Define constants
const container = document.querySelector(".flashcard");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addFlashcardButton = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const deleteAllButton = document.getElementById("delete-all-flashcards");
deleteAllButton.addEventListener("click", deleteAllFlashcards);
// Function to save flashcard data to local storage
const saveFlashcardsToLocal = (tempQuestion, tempAnswer) => {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const editedIndex = parseInt(localStorage.getItem("editedIndex"));

  if (tempQuestion && tempAnswer) {
    if (!isNaN(editedIndex) && editedIndex !== -1) {
      // If editing an existing flashcard
      flashcards[editedIndex] = { question: tempQuestion, answer: tempAnswer };
      localStorage.removeItem("editedIndex"); // Clear editedIndex after saving
    } else {
      // If adding a new flashcard
      flashcards.push({ question: tempQuestion, answer: tempAnswer });
    }

    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    viewlist(); // Update the flashcard view
    addQuestionCard.classList.add("hide"); // Close the form
    container.classList.remove("hide"); // Show flashcards
  } else {
    console.error("Failed to save flashcards: Question or answer is empty");
  }
};

// Add event listener for 'Add Flashcard' button
addFlashcardButton.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

// Hide Create flashcard Card
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
});

// Submit Question
cardButton.addEventListener("click", () => {
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    saveFlashcardsToLocal(tempQuestion, tempAnswer);
    question.value = "";
    answer.value = "";
  }
});

// Generate flashcard view
function viewlist() {
  const listCard = document.querySelector(".card-list-container");
  listCard.innerHTML = ""; // Clear existing flashcards
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.forEach((card, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const questionElement = document.createElement("p");
    questionElement.classList.add("question-div");
    questionElement.textContent = card.question;

    const answerElement = document.createElement("p");
    answerElement.classList.add("answer-div", "hide");
    answerElement.textContent = card.answer;

    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.textContent = "Show/Hide";
    link.addEventListener("click", () => {
      answerElement.classList.toggle("hide");
    });

    div.appendChild(questionElement);
    div.appendChild(link);
    div.appendChild(answerElement);

    const buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      deleteFlashcard(index);
    });
    buttonsCon.appendChild(deleteButton);

    div.appendChild(buttonsCon);
    listCard.appendChild(div);
  });
}

// Load flashcards from local storage when the page loads
window.addEventListener("load", () => {
  viewlist(); // Update the flashcard view on page load
});

// Function to delete a flashcard
function deleteFlashcard(index) {
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.splice(index, 1); // Remove the flashcard at the specified index
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  viewlist(); // Update the flashcard view
}
// Function to delete all flashcards
function deleteAllFlashcards() {
  localStorage.removeItem("flashcards"); // Remove all flashcards from local storage
  viewlist(); // Update the flashcard view
}
