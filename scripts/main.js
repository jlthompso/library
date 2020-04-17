let library = [];
const table = document.querySelector("tbody");
const form = document.querySelector("#fAddBook");

if (storageAvailable('localStorage')) {
    if (!localStorage.getItem("library")) {
        storeLibrary(library);
    } 
    else {
        library = JSON.parse(localStorage.getItem("library"));
        console.log(library);
    }
}
else {
    alert("Library will not persist if browser is closed.");
}

render();

form.addEventListener("submit", function(e) {
    let fTitle = "";
    let fAuthor = "";
    let fPages = null;
    let fIsRead = false;
    for (let i = 0; i < form.elements.length; i++) {
        switch (form.elements[i].id) {
            case "fTitle":
                fTitle = form.elements[i].value;
                break;
            case "fAuthor":
                fAuthor = form.elements[i].value;
                break;
            case "fPages":
                fPages = form.elements[i].value;
                break;
            case "fIsRead":
                fIsRead = form.elements[i].checked;
                break;
        }
    }
    addBookToLibrary(fTitle, fAuthor, fPages, fIsRead);
    render();
    e.preventDefault(); // don't reload page when form is submitted
});

function render() {
    table.innerHTML = ""; // redraw entire table
    let index = 0;
    library.forEach(book => {
        let row = table.insertRow();
        let title = row.insertCell(0);
        let author = row.insertCell(1);
        let pages = row.insertCell(2);
        let status = row.insertCell(3);
        let remove = row.insertCell(4);
        title.innerHTML = book.title;
        title.className = "title";
        author.innerHTML = book.author;
        pages.innerHTML = book.numPages;
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "X";
        removeButton.className = "removeButton";
        removeButton.id = "removeButton" + index;
        remove.appendChild(removeButton);
        removeButton.addEventListener("click", function() {
            let idx = this.id.charAt(this.id.length - 1);
            library.splice(Number(idx), 1);
            storeLibrary(library);
            render();
        });
        let changeStatusButton = document.createElement("button");
        book.isRead ? changeStatusButton.innerHTML = "Yes" : changeStatusButton.innerHTML = "No";
        changeStatusButton.className = "changeStatusButton";
        changeStatusButton.id = "changeStatusButton" + index;
        changeStatusButton.addEventListener("click", function() {
            let idx = this.id.charAt(this.id.length - 1);
            let b = library[idx];
            b.isRead = !b.isRead;
            storeLibrary(library);
            b.isRead ? this.innerHTML = "Yes" : this.innerHTML = "No";
        });
        status.appendChild(changeStatusButton);
        index++;
    });
}

function Book(title, author, numPages, isRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead; // false == not read
}

function addBookToLibrary(title, author, numPages, isRead) {
    library.push(new Book(title, author, numPages, isRead));
    storeLibrary(library);
}

function storeLibrary(library) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem("library", JSON.stringify(library));
    }
    else {
        console.log("Library changes will not be saved if browser is closed!");
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}