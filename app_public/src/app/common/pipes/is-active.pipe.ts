import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isActive'
})
export class IsActivePipe implements PipeTransform {

  transform(index: number, active_tab: number): string {
    if(index == active_tab)
      return "inactive";
    else
      return "";
  }

}
