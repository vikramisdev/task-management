import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Task, TaskService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  tasks: Task[] = [];

  newTaskTitle: string = '';
  newTaskDescription: string = '';
  taskIdCounter: number = 1;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Fetch tasks from the service when the component initializes
    this.loadTasks();
  }

  // Fetch tasks using the taskService
  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  // Add a new task to the list
  addTask(): void {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: this.taskIdCounter++,  // This can be handled by the backend for better consistency
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        completed: false,
      };

      // Add task to the list and reset form
      this.taskService.addTask(newTask).subscribe((task: Task) => {
        this.tasks.push(task);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      });
    }
  }

  // Toggle task completion status
  toggleTaskCompletion(taskId: number): void {
    const taskToUpdate = this.tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      taskToUpdate.completed = !taskToUpdate.completed;
      this.taskService.updateTask(taskToUpdate).subscribe();
    }
  }

  // Delete task from the list
  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    });
  }
}
