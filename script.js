// Declare arrays to hold the bar heights, DOM elements for bars, and values of the bars.
let heights = [];
let bars = [];
let barValues = [];

// Access the slider elements from the DOM to adjust the number of bars and speed.
let barSlider = document.getElementById('barSlider');
let n = barSlider.value; // Number of bars, based on slider value.
let speedSlider = document.getElementById('speedSlider');
let delay = 375 - speedSlider.value; // Delay in animation (higher value = slower animation).

// Access the container element to place the bars inside.
let container = document.getElementById('container');
let width = container.offsetWidth; // Width of the container to calculate bar widths.
let height = container.offsetHeight; // Height of the container, used for random heights.
let lineWidth = width / n - 1; // Calculate width for each bar based on number of bars.

let isStopped = true; // Flag to indicate if the sorting is stopped.
let isPaused = false; // Flag to indicate if sorting is paused.
let isGenerated = true; // Flag to check if the array has been generated.
let isSorted = false; // Flag to check if the array has been sorted.

// Stack class used in the quick sort algorithm to track the subarray indices.
class Stack {
  constructor() {
    this.arr = [];
    this.top = -1;
  }
  push(element) {
    this.top++;
    this.arr.push(element);
  }
  isEmpty() {
    return this.top == -1;
  }
  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.arr.pop();
    }
  }
}

// Generate a random value between the specified range.
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate random heights for the bars and display them in the container.
function generateRandomArray() {
  isGenerated = true;
  isSorted = false;
  isStopped = true;
  isPaused = false;
  n = barSlider.value; // Update the number of bars based on slider.
  lineWidth = width / n - 1; // Update the bar width.
  container.innerHTML = ''; // Clear the container before rendering new bars.

  // Generate bars and display them in the container.
  for (let i = 0; i < n; i++) {
    heights[i] = parseInt(getRandomValue(1, height)); // Random height for each bar.
    bars.push(document.createElement('div')); // Create a new div for each bar.
    bars[i].style.width = `${lineWidth}px`; // Set the width of the bar.
    bars[i].style.height = `${heights[i]}px`; // Set the height of the bar.
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`; // Position the bar in the container.
    bars[i].style.backgroundColor = 'white'; // Default color of the bar.
    bars[i].className = 'bar'; // Assign a CSS class for styling.
    container.appendChild(bars[i]); // Add the bar to the container.

    // If the number of bars is less than or equal to 60, display the bar values.
    if (n <= 60) {
      barValues.push(document.createElement('div')); // Create a div for the bar value.
      barValues[i].innerHTML = heights[i]; // Display the height value.
      barValues[i].style.marginBottom = `${heights[i] + 5}px`; // Position the value below the bar.
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`; // Position the value.
      barValues[i].className = 'barValue'; // CSS class for the bar value.
      container.appendChild(barValues[i]); // Add the bar value to the container.
    }
  }
}
generateRandomArray(); // Generate the initial random array.

// Function to update the display of the swapped numbers (for visualization purposes).
function updateSwappedNumbers(num1, num2) {
  const swappedPairElement = document.getElementById('swappedPair');
  swappedPairElement.textContent = `${num1} and ${num2}`;
}

// Render a custom array input by the user.
document.getElementById('customArrayButton').addEventListener('click', () => {
  const customArrayInput = document.getElementById('customArray').value;

  if (!customArrayInput.trim()) {
    alert('Please enter a valid array.');
    return;
  }

  // Parse the user input into an array of numbers.
  const customArray = customArrayInput.split(',').map(Number);

  // Validate the input to ensure it contains only numbers.
  if (customArray.some(isNaN)) {
    alert('Array contains invalid numbers. Please enter only numbers separated by commas.');
    return;
  }

  // Update the global variables with the new custom array.
  isGenerated = true;
  isSorted = false;
  isStopped = true;
  isPaused = false;

  heights = customArray.slice();
  bars = [];
  barValues = [];
  n = heights.length;
  lineWidth = width / n - 1;
  container.innerHTML = ''; // Clear the container before rendering custom bars.

  // Create and display the custom bars.
  for (let i = 0; i < n; i++) {
    bars.push(document.createElement('div'));
    bars[i].style.width = `${lineWidth}px`;
    bars[i].style.height = `${heights[i]}px`;
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`;
    bars[i].style.backgroundColor = 'white';
    bars[i].className = 'bar';
    container.appendChild(bars[i]);

    if (n <= 60) {
      barValues.push(document.createElement('div'));
      barValues[i].innerHTML = heights[i];
      barValues[i].style.marginBottom = `${heights[i] + 5}px`;
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`;
      barValues[i].className = 'barValue';
      container.appendChild(barValues[i]);
    }
  }
});

// Swap two bars and animate their transformation.
function swap(i, minindex) {
  // Swap the heights of the two bars.
  [heights[i], heights[minindex]] = [heights[minindex], heights[i]];

  // Swap the DOM elements of the two bars.
  [bars[i], bars[minindex]] = [bars[minindex], bars[i]];
  [bars[i].style.transform, bars[minindex].style.transform] = [bars[minindex].style.transform, bars[i].style.transform];

  // Swap the bar values and update their positions.
  [barValues[i], barValues[minindex]] = [barValues[minindex], barValues[i]];
  [barValues[i].style.transform, barValues[minindex].style.transform] = [
    barValues[minindex].style.transform,
    barValues[i].style.transform,
  ];

  // Update the swapped numbers display.
  updateSwappedNumbers(heights[i], heights[minindex]);
}

// Function to redraw the bars with their updated heights and colors.
function draw(coloredBars, colors) {
  // Reset all bars to their default color.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    for (let j = 0; j < coloredBars.length; j++) {
      if (i == coloredBars[j]) {
        bars[i].style.backgroundColor = colors[j]; // Change color if the bar index is in the coloredBars array.
        break;
      }
    }
  }
}

// Sleep function to add delays in the animation.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Animation to show when the array is sorted.
async function SortedAnimation() {
  // Color the bars green to indicate the array is sorted.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'lime';
    await sleep(10); // Delay between each bar.
  }
  await sleep(300);
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    await sleep(10);
  }
}

// Sorting algorithm implementations start here...

// Bubble Sort algorithm with visualization.
async function bubbleSort() {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (isStopped) {
        draw([], []); // Stop the drawing if sorting is stopped.
        return;
      }
      if (!isPaused) {
        if (heights[j] > heights[j + 1]) {
          swap(j, j + 1); // Swap bars if they are in the wrong order.
        }
        draw([j, j + 1], ['green', 'yellow']); // Highlight the two bars being compared.
      } else {
        j--; // Stay at the same index if paused.
      }
      await sleep(delay);
    }
  }
  console.log('Bubble sort completed.');
  draw([], []); // Reset the colors.
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation(); // Play the sorted animation.
}

// Selection Sort algorithm with visualization.
async function selectionSort() {
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (isStopped) {
        draw([], []); // Stop the drawing if sorting is stopped.
        return;
      }
      if (!isPaused) {
        if (heights[j] < heights[minIndex]) {
          minIndex = j; // Find the index of the minimum element.
        }
        draw([i, j, minIndex], ['blue', 'red', 'green']); // Highlight the current index and minIndex.
      } else {
        j--; // Stay at the same index if paused.
      }
      await sleep(delay);
    }
    swap(i, minIndex); // Swap the found minimum element with the current element.
  }
  console.log('Selection sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// Insertion Sort algorithm with visualization.
async function insertionSort() {
  for (let i = 0; i < n; i++) {
    let key = heights[i];
    for (let j = i - 1; j >= 0 && heights[j] > key; j--) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        swap(j, j + 1); // Shift elements and insert the key at the correct position.
        draw([j, i + 1], ['green', 'red']); // Highlight the current and key indices.
      } else {
        j++; // Stay at the same index if paused.
      }
      await sleep(delay);
    }
  }
  console.log('Insertion sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// Merge Sort algorithm with visualization.
async function mergeSort() {
  for (let curSize = 1; curSize < n; curSize *= 2) {
    for (let start = 0; start < n - 1; start += 2 * curSize) {
      let mid = Math.min(start + curSize - 1, n - 1);
      let end = Math.min(start + 2 * curSize - 1, n - 1);
      let n1 = mid - start + 1;
      let n2 = end - mid;
      let L = [],
        R = [];
      for (let i = 0; i < n1; i++) L.push(heights[start + i]);
      for (let j = 0; j < n2; j++) R.push(heights[mid + 1 + j]);
      let i = 0,
        j = 0,
        k = start;

      let barsIndices = [];
      let barsColors = [];
      for (let i1 = start; i1 <= end; i1++) {
        barsIndices.push(i1);
        barsColors.push('yellow');
      }

      while (i < n1 || j < n2) {
        if (isStopped) {
          draw([], []);
          return;
        }
        if (!isPaused) {
          if (j == n2 || (i < n1 && L[i] <= R[j])) {
            draw([k, ...barsIndices], ['green', ...barsColors]);
            i++;
          } else {
            for (let i1 = mid + 1 + j; i1 > k; i1--) {
              swap(i1, i1 - 1);
            }
            draw([k, ...barsIndices], ['green', ...barsColors]);
            j++;
          }
          k++;
        }
        await sleep(delay);
      }
    }
  }
  console.log('Merge sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// Quick Sort algorithm with visualization.
async function quickSort() {
  let s = new Stack();
  s.push(0);
  s.push(n - 1);
  while (!s.isEmpty()) {
    let h = s.pop();
    let l = s.pop();

    let i = l - 1;

    let barsIndices = [];
    let barsColors = [];
    for (let i1 = l; i1 <= h; i1++) {
      barsIndices.push(i1);
      barsColors.push('yellow');
    }

    for (let j = l; j <= h - 1; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        draw([i, j, ...barsIndices], ['green', 'red', ...barsColors]);
        if (heights[j] <= heights[h]) {
          i++;
          swap(i, j); // Swap the elements.
        }
      } else {
        j--;
      }
      await sleep(delay);
    }
    swap(i + 1, h);
    let partition = i + 1;
    if (l < partition - 1) {
      s.push(l);
      s.push(partition - 1); // Recursively push left subarray.
    }
    if (partition + 1 < h) {
      s.push(partition + 1);
      s.push(h); // Recursively push right subarray.
    }
  }
  console.log('Quick sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// When the slider value is changed, regenerate the bars and update the bar count display.
barSlider.oninput = () => {
  document.querySelector('.sliderValue').innerHTML = `Bars: ${barSlider.value}`;
  generateRandomArray();
};

// When the speed slider is adjusted, update the delay between animations.
speedSlider.oninput = () => {
  delay = 375 - speedSlider.value;
};

// Event listeners for buttons (Generate, Sort, Stop, Pause/Resume).
document.getElementById('generateButton').addEventListener('click', () => {
  const swappedPairElements = document.getElementById('swappedPair');
  swappedPairElements.textContent = `None`; // Reset the swapped pair display.
  generateRandomArray();
});

document.getElementById('sortButton').addEventListener('click', () => {
  const type = document.getElementById('sort_type').value; // Get selected sort type.

  if (!isStopped) return; // Prevent sorting if sorting is already in progress.

  if (isSorted || !isGenerated) generateRandomArray(); // Generate a new array if already sorted.

  isGenerated = false;
  isPaused = false;
  isStopped = false;

  // Call the selected sorting function based on user input.
  if (type == 'bubble') bubbleSort();
  else if (type == 'selection') selectionSort();
  else if (type == 'insertion') insertionSort();
  else if (type == 'merge') mergeSort();
  else if (type == 'quick') quickSort();
});

document.getElementById('stopButton').addEventListener('click', () => {
  isStopped = true;
  isPaused = false;
  document.getElementById('pauseButton').innerHTML = 'Pause'; // Reset pause button text.

  // Generate random bars if they have not been generated already.
  if (!isGenerated && !isSorted) generateRandomArray();
  const swappedPairElements = document.getElementById('swappedPair');
  swappedPairElements.textContent = `None`; // Reset the swapped pair display.
});

document.getElementById('pauseButton').addEventListener('click', () => {
  if (!isStopped) {
    // Toggle between pause and resume when sorting is in progress.
    if (isPaused) {
      document.getElementById('pauseButton').innerHTML = 'Pause';
      isPaused = false;
    } else {
      document.getElementById('pauseButton').innerHTML = 'Resume';
      isPaused = true;
    }
  }
});
