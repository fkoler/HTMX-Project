import express from 'express';

const app = express();

// Set static folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request to fetch users
app.get('/users', async (req, res) => {
    // const users = [
    //     { id: 1, name: 'John Doe' },
    //     { id: 2, name: 'Bob Williams' },
    //     { id: 3, name: 'Shannon Jackson' },
    // ];

    setTimeout(async () => {
        const limit = +req.query.limit || 10;

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
        );

        const users = await response.json();

        res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join('')}
    </ul>
    `);
    }, 500);
});

// Handle POST request for temp conversion
app.post('/convert', (req, res) => {
    setTimeout(() => {
        const fahrenheit = +req.body.fahrenheit;
        const celsius = ((fahrenheit - 32) * (5 / 9)).toFixed(1);

        res.send(`
      <p>
        ${fahrenheit} degrees Farenheit is equal to ${celsius} degrees Celsius
      </p>
    `);
    }, 500);
});

// Handle GET request for polling example
let counter = 0;
app.get('/poll', (req, res) => {
    counter++;

    const data = { value: counter };

    res.json(data);
});

// Handle GET request for weather
let currentTemperature = 20;
app.get('/get-temperature', (req, res) => {
    currentTemperature += Math.random() * 2 - 1; // Random temp change
    res.send(currentTemperature.toFixed(1) + '°C');
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
