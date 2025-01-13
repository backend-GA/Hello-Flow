import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
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
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'twitter-account',
    loadComponent: () =>
      import(
        './components/auth/twitter-account/twitter-account.component'
      ).then((m) => m.TwitterAccountComponent),
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./components/auth/plans/plans.component').then(
        (m) => m.PlansComponent
      ),
  },
  {
    path: 'subscriptions',
    loadComponent: () =>
      import('./components/auth/subscriptions/subscriptions.component').then(
        (m) => m.SubscriptionsComponent
      ),
  },
];
