import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  getTodos = async (userId: string): Promise<TodoItem[]> => {
    logger.info(`Getting all todo items for ${userId}.`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosTableIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
      ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    return result.Items as TodoItem[]
  }

  getTodo = async (userId: string, todoId: string): Promise<TodoItem> => {
    logger.info(`Getting todo item ${todoId} for ${userId}.`)

    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise()

    return result.Item as TodoItem
  }

  createTodo = async (newTodo: TodoItem): Promise<TodoItem> => {
    logger.info(`Creating todo item ${newTodo}.`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: newTodo
    }).promise()

    return newTodo
  }

  updateTodo = async (userId: string, todoId: string, updatedTodo: TodoUpdate): Promise<void> => {
    logger.info(`Updating todo item ${todoId}.`)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
          todoId,
          userId
      },
      UpdateExpression:
        'set #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      }
    }).promise()
  }

  deleteTodo = async (userId: string, todoId: string): Promise<void> => {
    logger.info(`Deleting todo item ${todoId}.`)

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      }
    }).promise()
  }

  updateAttachmentUrl = async (todoId: string, userId: string, attachmentUrl: string): Promise<void> => {
    logger.info(`Updating attachment url ${attachmentUrl}.`)

    await this.docClient.update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}