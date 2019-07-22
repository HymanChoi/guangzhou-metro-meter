let Dijkstra = function () {
    let graph = {};

    function addEdge(source, target, weight) {
        if (!(source in graph)) graph[source] = {};
        if (!(target in graph)) graph[target] = {};
        if ("number" != typeof weight) weight = 1;
        graph[source][target] = weight,
            graph[target][source] = weight
    }

    // 将edges数组拆分成小数组
    function addEdges(edges) {
        for (let i = 0; i < edges.length; ++i) {
            let edge = edges[i];
            addEdge(edge[0], edge[1], edge[2])
        }
    }

    function shortestPath(source, target) {
        // 判断起始点与终点是否在graph数组中
        if (!(source in graph) || !(target in graph)) return 1 / 0;
        let dist = {},
            visited = {},
            numVertex = 0;
        for (let v in graph) dist[v] = 1 / 0,
            numVertex++;
        dist[source] = 0;
        for (let i = 0; i < numVertex; ++i) {
            let minDist = 1 / 0,
                minV = void 0;
            for (let v in dist)
                if (!(v in visited)) {
                    if (minDist > dist[v]) minDist = dist[v],
                        minV = v
                } else;
            if (void 0 === minV) break;
            if (minV === target) return minDist;
            visited[minV] = true;
            let edges = graph[minV];
            for (let v in edges)
                if (!(v in visited)) {
                    let newDist = minDist + edges[v];
                    if (dist[v] > newDist) dist[v] = newDist
                } else;
        }
        return 1 / 0
    }

    return {
        addEdge: addEdge,
        addEdges: addEdges,
        shortestPath: shortestPath
    }
}();

export default Dijkstra