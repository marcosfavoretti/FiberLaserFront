import { Component, Inject, Pipe } from '@angular/core';
import { ApiService } from '../../shared/service/Api.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataScriptService } from '../../shared/service/DataScript.service';

@Component({
  selector: 'preview-delivery',
  templateUrl: './preview-data.component.html',
  styleUrls: ['./preview-data.component.css'],
  imports: [AsyncPipe, CommonModule]
})
export class PreviewDataComponent {
  public data$?: Observable<Array<{ current: boolean, data: string }[]>>;

  constructor(@Inject(ApiService) private api: ApiService, @Inject(DataScriptService) private datastore: DataScriptService) { }

  ngOnInit(): void {
    this.api.requestScripts().subscribe(scripts => {
      this.datastore.setNewData(scripts); // Assuming you have a method to update the store
      this.data$ = this.datastore.dataScript$;
    });
  }
}
