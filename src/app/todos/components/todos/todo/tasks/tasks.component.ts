import { Component, Input, OnInit } from '@angular/core'
import { TasksService } from 'src/app/todos/services/tasks.service'
import { Observable } from 'rxjs'
import { Task } from 'src/app/todos/models/tasks.models'

@Component({
  selector: 'tl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  @Input() todoId!: string
  tasks$?: Observable<Task[]>
  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks(this.todoId)
  }
}
