let library = [];
const table = document.querySelector("tbody");
const form = document.querySelector("#fAddBook");

addBookToLibrary("title1", "author1", 50, false);
addBookToLibrary("title2", "author2", 65, true);
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
            render();
        });
        let changeStatusButton = document.createElement("button");
        book.isRead ? changeStatusButton.innerHTML = "Yes" : changeStatusButton.innerHTML = "No";
        changeStatusButton.className = "changeStatusButton";
        changeStatusButton.id = "changeStatusButton" + index;
        changeStatusButton.addEventListener("click", function() {
            let idx = this.id.charAt(this.id.length - 1);
            let b = library[idx];
            b.toggleReadStatus();
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
    this.info = function() {
        let s;
        this.isRead ? s = "read" : s = "not read yet";
        return `${title} by ${author}, ${numPages} pages, ${s}`;
    }
    this.toggleReadStatus = function() {
        this.isRead = !this.isRead;
    }
}

function addBookToLibrary(title, author, numPages, isRead) {
    library.push(new Book(title, author, numPages, isRead));
}