import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { PlatesDeliveryComponent } from './pages/plates-delivery/plates-delivery.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'store', component: StoreComponent
    },
    {
        path: 'plates-delivery', component: PlatesDeliveryComponent
    }
];
