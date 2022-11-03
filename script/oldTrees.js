const nodos = nodosHijo + 1

// create an array with nodes

let nodes = new vis.DataSet();

// Create all the nodes 

for (let index = 1; index <= nodos; index++) {
    nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#3a595c`, font: { color: '#edeef0' } }]);
}

// Auxiliar queue

let queue = [];

// Index of Actual Node

let actualNode = 1;

// Initializing edges

let edges = new vis.DataSet();

// Setting information about the graph

let container = document.getElementById("mynetwork");
let data = {
    nodes: nodes,
    edges: edges,
};
let options = {
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: "directed",
            parentCentralization: true,
            shakeTowards: "roots",
        },
    },
};

// Drawing the Graph

let network = new vis.Network(container, data, options);

// This fuction get the depth of a node

const getDepth = (index) => {
    index = parseInt(index);
    let depth = 1;
    while (network.getConnectedNodes(index, 'from').length > 0) {
        let aux = network.getConnectedNodes(index, 'from');
        index = aux[0];
        ;
        depth++;
    }

    return depth;
}

// Create all the edges until nivel - 1 and setting that edges in auxiliar queue

for (let index = 1; index <= nivel - 1; index++) {
    edges.add([{ from: index, to: index + 1 }]);
    queue.push(index);
}

actualNode = nivel + 1;

// Copy of Nodos

auxNodos = nodos;

root = queue.shift();

// Create all the lefted edges, filling first in horizontal until there's no more edges to draw

while (auxNodos > 0) {
    childs = network.getConnectedNodes(root, "to").length;
    for (let index = 1; index <= amplitud - childs; index++) {
        edges.add([{ from: root, to: actualNode }]);
        if (getDepth(actualNode) < nivel) {
            queue.push(actualNode);
        }
        actualNode++;
        auxNodos--;
    }
    root = queue.shift();
}

// Generate Random Numbers

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Sleep function

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const minimax = async () => {
    let elemento = document.createElement('li');
    elemento.className = 'line-end';
    document.getElementById('ul').appendChild(elemento);
    const leaf = new Set();
    const fathers = new Set();
    const value = new Set();
    let numNodes = [];
    for (let index = 1; index <= nodos; index++) {
        let aux = {};
        let father = network.getConnectedNodes(index, 'from');
        if (father.length > 0) {
            father = father[0];
        } else {
            father = '';
        }
        if (network.getConnectedNodes(index, "to").length == 0) {
            leaf.add(index);
            let val = 0;
            do {
                val = getRndInteger(-100, 100);
            } while (value.has(val));
            value.add(val);
            nodes.update({ id: index, label: `${val}` });
            aux = {
                'index': index,
                'value': val,
                'depth': getDepth(index),
                'father': father
            }
            numNodes.push(aux);
            await sleep(200);
            movements(`Nodo ${index} definido como hoja`);
            checkNode(index, '#7ba9a9');

        } else {
            fathers.add(index);

            aux = {
                'index': index,
                'value': '',
                'depth': getDepth(index),
                'father': father
            }
            numNodes.push(aux);
            nodes.update({ id: index, label: '-' });
            await sleep(200);
            movements(`Nodo ${index} definido como padre `);
            checkNode(index, '#192e2f');
        }
    }

    let minOrMax;
    if (nivel % 2 == 0) {
        minOrMax = true;
    } else {
        minOrMax = false;
    }
    for (let level = nivel; level > 0; level--) {

        let filterByLevelNodes = numNodes.filter((node) => node.depth == level);
        console.table(filterByLevelNodes);
        for (let item of fathers) {

            let filterByFatherNodes = filterByLevelNodes.filter((node) => node.father == item);
            if (filterByFatherNodes.length > 0) {
                console.log(`id del padre : ${item}`);
                console.table(filterByFatherNodes);
                let fatherValues = [];
                for (let i = 0; i < filterByFatherNodes.length; i++) {
                    console.log(`Contenido de filterBy: ${typeof filterByFatherNodes[i].value}`);
                    fatherValues.push(parseInt(filterByFatherNodes[i].value));
                }
                console.log(fatherValues);
                let fatherValue;
                let minOrmAxMessage;
                if (minOrMax) {
                    fatherValue = Math.max(...fatherValues);
                    minOrmAxMessage = 'maximo';
                } else {
                    fatherValue = Math.min(...fatherValues);
                    minOrmAxMessage = 'minimo';
                }
                console.log(fatherValue.toString());
                numNodes[item - 1].value = fatherValue;
                console.log(fatherValue);
                updateLabel(item, fatherValue.toString());
                await sleep(200);
                movements(`Estableciendo el valor ${minOrmAxMessage} ${fatherValue} en el Nodo ${item}`);
                checkNode(item, '#7ba9a9');
            }
        }
        minOrMax = !minOrMax;
    }
    let rootValue = numNodes[0].value;
    let solution = numNodes.filter((node) => node.value == rootValue && leaf.has(node.index));
    console.table(solution);
    checkNode(solution[0].index, '#3a595c');
    await sleep(200);
    movements(`Proceso terminado, dibujando solucion`);
    await drawSolution(solution[0].index);

};



const drawSolution = async (index) => {
    index = parseInt(index);
    let depth = 1;
    while (network.getConnectedNodes(index, 'from').length > 0) {
        let aux = network.getConnectedNodes(index, 'from');
        index = aux[0];
        checkNode(index, '#3a595c');
        await sleep(200);
        movements(`Agregando al nodo ${index} a la ruta solucion`);
        depth++;
    }
    return depth;
}

const movements = (message) => {
    let elemento = document.createElement('li');
    elemento.innerText = message;
    document.getElementById('ul').appendChild(elemento);
}

const updateLabel = (id, label) => {
    nodes.update({ id: id, label: label });

};

const checkNode = (id, color) => {
    nodes.update({ id: id, color: color });
};


