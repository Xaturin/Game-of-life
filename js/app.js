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
      const neighborCount = this.calculateNeighbors(index);
      let state = cell;
      if (cell == 1) {
        if (neighborCount < 2 || neighborCount > 3) state = 0;
      } else {
        if (neighborCount === 3) state = 1;
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
    We need to calculate count of neighbors for given index.
    Left and right neighbors are just +- 1 index 
    Up and down: +- height of the field
    Diagonal neighbors: +- height +- 1
    */
  calculateNeighbors = (index) => {
    let neighborCount = 0;

    //check left neighbor
    const column = ~~(index / this.width);
    const row = index % this.width;

    if (row > 0) this.#cells[+index - 1] ? neighborCount++ : void 0;

    // check right neighbor
    if (row < this.width - 1)
      this.#cells[+index + 1] ? neighborCount++ : void 0;

    // check top neighbor
    if (column > 0) this.#cells[+index - this.width] ? neighborCount++ : void 0;

    // check bot neighbor
    if (column < this.height - 1)
      this.#cells[+index + this.width] ? neighborCount++ : void 0;

    // check top left neighbor
    if (row > 0 && column > 0)
      this.#cells[+index - 1 - this.width] ? neighborCount++ : void 0;

    // check top right neighbor
    if (row < this.width - 1 && column > 0)
      this.#cells[+index + 1 - this.width] ? neighborCount++ : void 0;

    // check bot left neighbor
    if (row > 0 && column < this.height - 1)
      this.#cells[+index - 1 + this.width] ? neighborCount++ : void 0;

    // check bot right neighbor
    if (row < this.width - 1 && column < this.height - 1)
      this.#cells[+index + 1 + this.width] ? neighborCount++ : void 0;

    return neighborCount;
  };
}

const gof = new GameOfLife(30, 50);
