// Get element you need into variables
const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need array to hold our state
let items = [];

// handle submit
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('submitted');
  const name = e.currentTarget.item.value;
  if (!name) {
    return;
  }
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  // push items to state
  items.push(item);
  console.log(`there are now ${items.length} in your state`);
  // clear form
  e.target.reset();
  // fire custom event that will tell anyone else who cares that the items have been updated
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

// display items function
const displayItems = () => {
  const html = items
    .map(
      (item) =>
        `<li class='shopping-item'>
      <input 
      value='${item.id}' 
      type='checkbox'
      ${item.complete ? 'checked' : ''}>
      <span class='item-name'>${item.name}</span>
      <button 
      value='${item.id}'
      aria-label='remove ${item.name}'>&times</button>
    </li>`
    )
    .join('');
  list.innerHTML = html;
};

// local storage
const addToLocalStorage = () => {
  localStorage.setItem('items', JSON.stringify(items));
};

// getItemsFromLocalStorage
const getItemsFromLocalStorage = () => {
  console.log('getting items from local');

  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    items.push(...lsItems);
  }
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const markAsComplete = (id) => {
  console.log('marking as complete', id);
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const deleteItem = (id) => {
  console.log('deleting item', id);
  items = items.filter((item) => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

// add event listener
shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', addToLocalStorage);

list.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});
getItemsFromLocalStorage();
