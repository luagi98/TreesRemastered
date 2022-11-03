const disco = document.getElementById("disco")
const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    TOWER_HEIGHT = disco.value
    //Constructor de la representacion en string de los estados
    pyramid = Array.from({ length: TOWER_HEIGHT }, (a, i) => String.fromCharCode(65 + i)).join(""),
    delimiters = Array.from({ length: RODS - 1 }, () => "-").join(""),
    initialState = `${pyramid}${delimiters}`,
    finalState = `${delimiters}${pyramid}`
    busquedas()
});
let TOWER_HEIGHT,
RODS = 3;
let pyramid;

/**
 * Esta funcion retorna todos los poslbes estados
 * a. "ABCD--" -> ["ABC-D-", "ABC--D"]
 * b. "ABC-D-" -> ["AB-D-C", "ABCD--", "ABC--D"]
 * c. ...y asi
 * @param {string} state - Estado actual
 */
function getNextStates(state) {
    //torres representadas con -
    const towers = state.split("-"),                   // b. ["ABC", "D", ""]
        topRings = towers.map(s => s[s.length - 1]), // b. ["C", "D", undefined]
        variants = [];
    for (let posA = 0; posA < topRings.length; ++posA) {
        if (!topRings[posA]) continue;                 // salta los indefinidos ya que no se puede hacer nada
        for (let posB = 0; posB < topRings.length; ++posB) {
            if (!(topRings[posA] <= topRings[posB]))   // intentando posA -> posB
                variants.push(towers.map(
                    (tower, pos) =>
                        pos === posA ? tower.slice(0, tower.length - 1) // toma discos desde arriba
                            : pos === posB ? tower + topRings[posA]         // colocaruno encima
                                : tower                                         // no hace movimientos
                ).join("-"));
        }
    }
    return variants;
}

let iter = 0;

/**
 *  Resuelve el problema con DFS
 * @param {string} state
 * @param {Set} pastStates
 * @param {number=Infinity} deepLimit
 * @returns {string[]} - arreglo de variantes si se encuentra
 */
// function dfs(state = initialState, pastStates = new Set(), deepLimit = Infinity) {
//     if (pastStates.size > deepLimit)
//         return [];
//     if (state === finalState)
//         return [finalState];
//     let vars = getNextStates(state);
//     if (++iter % 1000 === 0) console.log(`\r${pastStates.size}`);
//     for (let currentState of vars) {
//         if (pastStates.has(currentState))
//             continue;
//         let result = dfs(currentState, (new Set(pastStates)).add(currentState), deepLimit);
//         if (result.length)
//             return [state].concat(result);
//     }
//     return [];
// }

/**
 * Resuelve el problema con BFS
 * @param {string[]} stack
 * @param {Set} past
 * @returns {string[]} - arreglo de variantes si se encuentra
 */
// function bfs(stack = [{ state: initialState, path: [initialState] }],
//     past = new Set([initialState])) {
//     while (true) {
//         if (stack.length === 0) return [];
//         let currentState = stack.shift(),
//             vars = getNextStates(currentState.state).filter(s => !past.has(s) && past.add(s))
//                 .map(s => ({ state: s, path: currentState.path.concat(s) })),
//             final = vars.filter(s => s.state === finalState)[0];
//         if (++iter % 1000 === 0)
//             console.log(`\r${iter} deepening level ${currentState.path.length}`);
//         if (final) return final.path;
//         stack.push(...vars);
//     }
// }

/**
 * Retorna el peso del nodo. Usado en A*. Aqui asumimos que es la mejor variante es esta,
 *  cuando tengamos la mayoria de los elementos a la derecha
 * @param state
 * @return {number} -Valor entre 0 y 1,donde 0 es el mejor valor.
 */
function stateWeight(state) {
    let arrs = state.split("-");
    return arrs.reduce((acc, e, i) => acc + e.length * (arrs.length - 1 - i), 0)
        / arrs.reduce((acc, e, i) => acc + e.length * 3, 0);
}

/**
 * Resuelve el problema con A*
 * @param {string[]} stack
 * @param {Set} past
 * @returns {string[]} - arreglo de variantes si se encuentra
 */
function aStar(stack = [{ state: initialState, weight: stateWeight(initialState), path: [initialState] }], past = new Set([initialState])) {
    //loop hasta encontrar una respuesta
    while (true) {
        //si no es posible 
        if (stack.length === 0) return [];
        //reducimos los estados a los unicamente posibles y seleccionamos el estado actual
        let currentState = stack.reduce((b, v) =>
            (v.weight + v.path.length + v.path.reduce((acc, s) => acc + stateWeight(s), 0)
                < b.weight + b.path.length + b.path.reduce((acc, s) => acc + stateWeight(s), 0))
                ? v
                : b
            , stack[0]),
            //obtenemos los suguientes estados
            vars = getNextStates(currentState.state).filter(s => !past.has(s) && past.add(s))
                .map(s => ({ state: s, weight: stateWeight(s), path: currentState.path.concat(s) })),
            //filtramos si el estado actual es un estado terminal
            final = vars.filter(s => s.state === finalState)[0];
        //filtramos todos los estados que no sean el estado actual
        stack = stack.filter(s => s !== currentState);
        if (++iter % 1000 === 0)
            console.log(`\r${iter} deepening level ${currentState.path.length}`);
        if (final) return final.path;
        stack.push(...vars);
    }
}

/**
 * Resuelve el problema usando la version iterativa profunda de BFS.
 * @param {string} state
 * @param {Set} pastStates
 * @param {number=3} initialDeepening
 * @returns {string[]} - arreglo de variantes si se encuentra
 */
// function idDfs(state = initialState, pastStates = new Set(), initialDeepening = 3) {
//     while (true) {
//         let variant = dfs(state, pastStates, initialDeepening++);
//         if (variant.length) return variant;
//     }
// }

const busquedas = () => {

    console.log(TOWER_HEIGHT);
    let result;
    movements(`--- Solucion a Torres de Hanoi ---`);
    movements(`Altura de la torre: ${TOWER_HEIGHT}`);
    movements(`Numero de Torres: ${RODS}`);
    // movements(`Resolviendo por (algoritmo BFS), espera un momento...`);
    // iter = 0;
    // result = bfs();
    // movements(`\rTerminado, numero de iteraciones: ${ iter }.`);
    // movements(
    //     result.length
    //         ? `Primera posible solucion encontrada (${ result.length } pasos realizados): ${ result.join(" => ") }`
    //         : `No hay soluciones para esta entrada!`
    // );
    // movements(`Resolviendo mediante DFSI, por favor espere`);
    // iter = 0;
    // result = idDfs();
    // movements(`\rHecho, numero de Iteraciones: ${ iter }.`);
    // movements(
    //     result.length
    //         ? `Posible solucion encontrada (${ result.length } pasos realizados): ${ result.join(" => ") }`
    //         : `No hay soluciones para esta entrada!`
    // );
    movements(`Resolviendo con A*, por favor espere...`);
    iter = 0;
    result = aStar();
    movements(`\rTerminado, numero de iteraciones: ${iter}.`);
    movements(
        result.length
            ? `Posible solucion encontrada (${result.length - 1} pasos realizados): ${result.join(" => ")}`
            : `No hay soluciones para esta entrada!`
    );
    // movements(`Resolviendo miendiante DFS, por favor espere...`);
    // iter = 0;
    // result = dfs();
    // movements(`\rTerminado, numero de iteraciones: ${ iter }.`);
    // movements(
    //     result.length
    //         ? `Posible solucion encontrada (${ result.length } pasos realizados): ${ result.join(" => ") }`
    //         : `No hay soluciones para esta entrada!`
    // );
}

const movements = (message) => {
    let elemento = document.createElement('li');
    elemento.innerText = message;
    document.getElementById('ul').appendChild(elemento);
}


