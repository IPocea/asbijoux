import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GdprPolicyComponent } from './gdpr-policy.component';
import { GdprPolicyRoutingModule } from './gdpr-policy-routing.module';

@NgModule({
  declarations: [GdprPolicyComponent],
  imports: [CommonModule, GdprPolicyRoutingModule],
})
export class GdprPolicyModule {}
