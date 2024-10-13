/* eslint-disable no-undef */
describe('Sudoku Game - Win the Game', () => {
  beforeEach(() => {
    // Visit the game page (assuming it's served at the root URL)
    cy.visit('http://localhost:3000');
  });

  it('should play the game and win it', () => {
    // Wait for the grid to render
    cy.get('.grid').should('exist');

    // Function to find empty cells and fill them with valid numbers
    const fillEmptyCells = () => {
      // Assuming each cell has a specific class, for example 'cell', and data attributes for row and column
      cy.get('.cell').each(($cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        // If the cell is empty, fill it with a valid number
        if ($cell.text().trim() === '') {
          cy.wrap($cell).click(); // Click the empty cell

          // Randomly select a number to fill in (assuming .number contains number buttons from 1 to 9)
          // Adjust this logic to correctly select a number based on Sudoku rules
          const randomNumber = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
          cy.get(`.number:contains(${randomNumber})`).click(); // Click the selected random number
        }
      });
    };

    // Call the function to fill empty cells
    fillEmptyCells();

    // Verify that the game is won by checking for the "Congratulations" message
    cy.contains('Congratulations, You Won!').should('be.visible');
  });
});
