import { IsNotEmpty } from 'class-validator';

import { TodoDTO } from './todo.dto';

export class UpdateDTO extends TodoDTO {
    @IsNotEmpty()
    text
}