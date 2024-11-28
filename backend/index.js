const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const tasksFile = './tasks.json';

const readTasks = () => {
    if (fs.existsSync(tasksFile)) {
        try {
            const data = fs.readFileSync(tasksFile, 'utf8');
            if (data.trim() === '') return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON from file:', error);
            return [];
        }
    }
    return [];
};

const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.send("Visit /tasks route for the Tasks, Currently tasks are available.");
});

app.get('/tasks', (req, res) => {
    res.json(readTasks());
});

app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const index = tasks.findIndex((task) => task.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Task not found');
    tasks[index] = { ...tasks[index], ...req.body };
    writeTasks(tasks);
    res.json(tasks[index]);
});


app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const updatedTasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
    writeTasks(updatedTasks);
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

