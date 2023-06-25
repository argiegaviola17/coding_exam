import { EntityManager } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { Todo } from '../entity/Todo';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { TodoDTO } from './dto/todo.dto';
import { UpdateDTO } from './dto/update-todo.dto';

@Injectable()
export class TodoService { 
    constructor(@InjectEntityManager()
    private readonly  em: EntityManager){}
    async create(params: CreateTodoDTO){
        const todo = new Todo();
        todo.text = params.text;
        return await this.em.save(todo);
    }
    async read(params: PaginationDTO){
        const totalRecords = await this.em.count(Todo);
        const totalPage = Math.ceil(totalRecords/params.pageSize);

        const records = await this.em.createQueryBuilder(Todo,"t")
        .offset((params.pageNumber-1)*params.pageSize )
        .limit(params.pageSize ).execute();

        return {
            records,
            totalPage,
            totalRecords
        }
    }
    async update(params: UpdateDTO){
        const todo = await this.getTodo(this.em, params);
        todo.text = params.text;
        await this.em.save(todo);
        return todo;
    }

    private async getTodo(txnEm: EntityManager, params: TodoDTO) {
        const todo = await txnEm.findOne(Todo, {
            where: {
                id: params.id
            } 
        });
        if (!todo) {
            throw new HttpException("RECORD_NOT_FOUND",HttpStatus.NOT_FOUND);
        }
        return todo;
    }

    async delete(params: TodoDTO){
        const todo = await this.getTodo(this.em, params);
        await this.em.remove(todo);
        return todo;
    }
}
