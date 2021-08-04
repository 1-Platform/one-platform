import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './playground-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, FormsModule, HomeRoutingModule, SharedModule],
})
export class PlaygroundModule {}
