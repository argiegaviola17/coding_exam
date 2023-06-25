import { IsNotEmpty } from 'class-validator';

export class TodoDTO {
    @IsNotEmpty()
    id: number;
}