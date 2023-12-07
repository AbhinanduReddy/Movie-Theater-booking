import { Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
 
  // Data for line chart
  dataForLineChart: any;

  // Data for bar chart
  dataForBarChart: any;

  // Data for pie chart
  dataForPieChart: any;

  // Data for recent appointments table
  appointments: any[];

  // Data for transactions table
  transactions: any[];

  constructor() {}

  ngOnInit() {
    this.setupLineChartData();
    this.setupBarChartData();
    this.setupPieChartData();
    this.mockAppointmentsData();
    this.mockTransactionsData();
  }

  setupLineChartData() {
    this.dataForLineChart = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#565656'
        }
      ]
    };
  }

  setupBarChartData() {
    this.dataForBarChart = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Second Dataset',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
  }

  setupPieChartData() {
    this.dataForPieChart = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]    
    };
  }

  mockAppointmentsData() {
    this.appointments = [
      { id: 1, name: 'John Doe', date: '2023-12-03', status: 'Confirmed' },
      // ... more data
    ];
  }

  mockTransactionsData() {
    this.transactions = [
      { id: 1, amount: 150, date: '2023-12-03', status: 'Completed' },
      // ... more data
    ];
  }
}
