import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'check'
})
export class CheckedPipe implements PipeTransform {

  transform(skin: string, current: string): any {
    if(skin == current)
      return "skin-img-selected";
    else
      return ;
  }
}
