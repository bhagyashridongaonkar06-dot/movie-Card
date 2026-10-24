const cl = console.log;

const showMovieForm = document.getElementById("showMovieForm");
const movieCard = document.getElementById("movieCard");
const movieForm = document.getElementById("movieForm");
const movieName = document.getElementById("movieName");
const movieImage = document.getElementById("movieImage");
const movieDescription = document.getElementById("movieDescription");
const movieRating = document.getElementById("movieRating");
const movieGenre = document.getElementById("movieGenre");
const addMovie = document.getElementById("addMovie");
const updateMovie = document.getElementById("updateMovie");
const spinner = document.getElementById("spinner");
const backDrop = document.getElementById("backDrop");
const movieYear = document.getElementById('movieYear')
const closeForm = document.querySelectorAll(".closeForm");

const base_url = `https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/`;
const movie_url = `${base_url}/movies.json`;

//localState

let localState = {
  movieArr: [],
  updateid: null,
};

//setRating

function setRating(rating){
    if(rating > 7){
        return "badge-success"
    }else if(rating > 5 && rating <= 7){
        return "badge-warning"
    }else{
        return "badge-danger"
    }
}

//snackbar

function snackbar(msg, icon) {
  Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000,
    });
}

//formshowHandler

function formshowHandler(){
    movieForm.classList.toggle('active')
    backDrop.classList.toggle('active')

    let heading = document.querySelector('#movieForm .card-header h4')
    heading.innerText = "Add Movie"

    movieForm.reset()

    addMovie.classList.remove('d-none')
    updateMovie.classList.add('d-none')
}

showMovieForm.addEventListener('click', formshowHandler)
closeForm.forEach(e => e.addEventListener('click', formshowHandler))


//spinnerHandler

function spinnerHandler(flag){
    if(flag){
        spinner.classList.remove('d-none')
    }else{
        spinner.classList.add('d-none')
    }
}

//nestedObjtoArr

function nestedObjtoArr(obj){
    for (const key in obj) {
        obj[key].id = key
        localState.movieArr.unshift(obj[key])
    }
}

//rendering

function rendering(arr){
    let res = '';

    arr.forEach(movies => {
        res += `<div class="col-md-3 mt-5" id="${movies.id}">
                <div class="card h-100 net-sec-btn movieCard">
                    <div class="card-header ml-0 pl-0 d-flex justify-content-between align-items-center">
                        <div class="col-10">
                            <h3 class="m-0">${movies.title}</h3>
                            <small class="m-0">${new Date(movies.createdAt).toLocaleString('en-IN')}</small>
                        </div>

                        <div class="col-2">
                            <h4 class="m-0"><span class="badge ${setRating(movies.rating)}">${movies.rating}</span></h4>
                        </div>
                        
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${movies.poster}" alt="">

                            <figcaption>
                                <h5 class="m-0">${movies.title}</h5>
                                <h5 class="m-0"><span>Genre : ${movies.genre}</span></h5>
                                <h5 class="m-0">Year : ${movies.year}</h5>
                                <p class="m-0">${movies.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                        ${movies.updatedAt ? `<small class="m-0 pl-4">${new Date(movies.updatedAt).toLocaleString('en-IN')}</small>` : ''}

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline-info net-pri-btn">Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-outline-info net-sec-btn">Remove</button>
                    </div>
                </div>
            </div>`
            // cl(movies.updatedAt)
    });
    movieCard.innerHTML = res;
}

//fetchAllMovies

function fetchAllMovies(){
    spinnerHandler(true)
    fetch(movie_url,{
        method : "GET",
        body : null,
        headers : {
            "content-type" : "application/json",
            "auth" : "JWT token" 
        }
    })
    .then(res =>{
        if(!res.ok){
            throw new error(` ${res.status}`)
        }
        return res.json()
    })
    .then(data =>{
        // cl(data)
        nestedObjtoArr(data)
        rendering(localState.movieArr)
    })
    .catch(err =>{
        cl(err)
        snackbar(err, 'error')
    })
    .finally(()=>{
        spinnerHandler()
    })
}

fetchAllMovies()


//create

function onSubmit(eve){
    eve.preventDefault();

    let newObj = {
        title : movieName.value,
        description : movieDescription.value,
        poster : movieImage.value,
        rating : movieRating.value,
        year : movieYear.value,
        createdAt : Date.now(),
        updatedAt : null,
        genre : movieGenre.value
    }
    // cl(newObj)
    movieForm.reset()
    spinnerHandler()
    
    fetch(movie_url, {
        method : "POST",
        body : JSON.stringify(newObj),
        headers : {
            "content-type" : "application/json",
            "auth" : "JWT token" 
        }
    })
    .then(res =>{
        if(!res.ok){
            throw new error(`${res.status}`)
        }
        return res.json()
    })
    .then(data =>{
        newObj.id = data.name
        localState.movieArr.unshift(newObj)

        let movie = document.createElement('div')
        movie.className = 'col-md-3 mt-5'
        movie.id = newObj.id
        movie.innerHTML = `
                <div class="card h-100 net-sec-btn movieCard">
                    <div class="card-header ml-0 pl-0 d-flex justify-content-between align-items-center">
                        <div class="col-10">
                            <h3 class="m-0">${newObj.title}</h3>
                            <small class="m-0">${new Date(newObj.createdAt).toLocaleString('en-IN')}</small>
                        </div>

                        <div class="col-2">
                        <h4 class="m-0"><span class="badge ${setRating(newObj.rating)}">${newObj.rating}</span></h4>
                        </div>
                        
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0 px-0">
                            <img src="${newObj.poster}" alt="">
                            
                            <figcaption>
                            <h5 class="m-0">${newObj.title}</h5>
                            <h5 class="m-0"><span>Genre : ${newObj.genre}</span></h5>
                                <h5 class="m-0">Year : ${newObj.year}</h5>
                                <p class="m-0">${newObj.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                         ${newObj.updatedAt ? `<small class="m-0 pl-4">${new Date(newObj.updatedAt).toLocaleString('en-IN')}</small>` : ''}


                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline-info net-pri-btn">Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-outline-info net-sec-btn">Remove</button>
                        </div>
                        </div>
                        `
        formshowHandler()
        movieCard.prepend(movie)
        snackbar(`Movie with name ${newObj.title} created successfully`, 'success')
    })
    .catch(err =>{
        cl(err)
        snackbar(err, 'error')
    })
    .finally(()=>{
        spinnerHandler()
    })
}

//edit
function onEdit(ele){
    let editId =ele.closest('.col-md-3').id;
    // cl(editId)
    localState.updateid = editId

    let editObj = localState.movieArr.find(e => e.id=== editId)
    formshowHandler()

    movieName.value = editObj.title
    movieGenre.value = editObj.genre
    movieDescription.value = editObj.description
    movieImage.value = editObj.poster
    movieYear.value = editObj.year
    movieRating.value = editObj.rating

    let heading = document.querySelector('#movieForm .card-header h4')
        heading.innerText = "Update Movie"

    addMovie.classList.add('d-none')
    updateMovie.classList.remove('d-none')
}

function onUpdate(){
    let updateId = localState.updateid;

    let oldobj= localState.movieArr.find(e => e.id === updateId)

   
    
    let update_url = `${base_url}/movies/${updateId}.json`
    
    let updateObj = {
        ...oldobj,
        title : movieName.value,
        description : movieDescription.value,
        poster : movieImage.value,
        rating : movieRating.value,
        year : movieYear.value,
        updatedAt : Date.now(),
        genre : movieGenre.value,
    }
    
    movieForm.reset()
    spinnerHandler(true)
    fetch(update_url, {
        method : "PATCH",
        body : JSON.stringify(updateObj),
        headers : {
            "content-type" : "application/json",
            "auth" : "JWT token" 
        }
    })
    .then(res =>{
        if(!res.ok){
            throw new Error(`http : ${res.status}`)
        }
        return res.json()
    })
    .then(data =>{
    
        let idx = localState.movieArr.findIndex(e => e.id === updateId)
        localState.movieArr[idx] = updateObj

        formshowHandler()

        let updMovie = document.getElementById(updateId)
        updMovie.innerHTML = `
                <div class="card net-sec-btn movieCard">
                    <div class="card-header ml-0 pl-0 d-flex justify-content-between align-items-center">
                        <div class="col-10">
                            <h3 class="m-0">${updateObj.title}</h3>
                            <small class="m-0">${updateObj.createdAt}</small>
                        </div>

                        <div class="col-2">
                            <h4 class="m-0"><span class="badge ${setRating(updateObj.rating)}">${updateObj.rating}</span></h4>
                        </div>
                        
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${updateObj.poster}" alt="">

                            <figcaption>
                                <h5 class="m-0">${updateObj.title}</h5>
                                <h5 class="m-0"><span>Genre : ${updateObj.genre}</span></h5>
                                <h5 class="m-0">Year : ${updateObj.year}</h5>
                                <p class="m-0">${updateObj.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                     ${updateObj.updatedAt ? `<small class="m-0 pl-4">${new Date(updateObj.updatedAt).toLocaleString('en-IN')}</small>` : ''}


                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-sm btn-outline-info net-pri-btn">Edit</button>
                        <button type="button" class="btn btn-sm btn-outline-info net-sec-btn">Remove</button>
                    </div>
                </div>
            `
        snackbar(`Movie with name ${updateObj.title} updated successfully`, 'success')
    })
    .catch(err =>{
        cl(err)
        snackbar(err,'error')
    })
    .finally(()=>{
        spinnerHandler()
    })
}


function onRemove(ele){
    let removeId = ele.closest('.col-md-3').id;
    
    let remove_url = `${base_url}/movies/${removeId}.json`

    
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    fetch(remove_url,{
        method : "DELETE",
        body : null,
        headers : {
            "content-type" : "application/json",
            "auth" : "JWT token" 
        }
    })
    .then(res =>{
        if(!res.ok){
            throw new Error(`http : ${res.status}`)
        }
        return res.json()
    })
    .then(data =>{
        let idx = localState.movieArr.findIndex(e => e.id === removeId)
        localState.movieArr.splice(idx, 1)

        ele.closest('.col-md-3').remove()

        snackbar(`movie with id ${removeId} removed successfully`, 'success')
    })
    .catch(err =>{
        cl(err)
        snackbar(err, 'error')
    })
    .finally(()=>{
        spinnerHandler()
    })
  }
});
}

movieForm.addEventListener('submit', onSubmit)
updateMovie.addEventListener('click', onUpdate)