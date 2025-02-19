import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { WallComponent } from './components/wall/wall.component';
import { FriendWallComponent } from './components/friend-wall/friend-wall.component';
import { AuthGuard } from './guard/auth.guard';
import { AboutComponent } from './components/about/about.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfilComponent } from './components/profil/profil.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'wall',
        component: WallComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'wall/:id',
        component: FriendWallComponent
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'profil',
        component: ProfilComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AuthGuard],
    },
];
