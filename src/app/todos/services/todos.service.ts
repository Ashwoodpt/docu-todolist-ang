import { LoggerService } from 'src/app/shared/services/logger.service'
import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { BehaviorSubject, EMPTY } from 'rxjs'
import { DomainTodo, FilterType, Todo } from 'src/app/todos/models/todos.models'
import { CommonResponseType } from 'src/app/core/models/core.models'
import { catchError, map } from 'rxjs/operators'

const todosServiceLogFile = 'TodosService'

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todos$ = new BehaviorSubject<DomainTodo[]>([])

  constructor(private http: HttpClient, private loggerService: LoggerService) {
    this.loggerService.info('Todos service initialized', todosServiceLogFile)
  }

  getTodos() {
    this.loggerService.info('getting todos from the server...', todosServiceLogFile)
    this.http
      .get<Todo[]>(`${environment.baseUrl}/todo-lists`)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(todos => {
          const newTodos: DomainTodo[] = todos.map(el => ({ ...el, filter: 'all' }))
          return newTodos
        })
      )
      .subscribe(res => {
        this.todos$.next(res)
        this.loggerService.info('todos updated successfuly', todosServiceLogFile)
      })
  }

  addTodo(title: string) {
    this.loggerService.info('adding a new todo to the server...', todosServiceLogFile)

    this.http
      .post<
        CommonResponseType<{
          item: Todo
        }>
      >(`${environment.baseUrl}/todo-lists`, { title })
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(res => {
          const stateTodos = this.todos$.getValue()
          const newTodo: DomainTodo = { ...res.data.item, filter: 'all' }
          return [newTodo, ...stateTodos]
        })
      )

      .subscribe((res: DomainTodo[]) => {
        this.todos$.next(res)
        this.loggerService.info('new todo added successfuly', todosServiceLogFile)
      })
  }

  deleteTodo(todoId: string) {
    this.loggerService.info('deleting todo from server...', todosServiceLogFile)
    this.http
      .delete<CommonResponseType>(`${environment.baseUrl}/todo-lists/${todoId}`)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(() => {
          const stateTodo = this.todos$.getValue()
          return stateTodo.filter(el => el.id !== todoId)
        })
      )
      .subscribe(todos => {
        this.todos$.next(todos)
        this.loggerService.info('todo deleted successfuly', todosServiceLogFile)
      })
  }
  updateTodoTitle(todoId: string, title: string) {
    this.loggerService.info('updating todo on the server...', todosServiceLogFile)
    this.http
      .put<CommonResponseType>(`${environment.baseUrl}/todo-lists/${todoId}`, { title })
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map(() => {
          const stateTodo = this.todos$.getValue()
          return stateTodo.map(todo => (todo.id === todoId ? { ...todo, title } : todo))
        })
      )
      .subscribe(res => {
        this.todos$.next(res)
        this.loggerService.info('todo updated successfuly', todosServiceLogFile)
      })
  }
  changeFilter(todoId: string, filter: FilterType) {
    const stateTodos = this.todos$.getValue()
    const newTodos: DomainTodo[] = stateTodos.map(el => (el.id === todoId ? { ...el, filter } : el))
    this.todos$.next(newTodos)
    this.loggerService.info(`filter successfully changed to ${filter}`, todosServiceLogFile)
  }

  private handleError(error: HttpErrorResponse) {
    this.loggerService.error(error.message, todosServiceLogFile)
    return EMPTY
  }
}
