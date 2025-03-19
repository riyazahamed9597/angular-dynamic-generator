import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicTableGenerateComponent } from './dynamic-table-generate.component';

const routes: Routes = [
  {path:'', component: DynamicTableGenerateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicTableGenerateRoutingModule { }
