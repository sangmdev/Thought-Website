import { Pipe, PipeTransform } from "@angular/core";

/*
 Takes a string from database in format MMDDYYYY
 and inserts hyphens in correct places

*/
@Pipe({
  name: "formatDate"
})
export class FormatDatePipe implements PipeTransform {

  transform(date: string): string {
    var mnth = date.toString().substring(0, 2);
    var day = date.toString().substring(2, 4);
    var year = date.toString().substring(4, 8);
      return [mnth, day, year].join("-");
  }

}
