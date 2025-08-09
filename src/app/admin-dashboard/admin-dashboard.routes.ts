import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { ProductAdminComponent } from "./pages/product-admin/product-admin.component";
import { ProductsAdminComponent } from "./pages/products-admin/products-admin.component";
import { isAdminGuard } from "../core/guards/is-admin.guard";

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canMatch: [
    //   isAdminGuard
    // ],
    children: [
      {
        path: 'products',
        component: ProductsAdminComponent
      },
      {
        path: 'products/:id',
        component: ProductAdminComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];

export default adminDashboardRoutes;
