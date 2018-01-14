import '../scss/styles.scss';

import $ from "jquery";

/*
Create template for book card
*/
const renderBookcard = (book,index) => `
<div class="book">
  <p class="name">${book['book-name']}</p>
  <p class="author">${book['book-author']}</p>
  <div class="buttons">
    <a data-index=${index}>
      <i class="fa fa-edit" aria-hidden="true"></i>
      Редактировать
    </a>
  </div>
  <div class="remove-button">
    <a data-index=${index}>
      <i class="fa fa-remove" aria-hidden="true"></i>
    </a>
  </div>
</div>
`;

/*
render array of books in container
*/
const renderLibrary = (container, books) => {
  container.empty();
  books.forEach( (book,index) => {
    const bookcard = renderBookcard(book,index);
    container.append(bookcard);
  });
}

/*
create key-value representation of form data
*/
const getFormData = ($form) => {
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};
    $.map(unindexed_array, (n, i) => {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

/*
insert new book to library
*/
const insertToLibrary = (library, book) => {
  library.push(book);
}

/*
remove one book from library
*/
const removeFromLibrary = (library, index) => {
  library.splice(index,1);
}

/*
load data as object to form fields for editing
*/
const loadToForm = (data) => {
  for (const key in data) {
    $(`input[name=${key}]`).val(data[key]);
  }
}

/*
sort books by name / author
*/
const sortByName = (a,b) => {
  return a['book-name'] > b['book-name']
  ? 1
  : (a['book-name'] < b['book-name'])
  ? -1
  : 0;
}

const sortByAuthor = (a,b) => {
  return a['book-author'] > b['book-author']
  ? 1
  : (a['book-author'] < b['book-author'])
  ? -1
  : 0;
}

const sortLibraryByName = (library) => {
  library.sort(sortByName);
}
const sortLibraryByAuthor = (library) => {
  library.sort(sortByAuthor);
}

/*
all necessary elements to handle interactions
*/
const $form = $('#editor-form');
const $bookslist = $('#list');
const $removeModal = $('.delete-modal');
const $rmRemove = $removeModal.find('.remove');
const $rmCancel = $removeModal.find('.cancel');
const $sortRadios = $('input[name=sorting]');
const $searchForm = $('#search-form');
const $searchInput = $('#search-input');

/*
load and render initial state of library
*/
let library = localStorage.getItem('library') ? JSON.parse(localStorage.getItem('library')) : [];
renderLibrary($bookslist,library);

/*
init variables to store current sorting field and index of book that will be removed
*/
let sortingFiled = $sortRadios.filter(':checked').val();
let bookToDelete = -1;

/*
handle sorting radios changes
*/
$sortRadios.on('change',event => {
  sortingFiled = $sortRadios.filter(':checked').val();
  if (sortingFiled === 'book-name') {
    sortLibraryByName(library);
  } else {
    sortLibraryByAuthor(library);
  }
  renderLibrary($bookslist,library);
});

/*
handle form submit
*/
$form.on('submit', event => {
  event.preventDefault();
  const book = getFormData($form);
  const finded = library.findIndex( item => item['book-name'] === book['book-name']);
  if (finded === -1) {
    insertToLibrary(library,book);
    if (sortingFiled === 'book-name') {
      sortLibraryByName(library);
    } else {
      sortLibraryByAuthor(library);
    }
  } else {
    library[finded] = book;
  }
  $form[0].reset();
  renderLibrary($bookslist,library);
  localStorage.setItem('library',JSON.stringify(library));
});

/*
handle click on remove button on book card
*/
$('body').on('click','.remove-button a', event => {
  bookToDelete = $(event.currentTarget).data('index');
  $removeModal.show();
})

/*
handle click on remove button in modal window
*/
$rmRemove.on('click', event => {
  event.preventDefault();
  removeFromLibrary(library,bookToDelete);
  bookToDelete = -1;
  renderLibrary($bookslist,library);
  localStorage.setItem('library',JSON.stringify(library));
  $removeModal.hide();
});

/*
handle click on cancel button in modal window
*/
$rmCancel.on('click', event => {
  event.preventDefault();
  bookToDelete = -1;
  $removeModal.hide();
});

/*
handle click on edit button on book card
*/
$('body').on('click','.buttons a', event => {
  const index = $(event.currentTarget).data('index');
  const data = library[index];
  loadToForm(data);
  $('html, body').animate({
        scrollTop: $form.offset().top
    }, 500);
});

/*
handle search form submit
*/
$searchForm.on('submit', event => {
  event.preventDefault();
  const booksToSearch = $bookslist.find('.book');
  const phraseToSearch = $searchInput.val().toLowerCase();
  $.each(booksToSearch, function() {
    if ($(this).find('.name').text().toLowerCase().indexOf(phraseToSearch) === -1) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
});
