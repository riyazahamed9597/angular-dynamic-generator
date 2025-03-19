import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'dynamic-table-transaction', pathMatch: 'full' }, // Default redirect
  { path: 'dynamic-table-generate', loadChildren: () => import('./dynamic-table-generate/dynamic-table-generate.module').then(m => m.DynamicTableGenerateModule) },
  {path:'dynamic-table-transaction', loadChildren: () => import('./dynamic-table-transaction/dynamic-table-transaction.module').then(m => m.DynamicTableTransactionModule)}   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
