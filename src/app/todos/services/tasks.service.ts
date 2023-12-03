import { LoggerService } from 'src/app/shared/services/logger.service'
import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, EMPTY } from 'rxjs'
import {
  DomainTask,
  GetTasksResponse,
  Task,
  UpdateTaskRequest,
} from 'src/app/todos/models/tasks.models'
import { environment } from 'src/environments/environment'
import { catchError, map } from 'rxjs/operators'
import { CommonResponseType } from 'src/app/core/models/core.models'

const tasksLoggerFile = 'TasksLogger'

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks$ = new BehaviorSubject<DomainTask>({})
  constructor(private http: HttpClient, private loggerService: LoggerService) {
    this.loggerService.info('Taks service initialized', tasksLoggerFile)
  }
  getTasks(todoId: string) {
    this.loggerService.info('Getting new tasks from the server...', tasksLoggerFile)
    this.http
      .get<GetTasksResponse>(`${environment.baseUrl}/todo-lists/${todoId}/tasks`)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(map(res => res.items))
      .subscribe((res: Task[]) => {
        const stateTasks = this.tasks$.getValue()
        stateTasks[todoId] = res
        this.tasks$.next(stateTasks)
        this.loggerService.info('new tasks recieved, data updated', tasksLoggerFile)
      })
  }
  addTask(todoId: string, title: string) {
    this.loggerService.info('sending new task to the server...', tasksLoggerFile)
    this.http
      .post<CommonResponseType<{ item: Task }>>(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks`,
        { title }
      )
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(res => {
          const stateTasks = this.tasks$.getValue()
          const newTask = res.data.item
          const newTasks = [newTask, ...stateTasks[todoId]]
          stateTasks[todoId] = newTasks
          return stateTasks
        })
      )
      .subscribe(res => {
        this.tasks$.next(res)
        this.loggerService.info('new task added successfuly', tasksLoggerFile)
      })
  }
  deleteTask(todoId: string, taskId: string) {
    this.loggerService.info('deleting task from server...', tasksLoggerFile)
    this.http
      .delete<CommonResponseType>(`${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(() => {
          const stateTasks = this.tasks$.getValue()
          const taskForTodo = stateTasks[todoId]
          stateTasks[todoId] = taskForTodo.filter(({ id }) => id !== taskId)
          return stateTasks
        })
      )
      .subscribe(res => {
        this.tasks$.next(res)
        this.loggerService.info('task deleted successfully', tasksLoggerFile)
      })
  }

  updateTask(todoId: string, taskId: string, newTask: UpdateTaskRequest) {
    this.loggerService.info('updating task on the server...', tasksLoggerFile)
    this.http
      .put<CommonResponseType<{ item: Task }>>(
        `${environment.baseUrl}/todo-lists/${todoId}/tasks/${taskId}`,
        newTask
      )
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(() => {
          const stateTasks = this.tasks$.getValue()
          const tasksForTodo = stateTasks[todoId]
          const newTasks = tasksForTodo.map((el: Task) =>
            el.id === taskId ? { ...el, ...newTask } : el
          )
          stateTasks[todoId] = newTasks
          return stateTasks
        })
      )
      .subscribe(res => {
        this.tasks$.next(res)
        this.loggerService.info('task updated successfully', tasksLoggerFile)
      })
  }
  private handleError(error: HttpErrorResponse) {
    this.loggerService.error(error.message, tasksLoggerFile)
    return EMPTY
  }
}
