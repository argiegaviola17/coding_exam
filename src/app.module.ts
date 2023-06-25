import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { Todo } from './entity/Todo';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TodoModule,
    CoreModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      synchronize: true,
      logging: false,
      entities: [Todo],
      migrations: [],
      subscribers: [],
    })
  ],
  controllers: [
    
    AppController,]
})
export class AppModule { }
