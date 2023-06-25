import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  PaginationValidationPipe,
} from '../common/pipes/pagination-validation.pipe';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { TodoDTO } from './dto/todo.dto';
import { UpdateDTO } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller("api/todo")
export class TodoController {

    constructor(private readonly todoService: TodoService){}

    @Post("create")
     create(@Body() params: CreateTodoDTO){
        return this.todoService.create(params)
    }
    @Get("read")
     read(@Query(new PaginationValidationPipe()) params: PaginationDTO){
        return this.todoService.read(params)
    }

    @Patch("update")
     update(@Body() params: UpdateDTO){
        return this.todoService.update(params);
    }

    @Delete("delete")
     delete(@Body() params: TodoDTO){
        return this.todoService.delete(params);
    }
}
