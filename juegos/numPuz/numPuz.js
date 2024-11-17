class Puz {
    #num;
    #puz;
    #tablero
    #lado
    constructor(num, tablero = { elemento: "", posiciones: [], puzzles: [] }, lado) {
        this.#tablero = tablero;
        this.#num = num;
        this.#lado = lado;
        this.#puz = this.#crearPuz();
        this.#setPosicion();
        this.#puz.addEventListener("click", () => this.#mover());
        this.#tablero.puzzles.push(this);
    }

    imprimir() {
        return this.#puz;
    }

    #crearPuz() {
        const elemento = document.createElement("div")
        elemento.style.width = `calc(100/${this.#lado}*1% - 2px)`;
        elemento.style.height = `calc(100/${this.#lado}*1% - 2px)`;
        elemento.style.fontSize = `calc(400% - ${this.#lado} * 10%)`;
        elemento.classList.add("num")
        elemento.textContent = this.#num
        return elemento;
    }

    #mover(posnum = this.#getPosicion(this.#num)) {
        let pos0 = this.#getPosicion(0);
        let mover;
        if (this.#estanMismaLineaX()) {
            mover = !this.moverOtro(posnum, pos0, 1);
        } else if (this.#estanMismaLineaY()) {
            mover = !this.moverOtro(posnum, pos0, this.#lado);
        }


        if (mover) {
            this.#tablero.moviminetos++;
            pos0 = this.#getPosicion(0);
            this.#tablero.posiciones[pos0] = this.#tablero.posiciones[posnum];
            this.#tablero.posiciones[posnum] = 0;
            this.#setPosicion();
        }
    }


    moverOtro(posnum, pos0, diferencia) {
        if (posnum != pos0 + diferencia && posnum != pos0 - diferencia) {
            let temPuz = pos0 - posnum > 0 ? posnum + diferencia : posnum - diferencia
            this.#tablero.puzzles.find(puz => puz.#num == this.#tablero.posiciones[temPuz]).#mover(temPuz)
        }
    }

    #estanMismaLineaX() {
        return Math.floor(this.#getPosicion(this.#num) / this.#lado) == Math.floor(this.#getPosicion(0) / this.#lado)
    }

    #estanMismaLineaY() {
        return this.#getPosicion(this.#num) % this.#lado == this.#getPosicion(0) % this.#lado
    }


    #setPosicion(posicion = this.#getPosicion(this.#num)) {
        let x = posicion % this.#lado;
        let y = Math.floor(posicion / this.#lado);
        this.#puz.style.transform = `translate(calc(${x * 100}%  +  ${2 * x + 1}px), calc(${y * 100}%  + ${2 * y + 1}px) )`;
    }

    #getPosicion(num) {
        return this.#tablero.posiciones.indexOf(num);
    }
}





class Tablero {
    #num
    #tablero
    #ordenado
    #tiempo = 0;
    #cronometro = setInterval(()=>{
        this.#tiempo++
        document.querySelector("#tiempo1").textContent = this.#imprimirTiempo()
    },1000)
    #funcion = this.#verificarVictoria.bind(this)
    constructor(num) {
        this.#tablero = { elemento: "null", posiciones: [], puzzles: [],moviminetos : 0 }
        this.#num = num;
        this.#tablero.elemento = document.createElement("div")
        this.#tablero.elemento.classList.add("contenedor")
        this.#crearPiezas()
        return this.#tablero.elemento;
    }
    #crearPiezas() {
        this.#tablero.posiciones = this.#range(1, this.#num ** 2);
        this.#tablero.posiciones.forEach(num => {
            if (num == 0) { return; }
            const Tempuz = new Puz(num, this.#tablero, this.#num);
    
            this.#tablero.puzzles.push(Tempuz);
            this.#tablero.elemento.appendChild(Tempuz.imprimir());
        });
        this.#tablero.elemento.addEventListener("click", this.#funcion);
        return this.#tablero;
    }
    
    #verificarVictoria() {
        if (!this.#tablero.posiciones.some((puz, index) => puz != this.#ordenado[index])) {
            this.#tablero.elemento.removeEventListener("click", this.#funcion);
            document.querySelector("#numMovimientos").textContent = " " + this.#tablero.moviminetos;
            document.querySelector("#tiempo2").textContent = " " + this.#imprimirTiempo();
            clearTimeout(this.#cronometro)
            setTimeout(() => {
                document.querySelector("#victoria").style.display = "block";
            }, 700);
        }
    }
    

    #range(num1, num2) {
        let nums = []
        for (let i = num1; i < num2; i++) {
            nums.push(i)
        }
        let temnums = []
        do {
            this.#ordenado = nums.slice()
             temnums = nums.slice().sort(() => Math.random() - 0.5)
        } while (!this.#esSolucionable(temnums))
        nums = temnums;
        this.#ordenado.push(0)
        return nums;
    }

    #esSolucionable(puzzle){
        puzzle.push(0)
            let inversions = 0
            for (let i = 0; i < puzzle.length; i++) {
              if (puzzle[i] === 0) continue
              for (let j = i + 1; j < puzzle.length; j++) {
                if (puzzle[j] !== 0 && puzzle[i] > puzzle[j]) {
                  inversions++
                }
              }
            }
            return inversions % 2 === 0  
    }

    #imprimirTiempo(){
        let minutos = (parseInt(this.#tiempo / 60)).toString().padStart(2,"0");
        let segundos = (this.#tiempo % 60).toString().padStart(2,"0");
        return minutos + ":" + segundos;
    }


}





document.querySelector("#dificultad").addEventListener("input",(e)=>{
    let tamaño = e.target.value;
    document.querySelector("#tamaño").textContent = tamaño + "x" + tamaño;
})
document.querySelector("#jugar").addEventListener("click",()=>crearTablero())
document.querySelector("#reordenar").addEventListener("click",()=>recargar())
document.querySelector("#reiniciar").addEventListener("click",()=>location.reload())

function crearTablero() {
    let num = parseInt(document.querySelector("#dificultad").value)
    if(num>=3 && num<=10){
    document.querySelector("#menu").style.display="none"
    document.querySelector("#juego").style.display="block"
    document.querySelector("#juego").appendChild(new Tablero(num))
    }else{
        alert("Error: Numero de piezas no permitodo")
    }
}

function recargar(){
    document.querySelector(".contenedor").remove()
    crearTablero()
}

