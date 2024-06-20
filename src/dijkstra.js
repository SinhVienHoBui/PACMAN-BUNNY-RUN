
class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.g = 0; // Distance from the node to the start node
      this.f = 0; // Dijkstra's algorithm only needs the cost (g)
      this.parent = null;
    }
  }
