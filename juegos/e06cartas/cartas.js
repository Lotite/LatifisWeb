let seleccionado = null
let parejas = 0;

//Renderiza los datos de la pantalla
function render(){
    document.querySelector("h3").innerText = `Parejas encontrados: ${parejas}`
    //Verifica si ya se emparejaron los 6 pares de cartas
    if(parejas>=6){
        document.getElementById("notificacion").style.backgroundColor = "rgb(72, 143, 27)"
        document.getElementById("notificacion").style.transform = "translateY(20px)"
        document.querySelector("button").addEventListener("click",()=>{
            location.reload();
        })
    }
}

//Esta funcion crea un objeto donde almacena todos los datos de las cookies
function obtenerCookies(){
    const objCookies = {};
    const cookies = document.cookie.replaceAll(" ","").split(";");
    cookies.forEach(cookie=>{
        const [key,value] = cookie.split("=");
        objCookies[key] = value;
    })
    return objCookies;
}
function guardarCookies(key,value){
    document.cookie = `${key}=${value}`
}

//Esta es un objeto carta que crea un elemento carta y le añade todos los eventos antes de imprimirlo en la pantalla
class Carta {
    #num;
    #carta;
    #funRotar;
    #selecTemporal = null;
    #lado = "espalda"
    constructor(num) {
        this.#num = num
        this.#carta = this.#crearCarta();
        this.#funRotar = this.#rotar.bind(this);
    }

    //Crea el elemento carta para después añadirle los eventos
    #crearCarta() {
        const td = document.createElement("td")
        td.innerHTML = `<div class="carta"></div>`
        return td;
    }
    //Devuelve el elemento carta para añadirlo a la pantalla
    imprimir() {
        this.#añadirEvento(this.#carta)
        return this.#carta;
    }

    //Añade los eventos al elemento carta
    #añadirEvento() {
        this.#carta.addEventListener("click", this.#funRotar)
    }
    //Elimina los eventos al elemento carta
    #eliminarEvento() {
        this.#carta.removeEventListener("click", this.#funRotar)
    }


   //Verifica el estado de la carta para ver en qué grados rotarlo y qué imagen poner
    #rotar() {
        if (this.#lado == "espalda") {
            this.#rotacion(`imagenes/c${this.#num}.png`, 0, 180, 180);
           this.#lado = "frontal";
            this.#aciones();
        } else {
            this.#lado = "espalda";
            this.#rotacion("carta.png", 180, 360, 0);
            if(seleccionado && seleccionado.#carta==this.#carta){
                seleccionado = false;
            }
        }
    }

    //Funcion para rotar la carta con animacion
    #rotacion(imagen, inicio, medio, final) {
        const carta = this.#carta.firstChild;
        carta.style.transform = `perspective(700px) rotateY(${inicio + 90}deg)`
        setTimeout(() => {
            carta.style.transition = "all 300ms linear,background-image 0ms ease-in-out"
            carta.style.backgroundImage = `url(${imagen})`
            carta.style.transform = `perspective(700px) rotateY(${medio}deg)`
            carta.style.transform = `rotateY(${final}deg)`;
            carta.style.transition = "all 300ms linear,background-image 0ms ease-in-out"
        }, 300)
    }

    //Esta función verificará si ya se seleccionó una carta
    #aciones() {
        if (seleccionado) {
            //si ya hay una carta seleccionada lo guardara en una variable temporal y vaciara la global para permitir otras selecciones
            this.#selecTemporal = seleccionado;
            seleccionado = false;
            //Si las cartas son iguales, elimina y aumenta el contador de parejas
            if (this.#esIgual()) {
                this.#eliminarEvento();
                this.#selecTemporal.#eliminarEvento();
                parejas++;
                render()
            } else {
                setTimeout(() => {
                    this.#rotar()
                    this.#selecTemporal.#rotar();
                }, 1000)
            }

        } else {
            seleccionado = this;
        }
    }




    #esIgual() {
        return this.#num === this.#selecTemporal.#num && this.#carta !== this.#selecTemporal.#carta;
    }
}

//Codigo de creacion
const cookies = obtenerCookies();
//verificamos si ya hay un nombre en las cookies
if(cookies.nombre && cookies.visitas){
    //uso un array desordenado para colocar las cartas en una forma aleatoria
    [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].sort(() => { return Math.random() > 0.5 ? 1 : -1 }).forEach((num, index) => {
        //Esto crea una nueva fila en la tabla cuando el anterior ya almacenó 4 cartas
        if (index % 4 == 0 && index != 12) {
            document.querySelector("table").append(document.createElement("tr"))
        }
        //Aquí crearemos un objeto carta que después de añadir todos los eventos necesarios para añadirlo a la fila
        document.querySelector("table").lastChild.append((new Carta(num)).imprimir())
    })
    //Aquí sumamos al contador de visitas uno cuando se carga la página
    guardarCookies("visitas",parseInt(cookies.visitas)+1)
    document.querySelector("h2").innerHTML = `Bienvenido ${cookies.nombre}`
    document.querySelector("p").innerText = `Has visitado esta pagina ${cookies.visitas} veces`
}else{
    //Si no hay cookies, se muestra el formulario para ingresar el nombre
    document.body.innerHTML= `
        <div class="mx-auto" style="width:500px;margin-top:50px">
            <h3 class="text-center">Ingresa tu nombre</h3>
            <input type="text" placeholder="Tu nombre" >
            <button class="btn btn-light btn-outline-primary btn-lg">Jugar</button>
        </div>
    `
    guardarCookies("visitas",1)
    document.querySelector("button").addEventListener("click",()=>{
        document.cookie = `nombre=${document.querySelector("input").value}`
        location.reload();
    })
}



