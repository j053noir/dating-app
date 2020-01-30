import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

import { ListsResolver } from './_resolvers/lists.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'lists',
                component: ListsComponent,
                resolve: { users: ListsResolver },
            },
            {
                path: 'members',
                children: [
                    {
                        path: 'edit',
                        component: MemberEditComponent,
                        resolve: { user: MemberEditResolver },
                        canDeactivate: [PreventUnsavedChangesGuard],
                    },
                    {
                        path: ':id',
                        component: MemberDetailComponent,
                        resolve: { user: MemberDetailResolver },
                    },
                    {
                        path: '',
                        component: MemberListComponent,
                        resolve: { users: MemberListResolver },
                    },
                ],
            },
            {
                path: 'messages',
                component: MessagesComponent,
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
