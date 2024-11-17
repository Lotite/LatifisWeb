//Estos son las figuras que tendra el juego
const figuras = {
    I: { forma: [[1, 1, 1, 1]], color: "#33ffe0" },
    O: { forma: [[1, 1], [1, 1]], color: "#33ff3f" },
    L: { forma: [[0, 0, 1], [1, 1, 1]], color: "#33fff3" },
    J: { forma: [[1, 0, 0], [1, 1, 1]], color: "#ff33e9" },
    Z: { forma: [[1, 1, 0], [0, 1, 1]], color: "#ff3377" },
    S: { forma: [[0, 1, 1], [1, 1, 0]], color: "#4cff33" },
    T: { forma: [[0, 1, 0], [1, 1, 1]], color: "#ff3333" }
}
//Variables globales
let figuraActuall = newFigura()
let siguiente = newFigura(false)
document.querySelector("#siguiente").appendChild(siguiente.elemento)
let memoria;
let mover = setInterval(bajar, 500)
let puntos = 0
let nivel = 1;
//Constantes globales
const bloques = []
const globalLineas = []


//Funciones
function newFigura(ajustar = true, posicion = { x: 40, y: 0 }) {
    const figura = figuras["IOLJZST".charAt((Math.random() * 6).toFixed(0))]
    //const figura = figuras.I
    const elemento = document.createElement("div")
    elemento.style.left = `${posicion.x}%`
    elemento.style.top = `${posicion.y}%`
    elemento.classList.add("figura")
    addBloques(elemento, figura, ajustar)
    document.querySelector("main").appendChild(elemento)
    return { elemento: elemento, figura: figura, posicion: posicion }
}


function addBloques(elemento = figuraActuall.elemento, figura = figuraActuall.figura, ajustar = true) {
    elemento.innerHTML = ""
    const forma = figura.forma
    forma.forEach((fila, y) => {
        fila.forEach((celda, x) => {
            if (celda) {
                const bloque = document.createElement("div")
                bloque.classList.add("bloque")
                bloque.style.left = `${x * 100 / forma[0].length}%`
                bloque.style.top = `${y * 100 / forma.length}%`
                if (ajustar) {
                    bloque.style.width = `${100 / forma[0].length}%`
                    bloque.style.height = `${100 / forma.length}%`
                } else {
                    bloque.style.width = `15px`
                    bloque.style.height = `15px`
                }
                bloque.style.backgroundColor = figura.color
                elemento.appendChild(bloque)
            }
        })
    })
    if (ajustar) {
        elemento.style.width = `${forma[0].length * 10}%`
        elemento.style.height = `${forma.length * 5}%`
    } else {
        elemento.style.width = `${forma[0].length * 15}px`
        elemento.style.height = `${forma.length * 15}px`
    }

}

function rotar(elemento = figuraActuall.elemento, figura = figuraActuall.figura) {
    let forma = figura.forma
    const nuevaForma = []
    const filas = forma.length
    const columnas = forma[0].length
    for (let i = 0; i < columnas; i++) {
        nuevaForma[i] = []
        for (let j = 0; j < filas; j++) {
            nuevaForma[i][j] = forma[filas - 1 - j][i]
        }
    }
    figuraActuall.figura.forma = nuevaForma
    addBloques(elemento, { "forma": nuevaForma, "color": figura.color })
}

function rotarInversa() {
    for (let i = 0; i < 3; i++) rotar()
}

function detectarColision(figura1, figura2) {
    const { left: x1, top: y1, width: w1, height: h1 } = figura1.getBoundingClientRect();
    const { left: x2, top: y2, width: w2, height: h2 } = figura2.getBoundingClientRect();

    return (x1 + 1 < x2 + w2 && x1 + w1 - 1 > x2 && y1 + 1 < y2 + h2 && y1 + h1 - 1 > y2);
}



function comprobarColisiones() {
    let blocks = [...figuraActuall.elemento.querySelectorAll(".bloque")]
    return bloques.some(bloque => {
        return blocks.some(block => {
            return detectarColision(bloque, block)
        })
    })
}

function compobarSalidaPantalla() {
    const pantalla = document.querySelector("main")
    const bloques = [...figuraActuall.elemento.querySelectorAll(".bloque")]
    return bloques.some(bloque => {
        return !detectarColision(pantalla, bloque)
    })
}

function bajar() {
    if (!mover) return;
    figuraActuall.posicion.y += 5
    const h = figuraActuall.elemento.getBoundingClientRect().height.toFixed(0);
    const h2 = document.querySelector("main").getBoundingClientRect().height.toFixed(0);
    const fh = (h / h2 * 20).toFixed(0) * 5
    figuraActuall.elemento.style.top = `${figuraActuall.posicion.y}%`
    if ((figuraActuall.posicion.y + fh) > 100 || comprobarColisiones()) {
        figuraActuall.posicion.y -= 5
        figuraActuall.elemento.style.top = `${figuraActuall.posicion.y}%`
        clearInterval(mover)
        mover = setInterval(bajar, 500)
        colocar()
    }
}



function colocar() {
    const padre = document.querySelector("main")
    const px = padre.getBoundingClientRect().x
    const py = padre.getBoundingClientRect().y
    const ph = padre.getBoundingClientRect().height
    const pw = padre.getBoundingClientRect().width
    const temBloques = [...figuraActuall.elemento.querySelectorAll(".bloque")]
    temBloques.forEach(bloque => {
        let poss = bloque.getBoundingClientRect()
        let x = poss.x - px
        let y = poss.y - py
        bloque.style.width = "10%"
        bloque.style.height = "5%"
        bloque.style.left = `${(x / pw * 100).toFixed(0)}%`
        bloque.style.top = `${(y / ph * 100).toFixed(0)}%`
        padre.append(bloque)
        const fila = 19 - parseInt((y / ph * 20).toFixed(0))
        if (temBloques.some(b => {
            return bloques.some(b2 => detectarColision(b2, b))
        })) {
            temBloques.forEach(b => {
                b.remove()
                clearInterval(mover)
                mover = false
                return
            })
        }
        if (!globalLineas[parseInt(fila)]) {
            globalLineas[parseInt(fila)] = []
        }
        globalLineas[parseInt(fila)].push(bloque)

    })
    temBloques.forEach(b => {
        bloques.push(b)
    })
    verificarLienas()
    figuraActuall.elemento.remove()
    figuraActuall = newFigura()
    siguiente = cambiar(document.querySelector("#siguiente"), siguiente)

}


function verificarLienas() {
    for (let i = 0; i < globalLineas.length; i++) {
        const linea = [...globalLineas[i]]
        if (linea && linea.filter(bloque => bloque).length >= 10) {
            linea.forEach(bloque => {
                bloques.splice(bloques.indexOf(bloque), 1)
                bloque.remove()
            })
            puntos += 10
            renderDatos()
            globalLineas.splice(i, 1)
            gravedad(i)
            i--
        }
    }

}
function gravedad(i) {
    globalLineas.forEach((linea, index) => {
        if (index >= i)
            linea.forEach(bloque => {
                bloque.style.top = `${parseInt(bloque.style.top.replace("%", "")) + 5}%`
            })
    })
}


function moverHorizaontal(valor) {
    if (!mover) return;
    figuraActuall.posicion.x += valor
    figuraActuall.elemento.style.left = `${figuraActuall.posicion.x}%`
    if (compobarSalidaPantalla() || comprobarColisiones()) {
        figuraActuall.posicion.x -= valor
        figuraActuall.elemento.style.left = `${figuraActuall.posicion.x}%`
    }
}

function pausa() {
    if (mover) {
        clearInterval(mover)
        mover = false;
    }
    else mover = setInterval(bajar, 500)
}

function cambiar(contenedor, figura) {
    let memoriaTem = figuraActuall
    figura.posicion = figuraActuall.posicion
    figuraActuall = figura
    figuraActuall.elemento.style.left = `${figura.posicion.x}%`
    figuraActuall.elemento.style.top = `${figura.posicion.y}%`
    addBloques(figuraActuall.elemento, figura.figura)
    document.querySelector("main").appendChild(figura.elemento)
    addBloques(memoriaTem.elemento, memoriaTem.figura, false)
    memoriaTem.elemento.style.left = `10px`
    memoriaTem.elemento.style.top = `10px`
    contenedor.appendChild(memoriaTem.elemento)
    return memoriaTem
}

function guardar() {
    memoria = figuraActuall
    addBloques(memoria.elemento, memoria.figura, false)
    document.querySelector("#memoria").appendChild(memoria.elemento)
    memoria.elemento.style.left = `10px`
    memoria.elemento.style.top = `10px`
    figuraActuall = newFigura()
    siguiente = cambiar(document.querySelector("#siguiente"), siguiente)
}

function renderDatos() {
    if (puntos >= 100 * nivel) {
        nivel++;
        puntos = 0;
        document.querySelector("#nivel").innerHTML = nivel;
    }
    document.querySelector("#puntuaje").innerHTML = puntos;
    document.querySelector("#linea").style.width = `${puntos / (100 * nivel) * 100}%`
}
function colocarFigura() {
    if (mover) {
        clearInterval(mover)
        mover = setInterval(bajar, 1)
    }
}

//Eventos

document.querySelector("#rotar").addEventListener("click", () => {
    rotar()
})
document.querySelector("#bajar").addEventListener("click", () => {
    bajar()
})

document.querySelector("#derecha").addEventListener("click", () => {
    moverHorizaontal(10)
})
document.querySelector("#izquierda").addEventListener("click", () => {
    moverHorizaontal(-10)
})

document.querySelector("#pausa").addEventListener("click", () => {
    pausa()
})

document.querySelector("#guardar").addEventListener("click", () => {
    if (memoria) memoria = cambiar(document.querySelector("#memoria"), memoria)
    else guardar()
})

document.querySelector("#colocar").addEventListener("click", () => {
    colocarFigura()
})





addEventListener("keyup", (e) => {

    switch (e.key) {
        case "ArrowLeft":
            moverHorizaontal(-10)
            break;
        case "ArrowRight":
            moverHorizaontal(10)
            break;
        case "ArrowDown":
            bajar()
            break;
        case " ":
            pausa()
            break;
        case "ArrowUp":
            rotar()
            if (comprobarColisiones() || compobarSalidaPantalla())
                rotarInversa()
            break;
        case "c":
        case "C":
            colocarFigura()
            break;
        case "x":
        case "X":
            if (memoria) memoria = cambiar(document.querySelector("#memoria"), memoria)
            else guardar()
            break;
    }
})





