import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./components/layout/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'Active_Campaigns',
    loadComponent: () =>
      import(
        './components/layout/active-campaigns/active-campaigns.component'
      ).then((m) => m.ActiveCampaignsComponent),
  },
  {
    path: 'Past_Campaigns',
    loadComponent: () =>
      import(
        './components/layout/past-campaigns/past-campaigns.component'
      ).then((m) => m.PastCampaignsComponent),
  },
  {
    path: 'Draft_Campaigns',
    loadComponent: () =>
      import(
        './components/layout/draft-campaigns/draft-campaigns.component'
      ).then((m) => m.DraftCampaignsComponent),
  },
  {
    path: 'Billing',
    loadComponent: () =>
      import('./components/payment/billing/billing.component').then(
        (m) => m.BillingComponent
      ),
  },
  {
    path: 'Settings',
    loadComponent: () =>
      import('./components/setting/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: 'Create_New_Campaign',
    loadComponent: () =>
      import(
        './components/layout/create-new-campaign/create-new-campaign.component'
      ).then((m) => m.CreateNewCampaignComponent),
  },
];
