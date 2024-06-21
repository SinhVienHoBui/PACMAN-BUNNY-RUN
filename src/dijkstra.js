/* Name: Bui Nhu Y
   ID: ITCSIU21247
   Purpose:  implement the Dijkstra algorithm for pathfinding.
*/

class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.g = 0; // Distance from the node to the start node
      this.f = 0; 
      this.parent = null;
    }
  }
  
  export function dijkstra(map, start, end) {
    let openList = []; // List of nodes to start searching
    let closedList = []; // List of nodes already processed
    let width = map[0].length;
    let height = map.length;
  
    let startNode = new Node(start[0], start[1]);
    let endNode = new Node(end[0], end[1]);
  
    openList.push(startNode);
  
    while (openList.length > 0) {
      let currentNode = openList[0];
      let currentIndex = 0;
  
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].g < currentNode.g) { 
          currentNode = openList[i];
          currentIndex = i;
        }
      }
  
      openList.splice(currentIndex, 1);
      closedList.push(currentNode);
  
      if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
        let path = [];
        let current = currentNode;
        while (current !== null) {
          path.push([current.x, current.y]);
          current = current.parent;
        }
        return path.reverse();
      }
  
      let neighbors = [];
  
      const possibleOption = [0, 4, 5, 6, 7];
  
      // left
      if (currentNode.x - 1 >= 0 && possibleOption.includes(map[currentNode.y][currentNode.x - 1])) {
        neighbors.push(new Node(currentNode.x - 1, currentNode.y));
      }
  
      // right
      if (currentNode.x + 1 < width && possibleOption.includes(map[currentNode.y][currentNode.x + 1])) {
        neighbors.push(new Node(currentNode.x + 1, currentNode.y));
      }
  
      // up
      if (currentNode.y - 1 >= 0 && possibleOption.includes(map[currentNode.y - 1][currentNode.x])) {
        neighbors.push(new Node(currentNode.x, currentNode.y - 1));
      }
  
      // down
      if (currentNode.y + 1 < height && possibleOption.includes(map[currentNode.y + 1][currentNode.x])) {
        neighbors.push(new Node(currentNode.x, currentNode.y + 1));
      }
  
      for (let neighbor of neighbors) {
        if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
          continue;
        }
  
        neighbor.g = currentNode.g + 1; 
        neighbor.f = neighbor.g; 
        if (openList.find(node => node.x === neighbor.x && node.y === neighbor.y && neighbor.g >= node.g)) {
          continue;
        }
  
        neighbor.parent = currentNode;
        openList.push(neighbor);
      }
    }
  
    return [];
  }
  