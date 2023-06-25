import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
  export class PaginationValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
      if(isNaN(value.pageNumber)){
        value.pageNumber = 0;
      }
      if(isNaN(value.pageSize)){
        value.pageSize = 0;
      }
      return value;
    }
  
    
  }
  