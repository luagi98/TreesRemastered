// casillas del tablero
const boxElements = document.querySelectorAll('[class = "box"]')
// tablero
const board = document.getElementById('board')
let turn
let finishedGame = false
//Casillas ya clickeadas
let available = []

// winningCombinations: guarda todas las combinaciones posibles del tablero

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// handleClick: si una posicion en el tablero es clickeada se ejecuta esta funcion

/** */

const handleClick = (e, index) => {
    //si el juego ha terminado y se quiere colocar otra pieza en el tablero la funcion retorna nulo para impedirlo
    if (finishedGame) return
    available.push(index)
    const box = e.target
    //determina el turno para las funciones de tablero
    const currentClass = turn ? 'o' : 'x'
    //coloca la pieza ya sea x u o en el tablero
    placeMark(box, currentClass)
    //Verifica quien ha ganado
    if (checkWinner(currentClass)) {
        movements(`ha ganado ${currentClass}`)
        finishedGame = true
        return
    }
    //Caso contrario, verifica si hubo un empate contando las casillas clickeadas
    else if (available.length == 9) {
        movements('tie')
        finishedGame = true
        return
    }

    // si es true, se ejecuta la busqueda minimax, y da el turno al siguiente jugador
    if (turn) {
        let bestMove = move()
        swapTurns()
        setBoardHoverClass()
        boxElements[bestMove].click()
    }
    // si no, unicamente cambia el turno
    else {
        swapTurns()
        setBoardHoverClass()
        // console.clear()
    }

    // console.log(turn)

}

// cambia el turno del tablero para mostrar en el hover de las casillas el turno correspondiente

const placeMark = (box, currentClass) => {
    box.classList.add(currentClass)

}

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// variables del grafo

let nodes = new vis.DataSet()

let edges = new vis.DataSet()

let container = document.getElementById("mynetwork")

let data = {
    nodes: nodes,
    edges: edges,
}

let options = {
    layout: {
        hierarchical: {
            // direction: 'UD',
            sortMethod: "directed",
            parentCentralization: true,
            shakeTowards: "roots",
        },
    },
}

let network = new vis.Network(container, data, options)

// variable auxiliar para los id de los nodos

let numberNodes = 0

// ---------------------------------------------------------------------------------------------------------------------------------------------------------

// Inicializa el arbol, borra el grafo anterior, resetea los nodos, aristas y recrea el grafo

const initializeTree = () => {
    network.destroy()
    nodes = new vis.DataSet()
    edges = new vis.DataSet()
    let data = {
        nodes: nodes,
        edges: edges,
    }
    network = new vis.Network(container, data, options)
}

// Funcion que ejecuta el movimiento de la computadora

let boardCopy

const move = () => {
    /*
        bestScore: mejor puntuacion obtenida en las casillas disponibles. 
        bestMove: la mejor casilla a elegir. 
        availableCopy: copia de las casillas ya usadas. 
        drawTree: bandera para dibujar el grafo.
    */
    let bestScore = -Infinity
    let bestMove
    let availableCopy = []
    let drawTree = available.length > 4

    //Si la bandera esta predida creamos el nodo raiz e inicializamos el id maximo de los nodos y mostramos en consola
    if (drawTree) {
        initializeTree()
        numberNodes = 0
        nodes.add([{ id: numberNodes, label: ` ${numberNodes} ` , color: `#3a595c`, font: {color: '#edeef0'}}])
        movements(`Creando nodo Raiz`)
    }

    
    for (let index = 0; index < boxElements.length; index++) {
        //Recorremos todas las casillas, verificamos si esa casilla es viable usarla
        if (!available.includes(index)) {

            // hacemos una copia de las casillas no disponibles y añadimos la casilla actual a las no disponibles

            availableCopy = [...available]
            availableCopy.push(index)

            // Creamos un tablero logico, para conocer el estado actual del juego y colocamos el movimiento de la computadora en la casilla actual
            // y calculamos su valor mediante minimax

            boardCopy = createBoard(availableCopy)
            boardCopy[index]='x'
            let score = minimax(1, false,0,`x en ${index}`,drawTree)

            // regresamos el tablero como estaba

            boardCopy[index]=''

            //si el score es mayor que bestScore, lo seteamos y guardamos la casilla con mejor puntuacion
            if (score > bestScore) {
                bestScore = score
                bestMove = index
            }
        }
    }  

    //Si la bandera esta prendida, cambiamos el color del nodo raiz dependiendo si perdimos, ganamos o empatamos
    if (drawTree) {
        const color = bestScore == 1 ? '#00FF00' : bestScore == 0 ? '#0000FF' : '#FF0000'
        let message = bestScore == 1 ? 'Maximizado' : bestScore == 0 ? 'Empate' : 'Minimizado'
        checkNode(0,color)
        updateLabel(0,`Valor final : ${bestScore}`)
        movements(`${message}`)
    }

    //returnamos el mejor movimiento
    // console.log(numNodes)
    return bestMove
}

// poderacion de los distintos estados de un nodo, ya sea ganador, perdedor o empate
const scores = {
    'x': 1,
    'o': -1,
    'tie': 0
}

// recibe una copia del tablero, la profundidad, si es maximizar o minimzar, el nodo padre, el texto que se mostrara en el nodo y si se va a crear el arbol

const minimax = (depth, isMax,parentNode,label,drawTree) => {
    let result = checkWinnerMinimax(boardCopy)
    numberNodes++
    const id = numberNodes
    // nodes.add([{ id: id, label: ` - ` , color: `#3a595c`, font: {color: '#edeef0'}}])
    if (drawTree) {
        addNodes(id)
        addEdges(id,parentNode)
        updateLabel(id,label)
         movements(`Creando nodo ${id} : ${label}`)
    }
    
    // console.log(result)
    if (result !== null) {
        if (drawTree) {       
            const color = scores[result] == 1 ? '#00FF00' : scores[result] == 0 ? '#0000FF' : '#FF0000'
            checkNode(id,color)
             movements(`Asignando valor ${scores[result]} al nodo ${id}`)
        }
        return scores[result]
    }
    // console.log(boardCopy.length)
    if (isMax) {
        let bestScore = -Infinity
        for (let index = 0; index < boardCopy.length; index++) {
            if (boardCopy[index] == '') {
                boardCopy[index] = 'x'
                // console.log(boardCopy)
                let score = minimax(depth+1,false,id,`x en ${index}`,drawTree)
                boardCopy[index] = ''
                // console.log({'depth' : depth,'score' : score})
                bestScore = Math.max(score,bestScore)
            }
        }
        if (drawTree) {
            const color = bestScore == 1 ? '#00FF00' : bestScore == 0 ? '#0000FF' : '#FF0000'
            checkNode(id,color)
             movements(`Maximizando a ${id} : valor de ${bestScore}`)
        }
        return bestScore
    }

    else {
        let bestScore = Infinity
        for (let index = 0; index < boardCopy.length; index++) {
            if (boardCopy[index] == '') {
                boardCopy[index] = 'o'
                // console.log(boardCopy)
                let score = minimax(depth+1,true,id,`o en ${index}`,drawTree)
                boardCopy[index] = ''
                // console.log({'depth' : depth,'score' : score})
                bestScore = Math.min(score,bestScore)
            }
        }
        if (drawTree) {
            const color = bestScore == 1 ? '#00FF00' : bestScore == 0 ? '#0000FF' : '#FF0000'
            checkNode(id,color)
             movements(`Minimizando a ${id} : valor de ${bestScore}`)
        }
        return bestScore
    }
}

const checkNode = (id, color) => {
    nodes.update({ id: id, color: color })
    // network.body.emitter.emit('_dataChanged')
    // network.redraw()
}

const movements = (message) => {
    let elemento = document.createElement('li')
    elemento.innerText = message
    document.getElementById('ul').appendChild(elemento)
}

const addNodes =  (id) => {
    nodes.add([{ id: id, label: ` - `, title : id , color: `#3a595c`, font: {color: '#edeef0'}}])
}

const addEdges = (id,parent) => {
    edges.add([{ from: parent, to: id }])
}

const updateLabel = (id,label) => {
    nodes.update({ id: id, label: label})
    // network.body.emitter.emit('_dataChanged')
    // network.redraw()
}

const checkWinnerMinimax = (boardCopy) => {
    if (winningCombinations.some(combination => { return combination.every(index => { return boardCopy[index] == 'x' })})) {
        return 'x'
    }
    if (winningCombinations.some(combination => { return combination.every(index => { return boardCopy[index] == 'o' })})) {
        return 'o'
    }
    if (!boardCopy.includes('')) {
        return 'tie'
    }
    return null
}

const createBoard = (notAvailable) => {
    let arrayBoard = []
    for (let index = 0; index < 9; index++) {
        if (notAvailable.includes(index)) {
            if (boxElements[index].classList.contains('x')) {
                arrayBoard.push('x')
            } else {
                arrayBoard.push('o')
            }
        }
        else {
            arrayBoard.push('')
        }
    }
    return arrayBoard
}

const swapTurns = () => {
    turn = !turn
}

const setBoardHoverClass = () => {
    board.classList.remove('x')
    board.classList.remove('o')
    if (turn) {
        board.classList.add('o')
    }
    else {
        board.classList.add('x')
    }
}

const checkWinner = (currentClass) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boxElements[index].classList.contains(currentClass)
        })
    })
}
const startGame = () => {
    turn = true

    boxElements.forEach((box, index) => {
        box.addEventListener('click', function (e) { handleClick(e, index) }, { once: true })
    })
    setBoardHoverClass()
    console.clear()
}
startGame()

// ['x','x','x','o','','o','','','']


let arr = [], i=1; arr.push(5),arr.push(5),i++



console.log(arr)
console.log(i);