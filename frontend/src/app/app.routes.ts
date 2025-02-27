import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/component/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () =>  import('./features/dashboard/component/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent)
    },
    {
        path: 'driver-list',
        loadComponent: () =>  import('./features/driver/containers/driver-list/driver-list.component').then(m => m.DriverListComponent)
    },
    {
        path: 'add-driver',
        loadComponent: () =>  import('./features/driver/containers/add-new-driver/add-new-driver.component').then(m => m.AddNewDriverComponent)
    },
    {
        path: 'package-list',
        loadComponent: () =>  import('./features/packages/containers/package-list/package-list.component').then(m => m.PackageListComponent)
    },
    {
        path: 'add-package',
        loadComponent: () =>  import('./features/packages/containers/add-new-package/add-new-package.component').then(m => m.AddNewPackageComponent)
    },
    {
        path: 'statistics',
        loadComponent: () =>  import('./features/statistics/components/statistics.component').then(m => m.StatisticsComponent)
    },
    {
        path: 'translation',
        loadComponent: () =>  import('./features/translation/components/translation.component').then(m => m.TranslationComponent)
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
