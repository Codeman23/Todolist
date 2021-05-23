//Selectors
const todoButton = document.querySelector(".todoButton"),
      todoInput = document.querySelector(".todoInput"),
      todoList = document.querySelector(".todoList"),
      filterTodo = document.querySelector(".filterTodo");

//EventListeners
todoButton.addEventListener("click", addTodo);
filterTodo.addEventListener("click", filterTodos);
document.addEventListener("DOMContentLoaded", getTodos);

//Functions
function createElement(item, elem, className, content, parentElem ) {
    item = document.createElement(elem);
    item.className = className;
    item.innerHTML = content;
    parentElem.appendChild(item);
    return item;
}

function addTodo(e){
    e.preventDefault();

    let todo, itemTxt, completeButton, trashButton;
    const wrapper = createElement(todo, "div", "todo", "", todoList);
    const itemValue = todoList.children.length + '.' + ' ' + todoInput.value;

    createElement(itemTxt, "div", "todoItem", itemValue, wrapper);
    createElement(completeButton, "button", "completeBtn", "<i class='fas fa-check'></i>", wrapper);
    createElement(trashButton, "button", "trashBtn", "<i class='fas fa-trash'></i>", wrapper);

    saveToLocalStorage(todoInput.value, "todos");
    saveToLocalStorage("undone", "status");

    todoInput.value = "";

    wrapper.addEventListener("click", deleteCheck);
}

function deleteCheck(e) {
    const item = e.target,
          todo = item.parentElement,
          //Changes in local storage
          allTodos = document.querySelectorAll(".todo"),
          savedValue = JSON.parse(localStorage.getItem("todos"));
          savedStatus = JSON.parse(localStorage.getItem("status"));

    if(item.className === "completeBtn") {
        todo.classList.toggle("completed");

        allTodos.forEach((element, index) => {
            if( element.classList.contains("completed")) {
                savedStatus[index] = "done";
                localStorage.setItem("status", JSON.stringify(savedStatus));
            } else {
                savedStatus[index] = "undone";
                localStorage.setItem("status", JSON.stringify(savedStatus));
            }
        });

    } else if (item.className === "trashBtn") {
        todo.classList.add("fall");
        todo.addEventListener('transitionend', () => {
            todo.remove();

            //Remove all items
            const allItems = todoList.querySelectorAll(".todo");
            allItems.forEach(function (item) {
                item.remove();
            });
            //Update list from Local Storage
            getTodos();
        });

        //Remove from localstorage
        allTodos.forEach((element, index) => {
            if( element === todo) {
                savedValue.splice(index, 1);
                savedStatus.splice(index, 1);
                localStorage.setItem("todos", JSON.stringify(savedValue));
                localStorage.setItem("status", JSON.stringify(savedStatus));
            }
        });

    }
}

function filterTodos(e) {
    const sortValue = e.target.value;
    const todoItems = todoList.childNodes;

    todoItems.forEach( item => {
        switch (sortValue) {
            case "completed":
                if (!item.classList.contains("completed")) {
                    item.style.display = "none";
                } else {
                    item.style.display = "flex";
                }
                break;
            case "uncompleted":
                if (item.classList.contains("completed")) {
                    item.style.display = "none";
                } else {
                    item.style.display = "flex";
                }
                break;
            default:
                item.style.display = "flex";
        }
    })
}

function checkLocalStorage(localName) {
    let saveItems;
    if(localStorage.getItem(localName) === null) {
        saveItems = [];
    } else {
        saveItems = JSON.parse(localStorage.getItem(localName));
    }
    return saveItems;
}

function saveToLocalStorage(value,localName) {
    let saveItems = checkLocalStorage(localName);
    saveItems.push(value);
    localStorage.setItem(localName, JSON.stringify(saveItems));
}

function getTodos() {
    let saveItems = checkLocalStorage("todos");
    saveItems.forEach( (itemValue, index) => {
        let todo, itemTxt, completeButton, trashButton;
        let itemName = `${1+index}. ${itemValue}`;
        const wrapper = createElement(todo, "div", "todo", "", todoList),
              savedStatus = JSON.parse(localStorage.getItem("status"));

        createElement(itemTxt, "div", "todoItem", itemName, wrapper);
        createElement(completeButton, "button", "completeBtn", "<i class='fas fa-check'></i>", wrapper);
        createElement(trashButton, "button", "trashBtn", "<i class='fas fa-trash'></i>", wrapper);

        //Add completed class
        if(savedStatus[index] === "done") {
            wrapper.classList.add("completed");
        }
        //Add eventlistenet
        wrapper.addEventListener("click", deleteCheck);
    });
}
