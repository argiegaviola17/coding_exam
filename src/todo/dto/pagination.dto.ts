import { IsNotEmpty } from 'class-validator';

export class PaginationDTO {
    
    @IsNotEmpty()
    pageSize: number;

    @IsNotEmpty()
    pageNumber: number;
}