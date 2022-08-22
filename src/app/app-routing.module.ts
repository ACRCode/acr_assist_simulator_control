import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcrSimulatorAppRootComponent } from './app-root-component/acr-simulator-app-root.component';
import { AppComponent } from './app.component';
import { AcrSimulatorNotFoundComponent } from './modules/acr-assist-simulator/acr-simulator-not-found/acr-simulator-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: AppComponent,
        children : [
          {
            path: 'home',
            component: AcrSimulatorAppRootComponent
          },
          {
            path: '**',
            component: AcrSimulatorNotFoundComponent
          }
        ]
      } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
