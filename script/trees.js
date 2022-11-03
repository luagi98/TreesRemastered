const nodosHijo = Number(localStorage.getItem("nodoHijo"))
const nodosPadre = Number(localStorage.getItem("nodoPadre"))
const nodoMeta = Number(localStorage.getItem("nodoMeta"))
const amplitud = Number(localStorage.getItem("amplitud"))
const nivel = Number(localStorage.getItem("nivel"))

const minParents = nivel - 1
const minNodes = amplitud + nivel - 2
const parents = new Set()

console.log([nodosHijo, nodosPadre, nodoMeta, amplitud, nivel]);

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

const initTree = () => {
    generateNodes()
    generateBasicEdges()
    console.log(nodosPadre - minParents, amplitud)
    const [remainingNodesInLastLevel, levelToStart, filledLevel, startNode] = generateRemainingParents();
    console.log({ remainingNodesInLastLevel, levelToStart, filledLevel, startNode });
    generateRemainingNodes(remainingNodesInLastLevel, levelToStart, filledLevel, startNode)
    network = new vis.Network(container, data, options);
}

const generateNodes = () => {
    for (let index = 1; index <= nodosHijo + 1; index++) {
        if (index === nodoMeta) {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#d71212`, font: { color: '#edeef0' } }]);
        } else {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#3a595c`, font: { color: '#edeef0' } }]);
        }
    }
    // console.log(nodes);

}

const generateBasicEdges = () => {
    let numberParentNodes = nodosPadre
    for (let i = 0; i < amplitud; i++) {
        edges.add([{ from: 1, to: i + 2 }]);
    }

    edges.add([{ from: 2, to: amplitud + 2 }]);

    for (let index = 0; index < minParents - 2; index++) {
        edges.add([{ from: index + amplitud + 2, to: index + amplitud + 3 }]);
    }
    console.log(data);
}

const generateRemainingParents = () => {
    // if ((nodosPadre - minParents) > 0 && amplitud > 1) {
    let remainingParents = nodosPadre - minParents
    let remainingNodesInLevel = 2
    let filledLevel = 1
    let firstParent = 3
    let startNode = minNodes + 2
    console.log("Entro alv");
    while (remainingParents--) {
        if (remainingNodesInLevel !== nivel) {
            console.log(`remainingNodes: ${remainingNodesInLevel}, firstParent: ${firstParent}`);
            if (remainingNodesInLevel == 2) {
                edges.add([{ from: firstParent, to: startNode++ }]);
            } else {
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

    // console.log([nivel - 2 - (nivel - remainingNodesInLevel), firstParent - 1, filledLevel, startNode]);
    return [(nivel - 2 - (nivel - remainingNodesInLevel)), firstParent - 1, filledLevel, startNode];
    // }
    // else {
    //     return [0, 0, 0, 0]
    // }
}

const generateRemainingNodes = (RNILL, levelToStart, filledLevel, startNode) => {
    if (RNILL === nivel - 2) {
        filledLevel++
        levelToStart++
    }
    // console.log({ filledLevel, levelToStart });
    let auxRNILL = RNILL % (nivel - 2)
    let remainingNodes = nodosHijo - startNode + 2
    if (remainingNodes) {
        let remainingAmplitud
        // console.log({ remainingAmplitud });
        if (auxRNILL > 0) {
            remainingAmplitud = amplitud - filledLevel - 1
            auxRNILL--
        } else {
            remainingAmplitud = amplitud - filledLevel
        }
        let startNodeFilling = (nivel - 2) * filledLevel + amplitud - 1
        console.log({ startNodeFilling });
        // console.log(`remainingNodes: ${remainingNodes}`);
        while (remainingNodes--) {
            if (remainingAmplitud > 0) {
                edges.add([{ from: levelToStart, to: startNode++ }]);
                // console.log({ remainingAmplitud });
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
