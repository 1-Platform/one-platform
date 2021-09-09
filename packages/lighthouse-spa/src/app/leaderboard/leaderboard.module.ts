import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { GraphQLModule } from 'app/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { LeaderboardCardComponent } from './components/leaderboard-card/leaderboard-card.component';
import { LeaderboardLabelFormaterPipe } from './pipes/leaderboard-label-formater.pipe';

@NgModule({
  declarations: [
    LeaderboardComponent,
    LeaderboardCardComponent,
    LeaderboardLabelFormaterPipe,
  ],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    SharedModule,
    GraphQLModule,
    HttpClientModule,
  ],
})
export class LeaderboardModule {}
