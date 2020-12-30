import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getHoursAndMinutes'
})
export class GetHoursAndMinutesPipe implements PipeTransform {

  transform(date: Date): string {
    let temp = new Date(date);
    return this.addZero(temp.getHours()) + ':' + this.addZero(temp.getMinutes());
  }

  addZero(i: number): any {
    let result: string;
    if (i < 10) {
      result = "0" + i.toString();
    } else {
      result = i.toString();
    }
    return result;
  }

}
