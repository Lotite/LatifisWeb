class ParteSerpiente {
    #id;
    #poss;
    #cadena;
    #direccion
    #element
    constructor(poss, cadena, direccion) {
        this.#id = cadena.length;
        this.#poss = poss;
        this.#cadena = cadena;
        this.#direccion = direccion
        this.#element = document.createElement()
    }


    mover() {
        switch (this.#direccion) {
            case "w":
                this.#desplazar("y", -1)
                break;
            case "a":
                this.#desplazar("x", -1)
                break;
            case "s":
                this.#desplazar("y", 1)
                break;
            case "d":
                this.#desplazar("x", 1)
                break;
        }
    }


    #desplazar(eje, direccion) {
        switch (eje) {
            case "x":
                const { left } = this.#element.getClientRects()
                break;
            case "y":
                const { top } = this.#element.getClientRects()
                break;
        }
    }


}