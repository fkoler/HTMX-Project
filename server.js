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

// Handle POST request for contacts search
const contacts = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Doe', email: 'jane@example.com' },
    { name: 'Alice Smith', email: 'alice@example.com' },
    { name: 'Bob Williams', email: 'bob@example.com' },
    { name: 'Mary Harris', email: 'mary@example.com' },
    { name: 'David Mitchell', email: 'david@example.com' },
];

app.post('/search', (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send('<tr></tr>');
    }

    const searchResults = contacts.filter((contact) => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);
    });

    setTimeout(() => {
        const searchResultHtml = searchResults
            .map(
                (contact) => `
      <tr>
        <td><div class="my-4 p-2">${contact.name}</div></td>
        <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
    `
            )
            .join('');

        res.send(searchResultHtml);
    }, 500);
});

// Handle POST request for contacts search from jsonplaceholder
app.post('/search/api', async (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send('<tr></tr>');
    }

    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const contacts = await response.json();

    const searchResults = contacts.filter((contact) => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);
    });

    setTimeout(() => {
        const searchResultHtml = searchResults
            .map(
                (contact) => `
      <tr>
        <td><div class="my-4 p-2">${contact.name}</div></td>
        <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
    `
            )
            .join('');

        res.send(searchResultHtml);
    }, 500);
});

// Handle POST request for email validation
app.post('/contact/email', (req, res) => {
    const submittedEmail = req.body.email;
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const isValid = {
        message: 'That email is valid',
        class: 'text-green-700',
    };

    const isInvalid = {
        message: 'Please enter a valid email address',
        class: 'text-red-700',
    };

    if (!emailRegex.test(submittedEmail)) {
        return res.send(
            `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isInvalid.class}">${isInvalid.message}</div>
    </div>
      `
        );
    } else {
        return res.send(
            `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isValid.class}">${isValid.message}</div>
    </div>
      `
        );
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
