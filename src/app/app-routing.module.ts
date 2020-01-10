import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'lists', component: ListsComponent },
            {
                path: 'members',
                component: MemberListComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'messages',
                component: MessagesComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
