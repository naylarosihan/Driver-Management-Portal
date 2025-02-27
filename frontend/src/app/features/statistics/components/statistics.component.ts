import { Component } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  allStatistics:any ={}
  constructor(private statisticsService: StatisticsService){}

  ngOnInit(){
    this.getAllStatisticss()
  }

  getAllStatisticss(){
    this.statisticsService.getAllStatisticss().subscribe((res) => {
      this.allStatistics = res
    }, error => {
      console.log(error)
    })
  }

}
