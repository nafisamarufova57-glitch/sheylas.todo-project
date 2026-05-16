const BaseUrl = "https://nehacij243.pythonanywhere.com/api/v1";

const titleIN = document.querySelector("#todoTitle");
const descIN = document.querySelector("#todoDesc");
const addTodoBtn = document.querySelector("#addTodo");

const todoWrap = document.querySelector(".todo-list");

function UpdateUI(data) {
  todoWrap.innerHTML = "";

  data.forEach((todo) => {
    let { completed, created_at, description, title } = todo;

    todoWrap.innerHTML += `<li class="todo-item" data-id="1" data-completed="false">
              <button
                class="check"
                type="button"
                aria-label="Mark as completed"
                data-action="toggle"
              >
                <span class="check-icon" aria-hidden="true"></span>
              </button>

              <div class="todo-content">
                <div class="todo-top">
                  <h3 class="todo-title">${title}</h3>
                  <span class="badge badge-active">Active</span>
                </div>
                <p class="todo-desc">
                  ${description}
                </p>

                <div class="meta">
                  <span class="meta-item">
                    <span class="meta-label">ID:</span>
                    <span class="meta-value">1</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-label">Created:</span>
                    <span class="meta-value">${created_at}</span>
                  </span>
                </div>
              </div>

              <div class="todo-actions">
                <button
                  class="icon-btn"
                  type="button"
                  title="Edit"
                  data-action="edit"
                >
                  ✎
                </button>
                <button
                  class="icon-btn danger"
                  type="button"
                  title="Delete"
                  data-action="delete"
                >
                  🗑
                </button>
              </div>
            </li>`;
  });
}

async function getTodos() {
  try {
    const response = await fetch(BaseUrl + "/tasks/");
    // console.log(response);

    if (!response.ok) {
      throw new Error("Siz noto'g'ri manzilga so'rov yubordingiz!");
    }

    let data = await response.json();
    UpdateUI(data.data.results);
  } catch (error) {
    alert("Error type: ", error);
  }
}

getTodos();

async function createTodo(todo) {
  try {
    let response = await fetch(BaseUrl + "/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error("qo'shilish muammo post sorovida");
    }

    let data = await response.json();
    console.log(data);
  } catch (error) {
    alert("Type of Erro: ", error);
  }
}
let NewTodo = {
  title: "",
  description: "",
  completed: false,
};

titleIN.addEventListener("input", (e) => {
  //   console.log(e.target.value);
  NewTodo.title = e.target.value;
});

descIN.addEventListener("input", (e) => {
  //   console.log(e.target.value);
  NewTodo.description = e.target.value;
});

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createTodo(NewTodo);
  getTodos();
});
