class GameEngine {
  constructor() {
    this.patterns = ['early5', 'topLine', 'middleLine', 'bottomLine', 'fullHouse'];
  }

  // Generate valid Tambola ticket (3x9 grid, 15 numbers)
  generateTicket() {
    const ticket = [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null]
    ];

    // Each column has specific number ranges
    const columnRanges = [
      [1, 9],    // Col 0: 1-9
      [10, 19],  // Col 1: 10-19
      [20, 29],  // Col 2: 20-29
      [30, 39],  // Col 3: 30-39
      [40, 49],  // Col 4: 40-49
      [50, 59],  // Col 5: 50-59
      [60, 69],  // Col 6: 60-69
      [70, 79],  // Col 7: 70-79
      [80, 90]   // Col 8: 80-90
    ];

    // Each row must have exactly 5 numbers
    // Each column must have 1, 2, or 3 numbers
    // Total 15 numbers on ticket

    const numbersPerColumn = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    // First pass: ensure each column gets at least 1 number
    for (let col = 0; col < 9; col++) {
      const row = Math.floor(Math.random() * 3);
      const [min, max] = columnRanges[col];
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      ticket[row][col] = num;
      numbersPerColumn[col] = 1;
    }

    // Second pass: add remaining 6 numbers (15 - 9 = 6)
    let numbersToAdd = 6;
    while (numbersToAdd > 0) {
      const col = Math.floor(Math.random() * 9);
      const row = Math.floor(Math.random() * 3);
      
      // Check constraints
      const rowCount = ticket[row].filter(n => n !== null).length;
      if (rowCount >= 5) continue;
      if (numbersPerColumn[col] >= 3) continue;
      if (ticket[row][col] !== null) continue;
      
      const [min, max] = columnRanges[col];
      const existingInColumn = [];
      for (let r = 0; r < 3; r++) {
        if (ticket[r][col] !== null) {
          existingInColumn.push(ticket[r][col]);
        }
      }
      
      // Generate unique number for this column
      let num;
      let attempts = 0;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
        attempts++;
      } while (existingInColumn.includes(num) && attempts < 50);
      
      if (attempts < 50) {
        ticket[row][col] = num;
        numbersPerColumn[col]++;
        numbersToAdd--;
      }
    }

    // Sort numbers in each column
    for (let col = 0; col < 9; col++) {
      const colNumbers = [];
      for (let row = 0; row < 3; row++) {
        if (ticket[row][col] !== null) {
          colNumbers.push(ticket[row][col]);
        }
      }
      colNumbers.sort((a, b) => a - b);
      
      let idx = 0;
      for (let row = 0; row < 3; row++) {
        if (ticket[row][col] !== null) {
          ticket[row][col] = colNumbers[idx++];
        }
      }
    }

    return ticket;
  }

  // Call next random number (1-90, no repeats)
  callNumber(calledNumbers) {
    if (calledNumbers.length >= 90) {
      throw new Error('All numbers have been called');
    }

    let number;
    do {
      number = Math.floor(Math.random() * 90) + 1;
    } while (calledNumbers.includes(number));

    return number;
  }

  // Validate claim for a pattern
  validateClaim(ticket, calledNumbers, pattern) {
    const calledSet = new Set(calledNumbers);

    switch (pattern) {
      case 'early5':
        return this.validateEarly5(ticket, calledSet);
      case 'topLine':
        return this.validateLine(ticket, 0, calledSet);
      case 'middleLine':
        return this.validateLine(ticket, 1, calledSet);
      case 'bottomLine':
        return this.validateLine(ticket, 2, calledSet);
      case 'fullHouse':
        return this.validateFullHouse(ticket, calledSet);
      default:
        return false;
    }
  }

  validateEarly5(ticket, calledSet) {
    let count = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== null && calledSet.has(ticket[row][col])) {
          count++;
          if (count >= 5) return true;
        }
      }
    }
    return false;
  }

  validateLine(ticket, lineIndex, calledSet) {
    const line = ticket[lineIndex];
    for (let col = 0; col < 9; col++) {
      if (line[col] !== null && !calledSet.has(line[col])) {
        return false;
      }
    }
    return true;
  }

  validateFullHouse(ticket, calledSet) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== null && !calledSet.has(ticket[row][col])) {
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = GameEngine;
