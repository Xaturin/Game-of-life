const app = document.querySelector('#app');

class GameOfLife {
  #cells = [];
  #state = 0;
  #interval = null;

  constructor(height, width) {
    this.height = height;
    this.width = width;

    this.count = 0;

    document.documentElement.style.setProperty('--table-width', width);
    document.documentElement.style.setProperty('--table-height', height);

    this.createField();
  }

  get cells() {
    return this.#cells;
  }

  createField = () => {
    let index = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = index;
        cell.addEventListener('click', this.cellClickHandler);
        cell.addEventListener('mouseover', this.cellMouseOverHandler);
        app.append(cell);
        index++;
      }
    }

    this.#cells = [...document.querySelectorAll('.cell')].map((_) => 0);
    this.updateState();

    const startButton = document.querySelector('#start');
    startButton.addEventListener('click', () =>
      !this.#state ? this.start() : this.stop()
    );
  };

  start = () => {
    this.#interval = setInterval(this.nextGen, 100);
    this.#state = 1;
  };

  stop = () => {
    clearInterval(this.#interval);
    this.#state = 0;
  };

  cellMouseOverHandler = () => {
    if (event.shiftKey) {
      event.currentTarget.classList.add('live');
      this.#cells[event.currentTarget.id] = 1;
    }
    if (event.ctrlKey) {
      event.currentTarget.classList.remove('live');
      this.#cells[event.currentTarget.id] = 0;
    }
  };

  cellClickHandler = (event) => {
    event.currentTarget.classList.toggle('live');
    if (this.#cells[event.currentTarget.id] == 0)
      this.#cells[event.currentTarget.id] = 1;
    else this.#cells[event.currentTarget.id] = 0;
  };

  /*
   */
  nextGen = () => {
    this.#cells = this.#cells.map((cell, index) => {
      const neighbourCount = this.calculateNeighbours(index);
      let state = cell;
      if (cell == 1) {
        if (neighbourCount < 2 || neighbourCount > 3) state = 0;
      } else {
        if (neighbourCount === 3) state = 1;
      }

      return state;
    });
    this.count++;
    this.updateState();
  };

  updateState = () => {
    this.#cells.forEach((cell, index) => {
      const _cell = document.getElementById(index);
      if (cell) _cell.classList.add('live');
      else _cell.classList.remove('live');
    });
    document.querySelector('.generation').textContent = this.count;
  };

  /*
    We need to calculate count of neighbours for given index.
    Left and right neighbours are just +- 1 index 
    Up and down: +- height of the field
    Diagonal neighbours: +- height +- 1
    */
  calculateNeighbours = (index) => {
    let neighbourCount = 0;

    //check left neighbour
    const column = ~~(index / this.width);
    const row = index % this.width;

    if (row > 0) this.#cells[+index - 1] ? neighbourCount++ : void 0;

    // check right neighbour
    if (row < this.width - 1)
      this.#cells[+index + 1] ? neighbourCount++ : void 0;

    // check top neighbour
    if (column > 0)
      this.#cells[+index - this.width] ? neighbourCount++ : void 0;

    // check bot neighbour
    if (column < this.height - 1)
      this.#cells[+index + this.width] ? neighbourCount++ : void 0;

    // check top left neighbour
    if (row > 0 && column > 0)
      this.#cells[+index - 1 - this.width] ? neighbourCount++ : void 0;

    // check top right neighbour
    if (row < this.width - 1 && column > 0)
      this.#cells[+index + 1 - this.width] ? neighbourCount++ : void 0;

    // check bot left neighbour
    if (row > 0 && column < this.height - 1)
      this.#cells[+index - 1 + this.width] ? neighbourCount++ : void 0;

    // check bot right neighbour
    if (row < this.width - 1 && column < this.height - 1)
      this.#cells[+index + 1 + this.width] ? neighbourCount++ : void 0;

    return neighbourCount;
  };
}

const gof = new GameOfLife(30, 50);
