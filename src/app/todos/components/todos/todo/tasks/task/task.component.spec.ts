import { Task, UpdateTaskRequest } from './../../../../../models/tasks.models'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TaskComponent } from './task.component'
import { FormsModule } from '@angular/forms'
import { TaskStatusEnum } from 'src/app/core/enums/taskStatus.enum'

const todoListId = 'fakeTodoListId'

const taskId = 'someid'

const mockTitle = 'mock title'

const updatedTitle = 'new and shiny title'

const mockTask: Task = {
  id: taskId,
  title: mockTitle,
  addedDate: 'today',
  completed: false,
  deadline: '',
  description: 'desc',
  order: 1,
  priority: 0,
  startDate: '',
  status: 0,
  todoListId: todoListId,
}

const mockUpdateTask: UpdateTaskRequest = {
  title: mockTitle,
  completed: false,
  deadline: '',
  description: 'desc',
  priority: 0,
  startDate: '',
  status: 0,
}

describe('TasksComponent testing', () => {
  let component: TaskComponent
  let fixture: ComponentFixture<TaskComponent>

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(TaskComponent)
    component = fixture.componentInstance

    component.task = mockTask
    fixture.detectChanges()
  })

  it('Task component should initialize', () => {
    expect(component).toBeDefined()
  })

  it('Task component should be initialized with editMode set to false', () => {
    expect(component.editMode).toBeFalse()
  })

  it('Task component should be initialized with empty newTitle', () => {
    expect(component.newTitle).toEqual('')
  })

  it('Task should initialize with task defined', () => {
    expect(component.task).toBeDefined()
  })

  describe('deleteTaskHandler method testing', () => {
    it('deleteTaskHandler shoud be invoked when delete button is clicked', () => {
      const deleteHandlerSpy = spyOn(component, 'deleteTaskHandler')
      const deleteButton = fixture.nativeElement.querySelector('button')
      deleteButton.dispatchEvent(new Event('click'))
      fixture.detectChanges()
      expect(deleteHandlerSpy).toHaveBeenCalledTimes(1)
    })

    it('deleteTaskHandler should emit new deleteTaskEvent when invoked', () => {
      const deleteTaskEventSpy = spyOn(component.deleteTaskEvent, 'emit')
      component.deleteTaskHandler()
      expect(deleteTaskEventSpy).toHaveBeenCalledOnceWith(taskId)
    })
  })

  describe('changeTaskStatusHandler method testing', () => {
    it('changeTaskStatusHandler should invoke changeTask method with updated task status', () => {
      const changeTaskSpy = spyOn(component, 'changeTask')
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]')
      checkbox.checked = false
      checkbox.click()
      expect(changeTaskSpy).toHaveBeenCalledOnceWith({ status: TaskStatusEnum.completed })
      changeTaskSpy.calls.reset()
      checkbox.click()
      expect(changeTaskSpy).toHaveBeenCalledOnceWith({ status: TaskStatusEnum.active })
    })
  })

  describe('activateEditModeHandler method testing', () => {
    it('activateEditModeHandler method should set newTitle to task title when invoked ', () => {
      component.activateEditModeHandler()
      expect(component.newTitle).toEqual(component.task.title)
    })

    it('activateEditModeHandler should set editMode to true', () => {
      component.activateEditModeHandler()
      expect(component.editMode).toBeTrue()
    })

    it('activateEditModeHandler should be invoked when task title is double clicked', () => {
      const activateEditModeHandlerSpy = spyOn(component, 'activateEditModeHandler')
      const title = fixture.nativeElement.querySelector('p')
      const doubleClickEvent = new Event('dblclick')
      title.dispatchEvent(doubleClickEvent)
      expect(activateEditModeHandlerSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('changeTitleHandler method testing', () => {
    it('changeTitleHandler method should set editMode to false when invoked', () => {
      component.editMode = true
      component.changeTitleHandler()
      expect(component.editMode).toBeFalse()
    })

    it('changeTitleHandler method should inovke changeTask method when invoked', () => {
      const changeTaskSpy = spyOn(component, 'changeTask')
      component.newTitle = updatedTitle
      component.changeTitleHandler()
      expect(changeTaskSpy).toHaveBeenCalledOnceWith({ title: updatedTitle })
    })

    it('changeTitleHandlerMethod should set newTitle to an empty string when invoked', () => {
      component.newTitle = updatedTitle
      component.changeTitleHandler()
      expect(component.newTitle).toEqual('')
    })

    it('changeTitleHandler should be invoked when title input is blurred', () => {
      const changeTitleHandlerSpy = spyOn(component, 'changeTitleHandler')
      component.editMode = true
      fixture.detectChanges()
      const titleInput = fixture.nativeElement.querySelector('input[type="text"]')
      titleInput.dispatchEvent(new Event('blur'))
      expect(changeTitleHandlerSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('changeTask method testing', () => {
    it('changeTask method should emit a new changeTaskEvent when invoked passing the updated task', () => {
      const changeTaskEventSpy = spyOn(component.changeTaskEvent, 'emit')
      component.changeTask({ title: updatedTitle })
      expect(changeTaskEventSpy).toHaveBeenCalledOnceWith({
        taskId: taskId,
        newTask: { ...mockUpdateTask, title: updatedTitle },
      })
    })
  })
})
