import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./layout/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'Active_Campaigns',
    loadComponent: () =>
      import('./layout/active-campaigns/active-campaigns.component').then(
        (m) => m.ActiveCampaignsComponent
      ),
  },
];
