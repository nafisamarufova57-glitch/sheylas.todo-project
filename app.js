const BaseUrl = "https://nehacij243.pythonanywhere.com/api/v1";

const titleIN = document.querySelector("#todoTitle");
const descIN = document.querySelector("#todoDesc");
const addTodoBtn = document.querySelector("#addTodo");

const todoWrap = document.querySelector(".todo-list");
const searchInput = document.querySelector('[data-field="search"]');
const filterBtns = document.querySelectorAll(".seg-btn");
// console.log(filterBtns);

function UpdateUI(data) {
  todoWrap.innerHTML = "";

  data.forEach((todo) => {
    let { completed, created_at, description, title, id } = todo;

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
                  onclick="editTodo(${id})"
                >
                  ✎
                </button>
                <button
                  class="icon-btn danger"
                  type="button"
                  title="Delete"
                  data-action="delete"
                  onclick='deleteTodo(${id})'
                >
                  🗑
                </button>
              </div>
            </li>`;
  });
}

// search
searchInput.addEventListener("input", async (e) => {
  let searchValue = e.target.value.trim().toLowerCase();

  try {
    const response = await fetch(BaseUrl + "/tasks/");

    if (!response.ok) {
      throw new Error("Search ishlamadi");
    }

    const data = await response.json();

    let filteredTodos = data.data.results.filter((todo) => {
      return todo.title.toLowerCase().includes(searchValue);
    });

    UpdateUI(filteredTodos);
  } catch (error) {
    console.log(error);
  }
});

//to select
let currentFilter = "all";

filterBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    filterBtns.forEach((item) => {
      item.classList.remove("is-active");
    });

    btn.classList.add("is-active");

    currentFilter = btn.dataset.filter;

    try {
      const response = await fetch(BaseUrl + "/tasks/");

      if (!response.ok) {
        throw new Error("Filter ishlamadi");
      }

      const data = await response.json();

      let todos = data.data.results;

      switch (currentFilter) {
        case "active":
          todos = todos.filter((todo) => todo.completed === false);
          break;

        case "completed":
          todos = todos.filter((todo) => todo.completed === true);
          break;

        case "all":
          todos = data.data.results;
          break;
      }

      UpdateUI(todos);
    } catch (error) {
      console.log(error);
    }
  });
});

// to get info
async function getTodos() {
  try {
    const response = await fetch(BaseUrl + "/tasks/");

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

// to create new todo
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
    // console.log(data);
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
  NewTodo.title = e.target.value;
});

descIN.addEventListener("input", (e) => {
  NewTodo.description = e.target.value;
});

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createTodo(NewTodo);
  getTodos();
});

// delete todo
window.deleteTodo = async (id) => {
  try {
    let response = await fetch(BaseUrl + `/tasks/${id}/`, {
      method: "DELETE",
    });

    if (response.status === 200 || response.statusText === 204) {
      alert(`Todo o'chirildi`);
    }

    getTodos();
  } catch (error) {
    alert("O'chirishta muammo bor");
  }
};

// to Edit todo
window.editTodo = async (id) => {
  try {
    const patchData = {
      completed: true,
    };
    const response = await fetch(BaseUrl + `/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    });
    const data = await response.json();
    console.log("Qisman yangilandi:", data);
  } catch (error) {
    console.error("PATCH xato:", error);
  }
};

// modal yaratamiz
const modal = document.createElement("div");

modal.innerHTML = `
<div class="edit-modal" id="editModal">
  <div class="edit-box">
    <h2>Edit Todo</h2>

    <input type="text" id="editTitle" placeholder="Title" />
    
    <textarea id="editDesc" placeholder="Description"></textarea>

    <div class="edit-actions">
      <button id="saveEdit">Save</button>
      <button id="closeModal">Cancel</button>
    </div>
  </div>
</div>
`;

document.body.append(modal);

window.editTodo = async (id) => {
  try {
    editingTodoId = id;

    const response = await fetch(BaseUrl + `/tasks/${id}/`);

    if (!response.ok) {
      throw new Error("Todo topilmadi");
    }

    const data = await response.json();

    editTitle.value = data.data.title;
    editDesc.value = data.data.description;

    editModal.style.display = "flex";
  } catch (error) {
    console.log(error);
  }
};

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

saveEdit.addEventListener("click", async () => {
  try {
    const updatedTodo = {
      title: editTitle.value,
      description: editDesc.value,
    };

    const response = await fetch(BaseUrl + `/tasks/${editingTodoId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error("Yangilashda xato");
    }

    alert("Todo yangilandi");

    editModal.style.display = "none";

    getTodos();
  } catch (error) {
    console.log(error);
  }
});
