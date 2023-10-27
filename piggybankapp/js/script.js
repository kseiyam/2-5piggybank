// Initial hardcoded values
var savingsGoal = 800; // User's goal, hardcoded for now
var yAxisMax = Math.ceil(savingsGoal / 1000) * 1000; // Adjust y-axis range to be a multiple of 1000
var currentSavings = parseFloat(document.getElementById("savingsAmount").textContent.replace('$', ''));
var remaining = Math.max(savingsGoal - currentSavings, 0); // Calculate remaining amount, ensure it doesn't go below 0

// Function to add money to savings
function addToSavings() {
    var addAmount = parseFloat(document.getElementById("addAmount").value);

    // Check if the input amount is a valid number and greater than 0
    if (!isNaN(addAmount) && addAmount > 0) {
        currentSavings += addAmount;
        document.getElementById("savingsAmount").textContent = '$' + currentSavings.toFixed(2);
        updateYAxisMax(currentSavings); // Update y-axis max if needed
        updateChart(currentSavings); // Update chart with new savings
        updateGoalLabel(); // Update the goal label
    } else {
        alert("Please enter a valid amount");
    }

    document.getElementById("addAmount").value = ''; // Reset input field
}

// Function to subtract money from savings
function subtractFromSavings() {
    var subtractAmount = parseFloat(document.getElementById("subtractAmount").value);

    // Check if the input amount is a valid number and greater than 0
    if (!isNaN(subtractAmount) && subtractAmount > 0) {
        // Ensure subtraction amount does not exceed current savings
        if (subtractAmount <= currentSavings) {
            currentSavings -= subtractAmount;
            document.getElementById("savingsAmount").textContent = '$' + currentSavings.toFixed(2);
            updateYAxisMax(currentSavings); // Update y-axis max if needed
            updateChart(currentSavings); // Update chart with new savings
            updateGoalLabel(); // Update the goal label
        } else {
            alert("Cannot subtract more than the current savings");
        }
    } else {
        alert("Please enter a valid amount");
    }

    document.getElementById("subtractAmount").value = ''; // Reset input field
}

// Function to update the chart with new amount
function updateChart(amount) {
    savingsChart.data.labels.push(updateCount++);
    savingsChart.data.datasets[0].data.push(amount);
    savingsChart.update();
}

// Function to update the goal label on the chart
function updateGoalLabel() {
    remaining = Math.max(savingsGoal - currentSavings, 0);
    savingsChart.options.plugins.annotation.annotations.line1.label.content = 'Goal: $' + savingsGoal + ' (You need $' + remaining.toFixed(2) + ' to reach goal)';
    savingsChart.update();
}

// Chart.js setup
var ctx = document.getElementById('savingsChart').getContext('2d');
var savingsData = [currentSavings]; // Starting point based on current savings
var updateCount = 1; // Counter for chart updates

var savingsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Start'],
        datasets: [{
            label: 'Savings',
            data: savingsData,
            fill: false,
            borderColor: 'blue',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: yAxisMax // Set y-axis max
            }
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 40,
                bottom: 10
            }
        },
        plugins: {
            legend: {
                display: false // Hide legend
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: savingsGoal, // Goal line
                        yMax: savingsGoal, // Goal line
                        borderColor: 'green',
                        borderWidth: 4,
                        label: {
                            content: 'Goal: $' + savingsGoal + ' (You need $' + remaining.toFixed(2) + ' to reach goal)',
                            enabled: true,
                            position: 'start'
                        }
                    }
                }
            }
        }
    }
});

// Function to update the y-axis maximum dynamically
function updateYAxisMax(newAmount) {
    if (newAmount > yAxisMax) {
        yAxisMax = Math.ceil(newAmount / 1000) * 1000; // Adjust to next 1000 mark
        savingsChart.options.scales.y.max = yAxisMax;
        savingsChart.update();
    }
}

// Event listener to resize the chart when the window is resized
window.addEventListener('resize', function() {
    savingsChart.resize();
});
