let direcion = "w"



document.addEventListener("keydown",(e)=>{
    if(["a","s","d","w","W","D","S","A","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) cambiarDireccion(e.key)
})


function cambiarDireccion(tecla){
    switch(tecla){
        case "a": case "A": case "ArrowLeft":
        if(direcion!="d"){
            direcion = "a"
        }
        break;
        case "w": case "W": case "ArrowUp":
            if(direcion!="s"){
                direcion = "w"
            }
            break;
        case "d": case "D": case "ArrowRight":
        if(direcion!="a"){
            direcion = "d"
        }
        break;
        case "s": case "S": case "ArrowDown":
            if(direcion!="w"){
                direcion = "s"
            }
            break;
    }
}


function mover(){
    switch(direcion){
        case "a":

        break;

    }
}


function desplazarse(){

}






