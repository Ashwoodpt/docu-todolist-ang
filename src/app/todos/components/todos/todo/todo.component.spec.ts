import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TodoComponent } from './todo.component'
import { TodosService } from 'src/app/todos/services/todos.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DomainTodo } from 'src/app/todos/models/todos.models'

const todoId = 'someid'

const mockTodo: DomainTodo = {
  id: todoId,
  title: 'mock title',
  addedDate: '',
  order: 1,
  filter: 'all',
}

describe('Todo component testing', () => {
  let component: TodoComponent
  let fixture: ComponentFixture<TodoComponent>
  let todosService: TodosService

  const fakeTodosService = jasmine.createSpyObj('TodosService', [
    'getTodo',
    'addTodo',
    'deleteTodo',
    'updateTodoTitle',
    'changeFilter',
  ])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TodoComponent],
      providers: [{ provide: TodosService, useValue: fakeTodosService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoComponent)
    component = fixture.componentInstance
    todosService = TestBed.inject(TodosService)
    component.todo = mockTodo
    fixture.detectChanges()
  })

  it('todo component should be created', () => {
    expect(component).toBeTruthy()
  })

  it('todo component should initialize with isEditMode being false', () => {
    expect(component.isEditMode).toBeFalse()
  })

  it('todo component should initialize with newTitle being an empty string', () => {
    expect(component.newTitle).toEqual('')
  })

  describe('deleteTodoHandler method testing', () => {
    it('should emit new deleteTodo event when delete todo button is pressed', () => {
      const deleteTodoEventSpy = spyOn(component.deleteTodoEvent, 'emit')
      const deleteButton = fixture.nativeElement.querySelector('button')
      deleteButton.click()
      fixture.detectChanges()
      expect(deleteTodoEventSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('activateEditModeHandler method testing', () => {
    it('activateEditModeHandler should set input to edit mode on double click', () => {
      const titleInput = fixture.nativeElement.querySelector('b')
      const dbClick = new MouseEvent('dblclick')
      titleInput.dispatchEvent(dbClick)
      fixture.detectChanges()
      expect(component.isEditMode).toBeTrue()
    })

    it('activateEditModeHandler should set newTitle to todo.title', () => {
      const titleInput = fixture.nativeElement.querySelector('b')
      const dbClick = new MouseEvent('dblclick')
      titleInput.dispatchEvent(dbClick)
      fixture.detectChanges()
      expect(component.newTitle).toEqual(component.todo.title)
    })
  })

  describe('editTitleHandler method testing', () => {
    it('editTitleHandler method should set isEdit to false', () => {
      component.isEditMode = true
      fixture.detectChanges()
      const inputElement = fixture.nativeElement.querySelector('input')
      inputElement.dispatchEvent(new Event('focus'))
      inputElement.dispatchEvent(new Event('blur'))
      fixture.detectChanges()
      expect(component.isEditMode).toBeFalse()
    })

    it('editTitleHandler should emit new editTodoEvent when triggered', () => {
      const editTodoEventSpy = spyOn(component.editTodoEvent, 'emit')
      component.isEditMode = true
      fixture.detectChanges()
      const inputElement = fixture.nativeElement.querySelector('input')
      inputElement.dispatchEvent(new Event('focus'))
      inputElement.dispatchEvent(new Event('blur'))
      fixture.detectChanges()
      expect(editTodoEventSpy).toHaveBeenCalledTimes(1)
    })

    it('editTitleHandler should pass correct data to an event', () => {
      const mockNewTitle = 'new and shiny title'
      const editTodoEventSpy = spyOn(component.editTodoEvent, 'emit')
      component.isEditMode = true
      fixture.detectChanges()
      const inputElement = fixture.nativeElement.querySelector('input')
      inputElement.dispatchEvent(new Event('focus'))
      inputElement.dispatchEvent(new Event('input'))
      component.newTitle = mockNewTitle
      inputElement.dispatchEvent(new Event('blur'))
      fixture.detectChanges()

      expect(editTodoEventSpy).toHaveBeenCalledOnceWith({ todoId: todoId, title: mockNewTitle })
    })
  })

  describe('changeFilter method testing', () => {
    it('changeFilter method should invoke changeFilter method of todosService with correct value', () => {
      component.changeFilter('completed')
      expect(todosService.changeFilter).toHaveBeenCalledOnceWith(todoId, 'completed')
    })
  })
})
