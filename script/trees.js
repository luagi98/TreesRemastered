class Graph {

    constructor(numVertices) {
        this.numVertices = numVertices;
        this.adjList = new Map();
        this.brokerSearch = false
    }

    addNode(node) {
        this.adjList.set(node, []);
    }
    addEdge(from, to) {
        this.adjList.get(from).push(to);
        this.adjList.get(to).push(from);
    }
    printGraph() {
        let nodes = this.adjList.keys();
        for (let node of nodes) {
            let nodeValues = this.adjList.get(node);
            let conc = "";
            for (let value of nodeValues)
                conc += `${value} `;
            console.log(`${node} -> ${conc}`);
        }
    }
    dfs(startingNode, Goal) {
        let visited = {};
        this.DFSUtil(startingNode, Goal, visited);

    }

    DFSUtil(initNode, Goal, visited) {
        if (this.brokerSearch)
            return
        visited[initNode] = true;
        console.log(initNode);
        let get_neighbours = this.adjList.get(initNode);
        for (let i in get_neighbours) {
            let get_elem = get_neighbours[i];
            if (get_elem === Goal) {
                console.log({ Goal });
                this.brokerSearch = true
                return true
            }
            if (!visited[get_elem])
                if (this.DFSUtil(get_elem, Goal, visited)) {
                    break
                }
        }
        return false
    }

    bfs(startingNode, Goal) {
        let visited = {};
        let q = []
        visited[startingNode] = true;
        q.push(startingNode);
        while (q.length > 0) {
            let getQueueElement = q.shift()
            console.log(getQueueElement);
            let get_List = this.adjList.get(getQueueElement);
            for (let i in get_List) {
                let neigh = get_List[i];
                if (Goal === neigh) {
                    console.log({ Goal });
                    return
                }
                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.push(neigh);
                }
            }
        }
    }
}


const nodosHijo = Number(localStorage.getItem("nodoHijo"))
const nodosPadre = Number(localStorage.getItem("nodoPadre"))
const nodoMeta = Number(localStorage.getItem("nodoMeta"))
const amplitud = Number(localStorage.getItem("amplitud"))
const nivel = Number(localStorage.getItem("nivel"))

const minParents = nivel - 1
const minNodes = amplitud + nivel - 2
const parents = new Set()

const tree = new Graph(nodosHijo + 1)

// console.log([nodosHijo, nodosPadre, nodoMeta, amplitud, nivel]);

const nodes = new vis.DataSet()
const edges = new vis.DataSet()
const data = {
    nodes: nodes,
    edges: edges,
}
const container = document.getElementById("mynetwork")
let network

const options = {
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: "directed",
            parentCentralization: true,
            shakeTowards: "roots",
        },
    },
};


const DFSButton = document.getElementById("dfsButton")
const BFSButton = document.getElementById("bfsButton")

const initTree = () => {
    generateNodes()
    generateBasicEdges()
    const [remainingNodesInLastLevel, levelToStart, filledLevel, startNode] = generateRemainingParents();
    generateRemainingNodes(remainingNodesInLastLevel, levelToStart, filledLevel, startNode)
    network = new vis.Network(container, data, options);
    tree.printGraph()
}

const generateNodes = () => {
    for (let index = 1; index <= nodosHijo + 1; index++) {
        if (index === nodoMeta) {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#d71212`, font: { color: '#edeef0' } }]);
        } else {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#3a595c`, font: { color: '#edeef0' } }]);
        }
        tree.addNode(index)
    }
}

const generateBasicEdges = () => {
    let numberParentNodes = nodosPadre
    for (let i = 0; i < amplitud; i++) {
        edges.add([{ from: 1, to: i + 2 }]);
        tree.addEdge(1, i + 2)
    }

    edges.add([{ from: 2, to: amplitud + 2 }]);
    tree.addEdge(2, amplitud + 2)

    for (let index = 0; index < minParents - 2; index++) {
        edges.add([{ from: index + amplitud + 2, to: index + amplitud + 3 }]);
        tree.addEdge(index + amplitud + 2, index + amplitud + 3)
    }
    // console.log(data);
}

const generateRemainingParents = () => {
    let remainingParents = nodosPadre - minParents
    let remainingNodesInLevel = 2
    let filledLevel = 1
    let firstParent = 3
    let startNode = minNodes + 2
    // console.log("Entro alv");
    while (remainingParents--) {
        if (remainingNodesInLevel !== nivel) {
            // console.log(`remainingNodes: ${remainingNodesInLevel}, firstParent: ${firstParent}`);
            if (remainingNodesInLevel == 2) {
                tree.addEdge(firstParent, startNode)
                edges.add([{ from: firstParent, to: startNode++ }]);
            } else {
                tree.addEdge(startNode - 1, startNode)
                edges.add([{ from: startNode - 1, to: startNode++ }]);
            }
            remainingNodesInLevel++
        } else {
            remainingNodesInLevel = 2
            firstParent++
            remainingParents++
            filledLevel++
        }
    }
    return [(nivel - 2 - (nivel - remainingNodesInLevel)), firstParent - 1, filledLevel, startNode];
}

const generateRemainingNodes = (RNILL, levelToStart, filledLevel, startNode) => {
    if (RNILL === nivel - 2) {
        filledLevel++
        levelToStart++
    }
    let auxRNILL = RNILL % (nivel - 2)
    let remainingNodes = nodosHijo - startNode + 2
    if (remainingNodes) {
        let remainingAmplitud
        if (auxRNILL > 0) {
            remainingAmplitud = amplitud - filledLevel - 1
            auxRNILL--
        } else {
            remainingAmplitud = amplitud - filledLevel
        }
        let startNodeFilling = (nivel - 2) * filledLevel + amplitud - 1
        // console.log({ startNodeFilling });
        while (remainingNodes--) {
            if (remainingAmplitud > 0) {
                tree.addEdge(levelToStart ?? 1, startNode);
                edges.add([{ from: levelToStart, to: startNode++ }]);
                remainingAmplitud--
            } else {
                levelToStart = startNodeFilling
                startNodeFilling++
                if (auxRNILL > 0) {
                    remainingAmplitud = amplitud - filledLevel - 1
                    auxRNILL--
                } else {
                    remainingAmplitud = amplitud - filledLevel
                }
                remainingNodes++
            }
        }
    }
}

initTree()

DFSButton.addEventListener('click', () => tree.dfs(1, nodoMeta))
BFSButton.addEventListener('click', () => tree.bfs(1, nodoMeta))
