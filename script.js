var library=JSON.parse(localStorage.getItem('library'));
const libraryDisplay=document.querySelector('.library');
const addCard=document.querySelector('.add-card');
const body=document.querySelector('body');
var idCounter=parseInt(localStorage.getItem('counter'));

idCounter=Number.isInteger(idCounter)?idCounter:0;
library=library==null?[]:library;

showRetrived();

function showRetrived(){
    library.forEach(i=>addTOLibraryDisplay(i));
}
function showForm(){
    form=document.createElement('div');
    form.setAttribute('class','form-container');
    form.innerHTML=`<form>
    <label for="name" >Title:</label><span id='title-error'>Titles cannot be empty or longer than 60 character.</span>
    <input 
    type="text"
    name="name"
    placeholder="Enter the book's title..."
    id="title"
    >
    <label for="author" >Author:</label><span id='author-error'>Name cannot be empty or longer than 40 character.</span>
    <input 
    type="text"
    name="author"
    placeholder="Enter the author's name..."
    id="author"
    >
    <label for="pages" >Pages:</label><span id='pages-error'>Pages cannot be 0 or larger than 99999</span>
    <input 
    type="text"
    name="pages"
    placeholder="Enter the number of pages"
    id="pages"
    >
    <label for="completed" id="checkbox-label">read: </label>
    <input
    type="checkbox" 
    name="completed"
    id="checkbox">
        <div class="form-button add">Add</div>
        <div class="form-button cancel">Cancel</div>
</form>`;
body.appendChild(form);
cancel=document.querySelector('.cancel');
add=document.querySelector('.add');
cancel.addEventListener('click',removerForm);
add.addEventListener('click',addToLibrary);
}
function removerForm(){
    form.remove();
}

function addToLibrary(){
    formTitle=document.getElementById('title').value;
    formAuthor=document.getElementById('author').value;
    formPages=document.getElementById('pages').value;
    if(document.getElementById('checkbox').checked)
    formRead='Read';
    else
    formRead='Plan to read';
    if(!checkPages()){
        document.getElementById('pages-error').setAttribute('style','display:inline-block');
    }
    else{
        document.getElementById('pages-error').setAttribute('style','display:none');
    }
    if(!checkTitle()){
        document.getElementById('title-error').setAttribute('style','display:inline-block');
    }
    else{
        document.getElementById('title-error').setAttribute('style','display:none');
    }
    if(!checkAuthor()){
        document.getElementById('author-error').setAttribute('style','display:inline-block');
    }
    else{
        document.getElementById('author-error').setAttribute('style','display:none');
    }

    if(checkAuthor()&&checkPages()&&checkTitle()){
        library.push(new Book(formTitle,formAuthor,formPages,formRead));
        removerForm();
        addTOLibraryDisplay(library[library.length-1]);
        updateStorage();
    }   

}

function checkPages(){
    return formPages>0&&formPages<100000;
}
function checkTitle(){
    return formTitle.length>0&&formTitle.length<61;
}
function checkAuthor(){
    return formAuthor.length>0&&formAuthor.length<41;
}

function addTOLibraryDisplay(book){
    temp=document.createElement('div');
    temp.setAttribute('class','card book');
    temp.setAttribute('id',`${book.id}`)
    temp.innerHTML=`
        <div class="name">${book.title}</div>
        <div class="author">${book.author}</div>
        <div class="pages">Pages: ${book.pages}</div>
        <div class="card-button read">${book.read}</div>
        <div class="card-button remove">Remove</div>`;
    if(book.read=='Read'){
    temp.querySelector('.read').setAttribute('style','background-color:rgb(0, 187, 31);');
    }
    else{
    temp.querySelector('.read').setAttribute('style','background-color: rgb(27, 74, 230);');
    }
    libraryDisplay.insertAdjacentElement('afterbegin',temp);
    addListeners(temp);
}

function Book(title,author,pages,read){
    this.title=title;
    this.author=author;
    this.pages=pages;
    this.read=read;
    this.id=idCounter++;
}

function addListeners(bookDisplay){
    let remove=bookDisplay.querySelector('.remove');
    let readState=bookDisplay.querySelector('.read');

    remove.addEventListener('click',()=>{
        removeFromLibrary(bookDisplay);
        bookDisplay.remove();
        updateStorage();
    });

    readState.addEventListener('click',()=>{
        let id=bookDisplay.id;
        let index=library.findIndex(i=>i.id==id);
        if(readState.textContent=='Read'){
        readState.textContent='Plan to read';
        library[index].read='Plan to read';
        readState.setAttribute('style','background-color: rgb(27, 74, 230);');
        }
        else{
        readState.textContent='Read';
        library[index].read='Read';
        readState.setAttribute('style','background-color:rgb(0, 187, 31);');
        }
        updateStorage();
    })
}
function removeFromLibrary(removeButton){
    let id=parseInt(removeButton.id);
    let index=library.findIndex(i=>i.id==id);
    library.splice(index,index+1);
    updateStorage();
}
function updateStorage(){
    localStorage.setItem('library', JSON.stringify(library));
    localStorage.setItem('counter',idCounter);
}
addCard.addEventListener('click',showForm);