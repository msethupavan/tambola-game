import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit, OnDestroy {
  hostName: string = '';
  roomCode: string = '';
  gameStatus: string = 'setup'; // setup, waiting, playing, finished
  players: any[] = [];
  calledNumbers: number[] = [];
  currentNumber: number | null = null;
  winners: any = {};
  errorMessage: string = '';
  successMessage: string = '';
  autoCallInterval: any = null;
  autoCallEnabled: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socketService.connect();
    
    // Subscribe to events
    this.subscriptions.push(
      this.socketService.playerJoined$.subscribe(data => {
        this.players = data.players;
        this.showSuccess(`Player joined! Total: ${this.players.length}`);
      }),
      
      this.socketService.playerLeft$.subscribe(data => {
        this.players = data.players;
        this.showSuccess('Player left');
      }),
      
      this.socketService.gameStarted$.subscribe(data => {
        this.gameStatus = 'playing';
        this.showSuccess('Game started!');
      }),
      
      this.socketService.claimValidated$.subscribe(data => {
        this.winners[data.pattern] = data.winner;
        this.showSuccess(`${data.winner.name} won ${this.formatPattern(data.pattern)}!`);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stopAutoCalling();
    if (this.roomCode) {
      this.socketService.leaveRoom(this.roomCode);
    }
    this.socketService.disconnect();
  }

  async createRoom(): Promise<void> {
    if (!this.hostName.trim()) {
      this.showError('Please enter your name');
      return;
    }

    try {
      const response = await this.socketService.createRoom(this.hostName);
      this.roomCode = response.room.code;
      this.gameStatus = 'waiting';
      this.players = Object.values(response.room.players);
      this.showSuccess('Room created successfully!');
    } catch (error: any) {
      this.showError(error);
    }
  }

  async startGame(): Promise<void> {
    if (this.getPlayerCount() < 1) {
      this.showError('Need at least 1 player to start');
      return;
    }

    try {
      await this.socketService.startGame(this.roomCode);
      this.gameStatus = 'playing';
    } catch (error: any) {
      this.showError(error);
    }
  }

  async callNumber(): Promise<void> {
    try {
      const response = await this.socketService.callNumber(this.roomCode);
      this.currentNumber = response.number;
      this.calledNumbers = [...this.calledNumbers, response.number];
    } catch (error: any) {
      this.showError(error);
      this.stopAutoCalling();
    }
  }

  toggleAutoCalling(): void {
    this.autoCallEnabled = !this.autoCallEnabled;
    
    if (this.autoCallEnabled) {
      this.autoCallInterval = setInterval(() => {
        this.callNumber();
      }, 3000); // Call every 3 seconds
    } else {
      this.stopAutoCalling();
    }
  }

  stopAutoCalling(): void {
    if (this.autoCallInterval) {
      clearInterval(this.autoCallInterval);
      this.autoCallInterval = null;
      this.autoCallEnabled = false;
    }
  }

  async endGame(): Promise<void> {
    try {
      await this.socketService.endGame(this.roomCode);
      this.gameStatus = 'finished';
      this.stopAutoCalling();
      this.showSuccess('Game ended!');
    } catch (error: any) {
      this.showError(error);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  formatPattern(pattern: string): string {
    const patterns: any = {
      'early5': 'Early 5',
      'topLine': 'Top Line',
      'middleLine': 'Middle Line',
      'bottomLine': 'Bottom Line',
      'fullHouse': 'Full House'
    };
    return patterns[pattern] || pattern;
  }

  getPatternWinner(pattern: string): string {
    return this.winners[pattern]?.name || 'Not claimed';
  }

  isPatternClaimed(pattern: string): boolean {
    return !!this.winners[pattern];
  }

  getPlayerCount(): number {
    return this.players.filter(p => !p.isHost).length;
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
