 'use strict'

document.addEventListener('DOMContentLoaded', function() {

  const form = document.querySelector('.todo-control');
  const toDoList = document.getElementById('todo');
  const completeList = document.getElementById('completed');
  const headerInput = document.querySelector('.header-input');

  // 1 создаем объект
  let data = {
    todo: [],
    completed: []
  }
  
  // 2 проверка localStorage на наличие данных
  if(localStorage.getItem('localData')) {
    data = JSON.parse(localStorage.getItem('localData'));
  }

  // 3 функция, которая рендерит наши данные, если они есть в Storage
  const renderItemsForUpdate = function() {
    if (!data.todo.length && !data.completed.length) {
      return;
    }
    for (let i = 0; i < data.todo.length; i++) {
      renderItem(data.todo[i]);
    }
    for (let i = 0; i < data.completed.length; i++) {
      renderItem(data.completed[i], true);
    }
  }
  // 4 функция, которая пишет в Storage 
  const dataUpdateToLocalS = function() {
    localStorage.setItem('localData', JSON.stringify(data));
  }
  // функция, которая добавляет элемент на страницу
  const addItem = function(text) {
    // рендеринг одного элемента
    renderItem(text);
    headerInput.value = '';
    // помещает в todo данные
    data.todo.push(text);
    // сохраняет наши итоговые данные после обработки
    dataUpdateToLocalS();

  }
  // функция удаляет элемент из его родителя
  const itemRemove = function(elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
    }
    else {
      data.completed.splice(data.completed.indexOf(text), 1);
    }

    itemParent.removeChild(item);
    dataUpdateToLocalS();
  }
  // функция переносит элемент из списка в список и при необходимости обратно
  const itemComplete = function(elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    let target;

    if (id === 'todo') {
      target = completeList;
    }
    else {
      target = toDoList;
    }

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(text), 1);
      data.completed.push(text);
    }
    else {
      data.completed.splice(data.completed.indexOf(text), 1);
    data.todo.push(text);
    }
    itemParent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
    dataUpdateToLocalS();
  }
 // функция рендеринга одного элемента
  const renderItem = function(text, completed = false) {
    const item = document.createElement('li');
    
    const buttonBlock = document.createElement('div');
    const buttonRemove = document.createElement('button');
    const buttonComplete = document.createElement('button');
    
    let list;
    if(completed) {
      list = completedList;
    } else {
      list = toDoList;
    }
    

    item.classList.add('todo-item');
    buttonBlock.classList.add('todo-buttons');
    buttonRemove.classList.add('todo-remove');
    buttonComplete.classList.add('todo-complete');

    // вешаем событие на кнопку удаления
    buttonRemove.addEventListener('click', function(event) {
      itemRemove(event.target);
    })
    // вешаем событие на кнопку выполнения
    buttonComplete.addEventListener('click', function(event) {
      itemComplete(event.target);
    })

    item.textContent = text;
    // сначала формируем блок кнопок
    buttonBlock.appendChild(buttonRemove);
    buttonBlock.appendChild(buttonComplete);
    // блок кнопок добавляем в item
    item.appendChild(buttonBlock);

    // записываем последним ребенком в itemList
    list.insertBefore(item, list.childNodes[0]);
  }
  // 5 обработчик сабмита
  form.addEventListener('submit', function(event){
    event.preventDefault();

    if (headerInput.value !== '') {
      addItem(headerInput.value.trim());
    }
  })
  // вызов функции, которая при наличии данных в Storage отрендерит их
  renderItemsForUpdate();
})
