'use strict-mode'
const form = document.getElementById('form');
const nodosPadre = document.getElementById('nodoPadre');
const nodosHijo = document.getElementById('nodoHijo');
const nodoMeta = document.getElementById('nodoMeta');
const amplitud = document.getElementById('amplitud');
const nivel = document.getElementById('nivel');
// const toggle = document.getElementById('switch');

let flag = true;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nodosPadreNumber = nodosPadre.value;
    const nodosHijoNumber = nodosHijo.value;
    const nodoMetaNumber = nodoMeta.value;
    const amplitudNumber = amplitud.value;
    const nivelNumber = nivel.value;
    checkInputs([Number(nodosPadreNumber), Number(nodosHijoNumber), Number(nodoMetaNumber), Number(amplitudNumber), Number(nivelNumber)]);
});

// Verifica las entradas si son validas

const checkInputs = ([nodosPadreNumber, nodosHijoNumber, nodoMetaNumber, amplitudNumber, nivelNumber]) => {
    // Verifica si todos los numeros son positivos
    if (
        firstLevelValidation([nodosPadreNumber, nodosHijoNumber, nodoMetaNumber, amplitudNumber, nivelNumber]) &&
        secondLevelValidation([nodosPadreNumber, nodosHijoNumber]) &&
        thirdLevelValidation([nodosPadreNumber, nodosHijoNumber, amplitudNumber, nivelNumber]) &&
        fourthLevelValidation([nodoMetaNumber, nodosHijoNumber])
    ) {

        window.location.href = "trees.html ";
    } else {
        flag = true;
    }
}

const firstLevelValidation = ([nodosPadreNumber, nodosHijoNumber, nodoMetaNumber, amplitudNumber, nivelNumber]) => {
    const validator = (amplitudNumber > 0 ? setSuccessFor(amplitud) : setErrorFor(amplitud, 'Debe ingresar un numero positivo')) &&
        (nivelNumber > 0 ? setSuccessFor(nivel) : setErrorFor(nivel, 'Debe ingresar un numero positivo')) &&
        (nodosPadreNumber > 0 ? setSuccessFor(nodosPadre) : setErrorFor(nodosPadre, 'Debe ingresar un numero positivo')) &&
        (nodosHijoNumber > 0 ? setSuccessFor(nodosHijo) : setErrorFor(nodosHijo, 'Debe ingresar un numero positivo')) &&
        (nodoMetaNumber > 0 ? setSuccessFor(nodoMeta) : setErrorFor(nodoMeta, 'Debe ingresar un numero positivo'))
    return validator
}

const secondLevelValidation = ([nodosPadreNumber, nodosHijoNumber]) => {
    return nodosPadreNumber <= nodosHijoNumber ? setSuccessFor(nodosPadre) : setErrorFor(nodosPadre, 'No se pueden tener tantos nodos padre');
}

const thirdLevelValidation = ([nodosPadreNumber, nodosHijoNumber, amplitudNumber, nivelNumber]) => {
    // const maxNodosPadre = amplitudNumber * (nivelNumber - 2) + 1
    const maxNodosPadre = nodosHijoNumber - amplitudNumber + 1
    const minNodosPadre = nivelNumber - 1
    const maxNodosHijo = amplitudNumber * (nivelNumber - 1)
    const minNodosHijo = amplitudNumber + nivelNumber - 2
    const validator =
        (nodosHijoNumber >= minNodosHijo ? setSuccessFor(nodosHijo) : setErrorFor(nodosHijo, `Deben haber al menos ${minNodosHijo} nodos hijo`)) &&
        (nodosHijoNumber <= maxNodosHijo ? setSuccessFor(nodosHijo) : setErrorFor(nodosHijo, `Se deben tener a lo mas ${maxNodosHijo} nodos hijo`)) &&
        (nodosPadreNumber >= minNodosPadre ? setSuccessFor(nodosPadre) : setErrorFor(nodosPadre, `Deben haber al menos ${minNodosPadre} nodos padre`)) &&
        (nodosPadreNumber <= maxNodosPadre ? setSuccessFor(nodosPadre) : setErrorFor(nodosPadre, `Se deben tener a lo mas ${maxNodosPadre} nodos padre`))

    return validator
}

const fourthLevelValidation = ([nodoMetaNumber, nodosHijoNumber]) => {
    return nodoMetaNumber <= nodosHijoNumber + 1 ? setSuccessFor(nodoMeta) : setErrorFor(nodoMeta, `Debe ser a lo mas ${nodosHijoNumber + 1}`);
}

const setErrorFor = (input, message) => {
    const inputBox = input.parentElement;
    const small = inputBox.querySelector('small');
    small.innerText = message;
    inputBox.className = 'input-box error';
    localStorage.removeItem(input.id);
    flag = false;
    return false
}

const setSuccessFor = (input) => {
    const inputBox = input.parentElement;
    inputBox.className = 'input-box success';
    localStorage.setItem(input.id, Number(input.value));
    return true
}

// Nivel = 5, Amplitud = 5, Padres = 16, Hijos = 20
//         /
//     /   / / /   /
//     / /   / / /
//     / /   / / /
//     / /   / / /

// Nivel = 2, Amplitud = 5, Padres = 1, Hijos = 5

//             /
//     /   /   /   /   /

// Nivel = 5, Amplitud = 1, Padres = 4, Hijos = 4
//     /
//     /
//     /
//     /
//     /

//     Nivel = 5, Amplitud = 5, Padres = 4, Hijos = 20
//         /
//         /   / / /   /
//         / /   / / /
//         / /   / / /
//         / /   / / /


// Nivel = 4, Amplitud = 5, Padres = 3, Hijos = 11,

//     /
//     / /   / / /
//     / /   / /
//     /

// Nivel = 4, Amplitud = 5, Padres = 3, Hijos =

//     /



// Finales

// Nivel = 3, Amplitud = 5, Padres = 2 - 6, Hijos =

//     /
//     / /   / / /
//     / /   / / /

// Nivel = 3, Amplitud = 5, Padres = 2, Hijos =

//     /
//     / /       / / /
//     / / / / /

//     /
//     /   / / /   /
//     / /   / / /
//     / /   / / /


// Nivel = 4, Amplitud = 5, padres = 6

//     /
//     /   / / /   /
//     /
//     /


// Nivel = 6, Amplitud = 6, padres =

//         /
// /   /   /   /   /   /
// /
// /
// /
// /