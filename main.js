//Boton de 'refresh'
const btnRefresh = document.querySelector('.refresh');
btnRefresh.addEventListener('click', loadRandomMishis);

//Span error
const spanContainer = document.querySelector('.span-container')
const spanInfo = document.querySelector('.info');
const closeSpanInfo = document.querySelector('#close')

closeSpanInfo.addEventListener('click', ()=>{
    spanContainer.classList.add('off');
});

const close = document.getElementById('close');



//ENDPOINTS
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=4';

const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites?limit=20';

const API_URL_FAVOURITES_DELETE = (id)=> `https://api.thecatapi.com/v1/favourites/${id}?`;

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';


// GET

async function loadRandomMishis(){
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random');
    console.log(data);

    const img1 = document.querySelector('#img1');
    img1.src = data[0].url;
    const img2 = document.querySelector('#img2');
    img2.src = data[1].url;
    const img3 = document.querySelector('#img3');
    img3.src = data[2].url;
    const img4 = document.querySelector('#img4');
    img4.src = data[3].url;

    const btnLove1 = document.getElementById('love1');
    const btnLove2 = document.getElementById('love2');
    const btnLove3 = document.getElementById('love3');
    const btnLove4 = document.getElementById('love4');

    btnLove1.onclick = () => saveFavouriteMichi(data[0].id);
    btnLove2.onclick = () => saveFavouriteMichi(data[1].id);
    btnLove3.onclick = () => saveFavouriteMichi(data[2].id);
    btnLove4.onclick = () => saveFavouriteMichi(data[3].id);

};
async function loadFavouriteMishis(){
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            // Mandamos la API por una especificacion en los "headers" en vez de ponerla directamente en la URL
            "X-API-KEY": "live_4K25xEWsSo7fAvZp0l0uJ8prsp4qUzvVI1OEp4rbhBWVjBW7liJ0gBYxgMQX14Db"
        }
    });

    if(res.status !== 200){ // Si salio mal =(
        const data = await res.text();
        spanContainer.classList.remove('off');
        spanInfo.innerText = `Hubo un error ${res.status}: ${data}`;
    } else { // Si todo sale bien =), maquetamos:
          /*<article>
                <img>
                <button class="btn nlove">-</button>
            </article>*/
        const data = await res.clone().json();
        const toRender = [];
        const favouritesSection = document.querySelector('#favoriteMichis');
        const favouritesContainer = document.querySelector('.containerF');

        //Reiniciamos TODA la section cada vez que se invoque esta fuction
        favouritesContainer.innerHTML = "";

        data.forEach((element)=>{
            const art = document.createElement('article');
            const img = document.createElement('img');
            img.classList.add('image');
            const btn = document.createElement('button');
            btn.classList.add('btn')
            btn.classList.add('nlove')
            const textBtn = document.createElement('i');

            textBtn.classList.add('fa-solid');
            textBtn.classList.add('fa-heart');
            

            // Funcionalidad boton DELETE
            btn.append(textBtn);
            btn.onclick = () => deleteFavouriteMichi(element.id);

            img.src = element.image.url;

            art.append(img, btn);
            toRender.push(art);
        });
        favouritesContainer.append(...toRender);
        favouritesSection.append(favouritesContainer);
    }

    const data = await res.json();
    console.log('Favorite');
    console.log(data);
};


// POST

async function saveFavouriteMichi(id){
    const res = await fetch(API_URL_FAVOURITES, {
        //Cuando especificamos otro metodo distinto a 'GET'(el de por defecto) agregamos
        method:'POST',
        headers:{
            "Content-Type": "application/json",
            "X-API-KEY": "live_4K25xEWsSo7fAvZp0l0uJ8prsp4qUzvVI1OEp4rbhBWVjBW7liJ0gBYxgMQX14Db"
        },
        body: JSON.stringify({
            image_id: id
        })
    });
  
    if(res.status !== 200){
        const data = await res.text();
        spanContainer.classList.remove('off');
        spanInfo.innerText = `Hubo un error ${res.status}: ${data}`;
    } else{
        console.log('Michi GUARDADO')
        //Apenas se guarde, se cargara SIN REFRESCAR LA PAGINA la section completa:
        //OJO: Cada vez que suceda eso debemos limpiar TODO lo que habia antes
        loadFavouriteMishis();
    }
    const data = await res.json();
    console.log(data);

};

//DELETE

async function deleteFavouriteMichi(id){
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        //En este caso no necesitamos ni HEADER ni BODY, por cuestiones de los creadores.
        //Pero agregamos "headers" para la "api-key"
        method:'DELETE',
        headers:{
            "X-API-KEY": "live_4K25xEWsSo7fAvZp0l0uJ8prsp4qUzvVI1OEp4rbhBWVjBW7liJ0gBYxgMQX14Db"
        }
     
    });
  
    if(res.status !== 200){
        const data = await res.text();
        spanContainer.classList.remove('off');
        spanInfo.innerText = `Hubo un error ${res.status}: ${data}`;
    } else{
        console.log('Michi ELIMINADO')
        //Apenas se elimine, se cargara SIN REFRESCAR LA PAGINA la section completa:
        //OJO: Cada vez que suceda eso debemos limpiar TODO lo que habia antes
        loadFavouriteMishis();
    }
    const data = await res.json();
    console.log(data);

};

//UPLOAD  

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');

    //Todos los valores provenientes del input del form, pasan con instancia de "FormData":
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method:'POST',
        headers:{
            //"Content-type": "multipart/form-data" no es necesario por formData
            "X-API-KEY": "live_4K25xEWsSo7fAvZp0l0uJ8prsp4qUzvVI1OEp4rbhBWVjBW7liJ0gBYxgMQX14Db"
        },
        body: formData,
    });
    const data = await res.json();

    if(res.status !== 201){
        const data = await res.text();
        spanContainer.classList.remove('off');
        spanInfo.innerText = `Hubo un error ${res.status}: ${data}`;
    } else{
        console.log('Michi SUBIDO')
        console.log({data});
        console.log(data.url)
        saveFavouriteMichi(data.id)
    }
    

};

function showPreview(event){
    if(event.target.files.length > 0){
      const src = URL.createObjectURL(event.target.files[0]);
      const preview = document.getElementById("file-ip-1-preview");
      const close = document.getElementById('close');
     
      preview.src = src;
      preview.style.display = "block";
      
      document.getElementById('uploadingForm').style.height = "600px";
    }
  }



loadRandomMishis();
loadFavouriteMishis();



/*
UTILIZANDO PROMESAS

//Nos devuelve una promesa
fetch(URL)
    //Cargamos la respuesta en algo entendible para JS
    .then(res => res.json())
    
    //Una vez hecho eso, tenemos lista la 'data'
    .then(data => {
        //Esa info la pasamos a 'src' de img
        const img = document.querySelector('img');
        img.src = data[0].url;
    })
*/