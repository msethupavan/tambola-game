import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  playerName: string = '';
  roomCode: string = '';
  gameStatus: string = 'setup'; // setup, waiting, playing, finished
  ticket: number[][] = [];
  markedNumbers: Set<number> = new Set();
  calledNumbers: number[] = [];
  currentNumber: number | null = null;
  winners: any = {};
  errorMessage: string = '';
  successMessage: string = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socketService.connect();
    
    // Subscribe to events
    this.subscriptions.push(
      this.socketService.gameStarted$.subscribe(data => {
        this.gameStatus = 'playing';
        this.showSuccess('Game started!');
      }),
      
      this.socketService.numberCalled$.subscribe(data => {
        this.currentNumber = data.number;
        this.calledNumbers = data.calledNumbers;
        this.autoMarkNumber(data.number);
      }),
      
      this.socketService.claimValidated$.subscribe(data => {
        this.winners[data.pattern] = data.winner;
        this.showSuccess(`${data.winner.name} won ${this.formatPattern(data.pattern)}!`);
      }),
      
      this.socketService.gameEnded$.subscribe(data => {
        this.gameStatus = 'finished';
        this.winners = data.winners;
        this.showSuccess('Game ended!');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.roomCode) {
      this.socketService.leaveRoom(this.roomCode);
    }
    this.socketService.disconnect();
  }

  async joinRoom(): Promise<void> {
    if (!this.playerName.trim()) {
      this.showError('Please enter your name');
      return;
    }
    if (!this.roomCode.trim()) {
      this.showError('Please enter room code');
      return;
    }

    try {
      const response = await this.socketService.joinRoom(
        this.roomCode.toUpperCase(),
        this.playerName
      );
      this.ticket = response.ticket;
      this.gameStatus = 'waiting';
      this.showSuccess('Joined room successfully!');
    } catch (error: any) {
      this.showError(error);
    }
  }

  toggleMark(number: number): void {
    if (this.markedNumbers.has(number)) {
      this.markedNumbers.delete(number);
    } else {
      this.markedNumbers.add(number);
    }
  }

  isMarked(number: number): boolean {
    return this.markedNumbers.has(number);
  }

  isCalled(number: number): boolean {
    return this.calledNumbers.includes(number);
  }

  autoMarkNumber(number: number): void {
    // Auto-mark if number is on ticket
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.ticket[row][col] === number) {
          this.markedNumbers.add(number);
          return;
        }
      }
    }
  }

  async claimPattern(pattern: string): Promise<void> {
    if (this.winners[pattern]) {
      this.showError(`${pattern} already claimed!`);
      return;
    }

    try {
      await this.socketService.claimPattern(this.roomCode, pattern);
      this.showSuccess(`${this.formatPattern(pattern)} claimed successfully!`);
    } catch (error: any) {
      this.showError(error);
    }
  }

  canClaimEarly5(): boolean {
    return !this.winners['early5'] && this.markedNumbers.size >= 5;
  }

  canClaimLine(lineIndex: number): boolean {
    const patterns = ['topLine', 'middleLine', 'bottomLine'];
    const pattern = patterns[lineIndex];
    if (this.winners[pattern]) return false;

    let count = 0;
    for (let col = 0; col < 9; col++) {
      const num = this.ticket[lineIndex][col];
      if (num !== null && this.markedNumbers.has(num)) {
        count++;
      }
    }
    return count === 5; // All 5 numbers in line marked
  }

  canClaimFullHouse(): boolean {
    if (this.winners['fullHouse']) return false;

    let totalNumbers = 0;
    let markedCount = 0;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        const num = this.ticket[row][col];
        if (num !== null) {
          totalNumbers++;
          if (this.markedNumbers.has(num)) {
            markedCount++;
          }
        }
      }
    }
    return markedCount === totalNumbers && totalNumbers === 15;
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
    return this.winners[pattern]?.name || '';
  }

  isPatternClaimed(pattern: string): boolean {
    return !!this.winners[pattern];
  }

  goHome(): void {
    this.router.navigate(['/']);
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
