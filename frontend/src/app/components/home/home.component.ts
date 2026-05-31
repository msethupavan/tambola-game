import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  serverIP: string = '';
  serverPort: number = 3000;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Fetch server info
    fetch('/api/server-info')
      .then(res => res.json())
      .then(data => {
        this.serverIP = data.ip;
        this.serverPort = data.port;
      })
      .catch(err => {
        console.error('Failed to fetch server info:', err);
        this.serverIP = window.location.hostname;
      });
  }

  createRoom(): void {
    this.router.navigate(['/host']);
  }

  joinRoom(): void {
    this.router.navigate(['/player']);
  }

  get networkURL(): string {
    return `http://${this.serverIP}:${this.serverPort}`;
  }
}
