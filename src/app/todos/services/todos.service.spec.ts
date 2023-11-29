import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TodosService } from './todos.service'
import { TestBed } from '@angular/core/testing'
import { DomainTodo } from '../models/todos.models'
import { environment } from 'src/environments/environment'

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

describe('todos service tests', () => {
  let service: TodosService
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService],
      imports: [HttpClientTestingModule],
    })

    service = TestBed.inject(TodosService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should initialize', () => {
    expect(service).toBeDefined()
  })
  it('should initialize with todos$ being empty', () => {
    expect(service.todos$.getValue()).toEqual([])
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
  })
})
