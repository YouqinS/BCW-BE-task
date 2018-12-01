'use strict';

const frm = document.querySelector('#mediaform');
const updatefrm = document.querySelector('#updateform');
const list = document.querySelector('#imagelist');
/*
const img = document.querySelector('#image');
const aud = document.querySelector('#aud');
const vid = document.querySelector('#vid');
*/

const fillUpdate = (image) => {
   // console.log(image);
    document.querySelector('#updateform input[name=title]').value = image.title;
    document.querySelector('#updateform input[name=details]').value=image.details;
    //document.querySelector('#updateform button').removeAttribute('disabled');
};



const getImages = () => {
    fetch('/images').then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        // clear list before adding upated data
        list.innerHTML = '';
        json.forEach((image) => {
            const li = document.createElement('li');
            const title = document.createElement('h3');
            const category = document.createElement('h4');
            const details = document.createElement('p');
            title.innerHTML = 'title: ' + image.title;
            category.innerHTML= 'category: ' + image.category;
            details.innerHTML= 'details: ' + image.details;
            li.appendChild(title);
            li.appendChild(category);
            li.appendChild(details);
            const img = document.createElement('img');
            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = 'Delete';
            btnDelete.style.width = '80px';
            btnDelete.style.height = '30px';
            btnDelete.style.margin = '20px';
            btnDelete.style.padding = '2px';
            btnDelete.style.backgroundColor = 'red';

            const btnUpdate = document.createElement('button');
            btnUpdate.innerHTML = 'Update';
            btnUpdate.style.width = '80px';
            btnUpdate.style.height = '30px';
            btnUpdate.style.margin = '20px';
            btnUpdate.style.padding = '2px';

            const imgSrc = img.src = 'thumbs/' + image.thumbnail;
            img.addEventListener('click', () => {
                fillUpdate(image);
            });
            li.appendChild(img);
            li.appendChild(btnDelete);
            li.appendChild(btnUpdate);
            list.appendChild(li);
            const imgID = image.t_ID;
            btnDelete.addEventListener('click', ()=>{deleteImage(imgSrc,  imgID)});
            btnUpdate.addEventListener('click', () => {
                li.appendChild(updatefrm);
                updatefrm.removeAttribute('hidden');
                const btnSubmitUpdate = document.getElementById('submitUpdate');
                 btnSubmitUpdate.addEventListener('click', (evt)=>{
                     evt.preventDefault();
                     updateImage(imgID);
                     }); //updatefrm.style.visibility = 'hidden';
            });
        });
    });
};

const sendForm = (evt) => {
    evt.preventDefault();
    const fd = new FormData(frm);
    const settings = {
        method: 'post',
        body: fd,
    };

    fetch('/upload', settings).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        // update list
        getImages();
    });
};
frm.addEventListener('submit', sendForm);




getImages();

const deleteImage = (imgSrc, imageID) =>{
    console.log('deleting img' + imgSrc);
    const thumbnail = imgSrc.split('/')[1]; //split img src from thumbnail string
    console.log(thumbnail);
    console.log(imageID);

    fetch('/image/' + imageID, {method: 'DELETE'}).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        getImages();
    });
};


const updateImage = (imageID)=>{
    console.log('updating img' + imageID);

     const title = document.querySelector('#updateform input[name="title"]').value;
     const category = document.querySelector('#updateform input[name="category"]').value;
     const details = document.querySelector('#updateform input[name="details"]').value;

    const settings = {
        method: 'PATCH',
        // credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            category: category,
            details: details
        })


    };

    fetch('/images/' + imageID, settings).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        getImages();
    });

};



//search for content
const search = () =>{
    const searchText = document.querySelector('#searchForm input[name="search"]').value;
    const field = document.getElementById('field').value;

    console.log('search text: ' + searchText);
    console.log('field: ' + field);


    const settings = {
        method: 'GET'
    };
    fetch(`/search/:${field}/:${searchText}`, settings).then((response) => {
        return response.json();
    }).then((json) => {
        displaySearchResult(json);
    });
};


const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', (event) => {event.preventDefault(); search();});




const displaySearchResult =(images) => {

    //
    // console.log('searching result...');
    //
    // fetch('/search').then((response) => {
    //     return response.json();
    //
    // }).then((images) => {

        console.log(images);

        images.forEach(image=>{

            list.innerHTML = '';

        const li = document.createElement('li');
        const title = document.createElement('h3');
        const category = document.createElement('h4');
        const details = document.createElement('p');
        title.innerHTML = 'title: ' + image.title;
        category.innerHTML= 'category: ' + image.category;
        details.innerHTML= 'details: ' + image.details;
        li.appendChild(title);
        li.appendChild(category);
        li.appendChild(details);
        const img = document.createElement('img');
        img.src = 'thumbs/' + image.thumbnail;

        li.appendChild(img);
        list.appendChild(li);

        })

   // });
};
//document.querySelector('#searchButton').addEventListener('click', displaySearchResult);

getImages();

