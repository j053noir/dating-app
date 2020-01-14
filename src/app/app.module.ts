import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';

import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './_services/auth.service';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { UserService } from './_services/user.service';

import { AuthGuard } from './_guards/auth.guard';

import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

export function tokenGetter() {
    return localStorage.getItem(environment.tokenName);
}

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        ListsComponent,
        MessagesComponent,
        MemberCardComponent,
        MemberDetailComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                whitelistedDomains: [environment.hostUrl],
                blacklistedRoutes: [`${environment.apiUrl}/auth`],
            },
        }),
    ],
    providers: [
        AuthService,
        UserService,
        ErrorInterceptorProvider,
        AuthGuard,
        MemberListResolver,
        MemberDetailResolver,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
