const { expect } = require('chai');

// Simple calculator function for demonstration
function add(a, b) {
    return a + b;
}

describe('Calculator', () => {
    describe('add function', () => {
        it('should add two positive numbers correctly', () => {
            expect(add(2, 3)).to.equal(5);
        });

        it('should handle negative numbers', () => {
            expect(add(-1, 1)).to.equal(0);
        });

        it('should handle zero', () => {
            expect(add(0, 5)).to.equal(5);
        });
    });
}); 