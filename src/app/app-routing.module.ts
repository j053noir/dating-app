import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValueComponent } from './value/value.component';

const routes: Routes = [
    { path: '', component: ValueComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
