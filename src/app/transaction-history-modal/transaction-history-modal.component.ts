import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-history-modal',
  templateUrl: './transaction-history-modal.component.html',
  styleUrls: ['./transaction-history-modal.component.css']
})
export class TransactionHistoryModalComponent implements OnInit {
  ngOnInit(): void {
    
  }

  @Input() transactions: any[] = []; // Replace with actual data type
  @Input() showModal: boolean = false;

  closeModal(): void {
    this.showModal = false;
  }

}
