import { EntityManager } from 'typeorm';

import { HttpException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { Todo } from '../entity/Todo';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { TodoDTO } from './dto/todo.dto';
import { UpdateDTO } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let entityManagerMock: Partial<EntityManager>;

  beforeEach(async () => {
    entityManagerMock = {
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
     
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDTO = {
        text: 'New todo',
      };
      
      const saveSpy = jest
        .spyOn(entityManagerMock, 'save')
        .mockResolvedValueOnce({ id: 1, text: 'New todo' });

      const result = await todoService.create(createTodoDto);

      expect(saveSpy).toHaveBeenCalledWith(expect.any(Todo));
      expect(result).toEqual({ id: 1, text: 'New todo' });
    });
  });

  describe('read', () => {
    it('should retrieve paginated todos', async () => {
      // Arrange
      const paginationDto: PaginationDTO = {
        pageNumber: 1,
        pageSize: 2,
      };
      const countSpy = jest.spyOn(entityManagerMock, 'count').mockResolvedValueOnce(4);
      const queryBuilderMock: any = {
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce([{ id: 1, text: 'Todo 1' }, { id: 2, text: 'Todo 2' }]),
      };
      const createQueryBuilderSpy = jest
        .spyOn(entityManagerMock, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilderMock);

      // Act
      const result = await todoService.read(paginationDto);

      // Assert
      expect(countSpy).toHaveBeenCalledWith(Todo);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith(Todo, 't');
      expect(queryBuilderMock.offset).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.limit).toHaveBeenCalledWith(2);
      expect(queryBuilderMock.execute).toHaveBeenCalled();
      expect(result).toEqual({
        records: [{ id: 1, text: 'Todo 1' }, { id: 2, text: 'Todo 2' }],
        totalPage: 2,
        totalRecords: 4,
      });
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      jest
        .spyOn(entityManagerMock, 'findOne')
        .mockResolvedValueOnce({ id: 1, text: 'New todo' });
    
 
      // Arrange
      const updateDto: UpdateDTO = {
        id: 1,
        text: 'Updated todo',
      };
      const updateSpy = jest.spyOn(entityManagerMock, 'save').mockResolvedValueOnce({ id: 1, text: 'Updated todo' });

      // Act
      const updateResult = await todoService.update(updateDto);
      expect(updateSpy).toHaveBeenCalledWith(updateDto);
      expect(updateResult).toEqual({ id: 1, text: 'Updated todo' });
    });

    it('should throw an exception if todo is not found', async () => {
      // Arrange
      const updateDto: UpdateDTO = {
        id: 1,
        text: 'Updated todo',
      };
      jest.spyOn(entityManagerMock, 'save').mockResolvedValueOnce(null);
      const findOneSpy = jest.spyOn(entityManagerMock, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(todoService.update(updateDto)).rejects.toThrow(HttpException);
      expect(findOneSpy).toHaveBeenCalledWith(Todo, { where: { id: 1 } });
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', async () => {

      jest
      .spyOn(entityManagerMock, 'findOne')
      .mockResolvedValueOnce({  id: 1, text: 'Deleted todo' });
  

      const mockDeleted: any = { id: 1, text: 'Deleted todo' };
      // Arrange
      const todoDto: TodoDTO = {
        id: 1,
      };
      const removeSpy = jest.spyOn(entityManagerMock, 'remove').mockResolvedValueOnce(mockDeleted);

      // Act
      const result = await todoService.delete(todoDto);

      // Assert
      expect(removeSpy).toHaveBeenCalledWith(mockDeleted);
      expect(result).toEqual({ id: 1, text: 'Deleted todo' });
    });

    it('should throw an exception if todo is not found', async () => {
      // Arrange
      const todoDto: TodoDTO = {
        id: 1,
      };
      jest.spyOn(entityManagerMock, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(todoService.delete(todoDto)).rejects.toThrow(HttpException);
      
    });
  });
});
