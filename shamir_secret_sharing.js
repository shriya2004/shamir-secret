// Import the required modules
const fs = require("fs");

// Function to decode a value from a given base to base 10
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to solve for the polynomial using Lagrange Interpolation
function lagrangeInterpolation(points) {
    const n = points.length;
    let constantTerm = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= -points[j][0] / (xi - points[j][0]);
            }
        }

        constantTerm += yi * li;
    }

    return Math.round(constantTerm); // Ensure the result is an integer
}

// Main function
function findSecret(filename) {
    // Read and parse the JSON input
    const input = JSON.parse(fs.readFileSync(filename, "utf-8"));

    const { n, k } = input.keys;
    const points = [];

    // Decode the (x, y) pairs from the JSON
    Object.keys(input).forEach((key) => {
        if (!isNaN(parseInt(key))) {
            const x = parseInt(key);
            const base = parseInt(input[key].base);
            const y = decodeValue(base, input[key].value);
            points.push([x, y]);
        }
    });

    // Select the first k points (minimum required to solve for the polynomial)
    const selectedPoints = points.slice(0, k);

    // Solve for the constant term using Lagrange Interpolation
    const secret = lagrangeInterpolation(selectedPoints);

    return secret;
}

// Find the secret for both test cases
const secret1 = findSecret("testcase1.json");
const secret2 = findSecret("testcase2.json");

console.log(`Secret for Test Case 1: ${secret1}`);
console.log(`Secret for Test Case 2: ${secret2}`);
