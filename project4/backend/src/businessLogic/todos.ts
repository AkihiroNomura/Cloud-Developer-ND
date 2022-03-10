import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStogare/AttachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  return await todosAccess.getTodos(userId)
}

export const createTodo = async (userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> => {
  const todoId = uuid.v4()

  return await todosAccess.createTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  })
}

export const updateTodo = async (userId: string, todoId: string, updateTodo: UpdateTodoRequest) => {
  await todosAccess.updateTodo(userId, todoId, updateTodo)
}

export const deleteTodo = async (userId: string, todoId: string) => {
  await todosAccess.deleteTodo(userId, todoId)
}

export const updateAttachmentUrl = async (userId: string, todoId: string, attachmentUrl: string) => {
  const item = await todosAccess.getTodo(userId, todoId)

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission.`)
    throw new Error(`User ${userId} does not have permission`)
  }

  await todosAccess.updateAttachmentUrl(todoId, userId, attachmentUrl)
}

export const createAttachmentPresignedUrl = (attachmentId: string) => {
  return attachmentUtils.getUploadUrl(attachmentId)
}

export const getAttachmentUrl = (attachmentId: string) => {
  return attachmentUtils.getAttachmentUrl(attachmentId)
}