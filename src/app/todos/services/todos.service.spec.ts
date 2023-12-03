import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TodosService } from './todos.service'
import { TestBed } from '@angular/core/testing'
import { DomainTodo } from '../models/todos.models'
import { environment } from 'src/environments/environment'
import { LoggerService } from 'src/app/shared/services/logger.service'

const mockTitle = 'some title'
const mockUpdatedTitle = 'new and shiny title'
const todoId = 'fakeTodoId'

const mockTodo: DomainTodo = {
  id: todoId,
  title: mockTitle,
  addedDate: '',
  order: 1,
  filter: 'all',
}

const fakeLoggerService = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error'])

describe('todos service tests', () => {
  let service: TodosService
  let httpTestingController: HttpTestingController
  let loggerService: LoggerService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService, { provide: LoggerService, useValue: fakeLoggerService }],
      imports: [HttpClientTestingModule],
    })

    service = TestBed.inject(TodosService)
    httpTestingController = TestBed.inject(HttpTestingController)
    loggerService = TestBed.inject(LoggerService)
  })

  afterEach(() => {
    httpTestingController.verify()
    fakeLoggerService.info.calls.reset()
    fakeLoggerService.error.calls.reset()
  })

  it('todos service should initialize', () => {
    expect(service).toBeDefined()
  })
  it('todos service should initialize with todos$ being empty', () => {
    expect(service.todos$.getValue()).toEqual([])
  })
  it('todos service should invoke info method of LoggerService to inform about its initialization', () => {
    expect(loggerService.info).toHaveBeenCalledTimes(1)
  })

  describe('getTodos method testing', () => {
    it('getTodos method should invoke GET method of httpClient', () => {
      service.getTodos()
      const { request } = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      expect(request.method).toEqual('GET')
    })

    it('getTodos should update todos$ if the request was successful', () => {
      service.getTodos()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.flush([mockTodo])
      expect(service.todos$.getValue()).toEqual([mockTodo])
    })

    it('getTodos should NOT update todos$ if the request was unsuccessful', () => {
      service.getTodos()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.error(new ErrorEvent('404'))
      expect(service.todos$.getValue()).toEqual([])
    })

    it('getTodos method should invoke info method of LoggerService to inform about request being sent', () => {
      fakeLoggerService.info.calls.reset()
      service.getTodos()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('getTodos method should invoke info method of LoggerService to inform about request being successful', () => {
      service.getTodos()
      fakeLoggerService.info.calls.reset()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.flush([mockTodo])
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('getTodos method should invoke info method of LoggerService to inform about request being unsuccessful', () => {
      const errorEvent = new ErrorEvent('404')
      fakeLoggerService.info.calls.reset()
      service.getTodos()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('addTodo method testing', () => {
    it('addTodo should invoke POST method of httpClient', () => {
      service.addTodo(mockTitle)
      const { request } = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      expect(request.method).toEqual('POST')
    })

    it('addTodo should update todos$ if the request was successful', () => {
      service.addTodo(mockTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.flush({ data: { item: mockTodo } })
      expect(service.todos$.getValue()).toEqual([mockTodo])
    })

    it('addTodo method should NOT update todos$ if the request was unsuccessful', () => {
      service.addTodo(mockTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.error(new ErrorEvent('404'))
      expect(service.todos$.getValue()).toEqual([])
    })

    it('addTodo method should invoke info method of LoggerService to inform about request being sent', () => {
      fakeLoggerService.info.calls.reset()
      service.addTodo(mockTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('addTodo method should invoke info method of LoggerService to inform about request being successful', () => {
      service.addTodo(mockTitle)
      fakeLoggerService.info.calls.reset()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.flush({ data: { item: mockTodo } })
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('addTodo method should invoke info method of LoggerService to inform about request being unsuccessful', () => {
      const errorEvent = new ErrorEvent('404')
      fakeLoggerService.info.calls.reset()
      service.addTodo(mockTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteTodo method testing', () => {
    it('deleteTodo should invoke DELETE method of httpClient', () => {
      service.deleteTodo(todoId)
      const { request } = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}`
      )
      expect(request.method).toEqual('DELETE')
    })

    it('deleteTodo should update todos$ if the request was successful', () => {
      service.todos$.next([mockTodo])
      service.deleteTodo(todoId)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.flush('')
      expect(service.todos$.getValue()).toEqual([])
    })

    it('deleteTodo should NOT update todos$ if the request was unsuccessful', () => {
      service.todos$.next([mockTodo])
      service.deleteTodo(todoId)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.error(new ErrorEvent('404'))
      expect(service.todos$.getValue()).toEqual([mockTodo])
    })

    it('deleteTodo method should invoke info method of LoggerService to inform about request being sent', () => {
      fakeLoggerService.info.calls.reset()
      service.deleteTodo(todoId)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('deleteTodo method should invoke info method of LoggerService to inform about request being successful', () => {
      service.todos$.next([mockTodo])
      service.deleteTodo(todoId)
      fakeLoggerService.info.calls.reset()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.flush('')
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('deleteTodo method should invoke info method of LoggerService to inform about request being unsuccessful', () => {
      service.todos$.next([mockTodo])
      const errorEvent = new ErrorEvent('404')
      fakeLoggerService.info.calls.reset()
      service.deleteTodo(todoId)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateTodoTitle method testing', () => {
    it('should invoke PUT method of httpClient', () => {
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      const { request } = httpTestingController.expectOne(
        `${environment.baseUrl}/todo-lists/${todoId}`
      )
      expect(request.method).toEqual('PUT')
    })

    it('updateTodoTitle method should update todos$ if the request was successful', () => {
      service.todos$.next([mockTodo])
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.flush('')
      expect(service.todos$.getValue()).toEqual([{ ...mockTodo, title: mockUpdatedTitle }])
    })

    it('updateTodoTitle should NOT update todos$ if the request was unsuccessful', () => {
      service.todos$.next([mockTodo])
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.error(new ErrorEvent('404'))
      expect(service.todos$.getValue()).toEqual([mockTodo])
    })

    it('updateTodoTitle method should invoke info method of LoggerService to inform about request being sent', () => {
      fakeLoggerService.info.calls.reset()
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('updateTodoTitle method should invoke info method of LoggerService to inform about request being successful', () => {
      service.todos$.next([mockTodo])
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      fakeLoggerService.info.calls.reset()
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.flush('')
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })

    it('updateTodoTitle method should invoke info method of LoggerService to inform about request being unsuccessful', () => {
      service.todos$.next([mockTodo])
      const errorEvent = new ErrorEvent('404')
      fakeLoggerService.info.calls.reset()
      service.updateTodoTitle(todoId, mockUpdatedTitle)
      const req = httpTestingController.expectOne(`${environment.baseUrl}/todo-lists/${todoId}`)
      req.error(errorEvent)
      expect(loggerService.info).toHaveBeenCalledTimes(1)
      expect(loggerService.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('changeFilter method testing', () => {
    it('changeFilter should update the filter of Todo', () => {
      service.todos$.next([mockTodo])
      service.changeFilter(todoId, 'completed')
      expect(service.todos$.getValue()).toEqual([{ ...mockTodo, filter: 'completed' }])
    })

    it('changeFilter should ONLY update Todo with given id', () => {
      service.todos$.next([mockTodo, { ...mockTodo, id: 'somerandomid' }])
      service.changeFilter(todoId, 'completed')
      expect(service.todos$.getValue()).toEqual([
        { ...mockTodo, filter: 'completed' },
        { ...mockTodo, id: 'somerandomid' },
      ])
    })

    it('changeFilter should invoke info method of LoggerService to inform about filter change', () => {
      fakeLoggerService.info.calls.reset()
      service.todos$.next([mockTodo])
      service.changeFilter(todoId, 'completed')
      expect(loggerService.info).toHaveBeenCalledTimes(1)
    })
  })
})
