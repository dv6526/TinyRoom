import { Pipe, PipeTransform } from '@angular/core';
import {Message} from "../classes/models/message";

@Pipe({
  name: 'oldestFirst'
})
export class OldestFirstPipe implements PipeTransform {

  transform(messages: Message[]): Message[] {
    if (messages && messages.length > 0) {
      return messages.sort((a, b) => {
        return (a.date < b.date) ? -1 : 1;
      });
    }
    return null;
  }

}
