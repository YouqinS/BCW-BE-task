'use strict';

/**********************************************************************************************************************/
const frm = document.querySelector('#mediaform');
const updatefrm = document.querySelector('#updateform');
const list = document.querySelector('#imagelist');
/**********************************************************************************************************************/

let originalData = null;
let map = null;
let marker = null;

document.querySelector('#reset-button').addEventListener('click', () => {
  update(originalData);
});

document.querySelector('.modal button').addEventListener('click', (evt) => {
  evt.target.parentNode.classList.add('hidden');
});

/******************************************************************************************************************************/
/*const getImages = () => {
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
            title.innerHTML = image.title;
            category.innerHTML = image.category;
            details.innerHTML = image.details;
            li.appendChild(title);
            li.appendChild(category);
            const img = document.createElement('img');
            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = 'Delete';
            btnDelete.style.width = '50px';
            btnDelete.style.height = '20px';
            btnDelete.style.margin = '20px';
            const btnUpdate = document.createElement('button');
            btnUpdate.innerHTML = 'Update';
            btnUpdate.style.width = '50px';
            btnUpdate.style.height = '20px';
            btnUpdate.style.margin = '20px';
            const imgSrc = img.src = 'thumbs/' + image.thumbnail;

            // img.addEventListener('click', () => {
            //     fillUpdate(image);
            // });
            li.appendChild(img);
            li.appendChild(details);
            li.appendChild(btnDelete);
            li.appendChild(btnUpdate);
            list.appendChild(li);
            const imgID = image.t_ID;
            btnDelete.addEventListener('click', ()=>{deleteImage(imgSrc,  imgID)});
            btnUpdate.addEventListener('click', () => {
                updatefrm.removeAttribute('hidden');
                sendUpdate();
                fillUpdate(image);
                updatefrm.setAttribute('hidden');
            });
        });
    });
};*/

const getData = () => {
    fetch('/images').then(response => {
        return response.json();
    }).then(items => {
        console.log('getting data...');
        console.log(items);
        originalData = items;
        update(items);
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
        //getImages();
        getData();
    });
};


/*send update to database***********************************************************************************************/
const sendUpdate = (evt) => {
    evt.preventDefault();
    // get data from updatefrm and put it to body
    const settings = {
        method: 'patch',
        body: {
            title: '',
            category: 'etc...',
        },
    };
    // app.patch('/images'.... needs to be implemented to index.js (remember body-parser)
    fetch('/images', settings).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        // update list
       // getImages();
        getData();

    });
};

frm.addEventListener('submit', sendForm);
updatefrm.addEventListener('submit', sendUpdate);

//getImages();
getData();

const deleteImage = (imgSrc, imageID) =>{
    console.log('deleting img' + imgSrc);
    const thumbnail = imgSrc.split('/')[1]; //split img src from thumbnail string
    console.log(thumbnail);
    console.log(imageID);

    fetch('/image/' + imageID, {method: 'DELETE'}).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        //getImages();
        getData();
    });
};

//getImages();
getData();



/******************************************************************************************************************************/
/*const imgID = image.t_ID;
const btnDelete = document.getElementById('btnDelete');
const btnUpdate = document.getElementById('btnUpdate');
btnDelete.addEventListener('click', ()=>{deleteImage(imgSrc,  imgID)});
btnUpdate.addEventListener('click', () => {
    updatefrm.removeAttribute('hidden');
    sendUpdate();
    fillUpdate(image);
    updatefrm.setAttribute('hidden');
});*/


//create UI, load image, create title, button...
const createArticle = (image, title, texts) => {
    console.log('creating UI...');
    let text = '';
  for (let t of texts) {
    text += `<p>${t}</p>`;
  }

  return `<img src="${image}" alt="${title}">
                <h3 class="card-title">${title}</h3>
                <p>${text}</p>
                <p><button>View</button></p>
                <p id="btnDelete"><button>Delete</button></p>
                <p id="btnUpdate"><button>Update</button></p> `;
};

const categoryButtons = (items) => {
  items = removeDuplicates(items, 'category');
  console.log(items);
  document.querySelector('#categories').innerHTML = '';
  for (let item of items) {
    const button = document.createElement('button');
    button.class = 'btn btn-secondary';
    button.innerText = item.category;
    document.querySelector('#categories').appendChild(button);
    button.addEventListener('click', () => {
      sortItems(originalData, item.category);
    });
  }
};

const sortItems = (items, rule) => {
  const newItems = items.filter(item => item.category === rule);
  // console.log(newItems);
  update(newItems);
};

/*const getData = () => {
  fetch('/images').then(response => {
    return response.json();
  }).then(items => {
      console.log('getting data...');
      console.log(items);
      originalData = items;
    update(items);
  });

};*/


const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};


/*******  UPDATE UI  ********************************************************************************************************/
const update = (items) => {
    console.log('updating UI...');
    categoryButtons(items);
  document.querySelector('main').innerHTML = '';
  for (let item of items) {
    // console.log(item);
    const article = document.createElement('article');
    const time = moment(item.time);
    article.innerHTML = createArticle(item.thumbnail, item.title, [
      '<small>' + time.format('dddd, MMMM Do YYYY, HH:mm') + '</small>',
      item.details]);
    article.addEventListener('click', () => {
      document.querySelector('.modal').classList.remove('hidden');
      document.querySelector('.modal img').src = item.image;
      document.querySelector('.modal h4').innerHTML = item.title;

        const imgID = item.t_ID;
        const btnDelete = document.getElementById('btnDelete');
        const btnUpdate = document.getElementById('btnUpdate');
        btnDelete.addEventListener('click', ()=>{deleteImage(imgSrc,  imgID)});
        btnUpdate.addEventListener('click', () => {
            updatefrm.removeAttribute('hidden');
            sendUpdate();
            fillUpdate(image);
            updatefrm.setAttribute('hidden');
        });

      resetMap(item);
      document.querySelector('#map').addEventListener('transitionend', () => {
        map.invalidateSize();
      });
    });
    document.querySelector('main').appendChild(article);
  }
};

const initMap = () => {
  map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  getData();
};

const resetMap = (item) => {
  try {
    map.removeLayer(marker);
  } catch (e) {

  }
  const coords = item.coordinates;
  console.log(coords);
  map.panTo([coords.lat, coords.lng]);
  marker = L.marker([coords.lat, coords.lng]).addTo(map);
  map.invalidateSize();
};

initMap();