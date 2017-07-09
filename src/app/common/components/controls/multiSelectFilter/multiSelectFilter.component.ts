import { Component, Input } from '@angular/core';

@Component({
  selector: 'multi-select-filter',
  templateUrl: './multiSelectFilter.component.html',
  styleUrls: ['./multiSelectFilter.component.css']
})
export class MultiSelectFilterComponent {

  @Input() elementName: string;
  @Input() filterList: Array<string>;
  @Input() optionList: Array<string>;

  moveOptionToFilter(e: any): void {
    let option = e.target.value;
    if (option === 'clear') {
      while (this.filterList.length > 0) {
        this.optionList.push(this.filterList.pop());
      }
      this.optionList.sort();
    } else {
      this.optionList.splice(this.optionList.indexOf(option), 1);
      this.filterList.push(option);
      this.filterList.sort();
    }
  }

  removeOptionFromFilter(i: number, option: string): void {
    this.filterList.splice(i, 1);
    this.optionList.push(option);
    this.optionList.sort();
  }

}
