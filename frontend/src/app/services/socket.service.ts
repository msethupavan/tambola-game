import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private connected$ = new Subject<boolean>();

  // Observables for game events
  public playerJoined$ = new Subject<any>();
  public playerLeft$ = new Subject<any>();
  public gameStarted$ = new Subject<any>();
  public numberCalled$ = new Subject<any>();
  public claimValidated$ = new Subject<any>();
  public gameEnded$ = new Subject<any>();

  connect(): void {
    if (this.socket) return;

    this.socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected$.next(false);
    });

    // Game event listeners
    this.socket.on('player-joined', (data) => {
      this.playerJoined$.next(data);
    });

    this.socket.on('player-left', (data) => {
      this.playerLeft$.next(data);
    });

    this.socket.on('game-started', (data) => {
      this.gameStarted$.next(data);
    });

    this.socket.on('number-called', (data) => {
      this.numberCalled$.next(data);
    });

    this.socket.on('claim-validated', (data) => {
      this.claimValidated$.next(data);
    });

    this.socket.on('game-ended', (data) => {
      this.gameEnded$.next(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  // Emit events with callbacks
  createRoom(hostName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('create-room', { hostName }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  joinRoom(roomCode: string, playerName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('join-room', { roomCode, playerName }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  startGame(roomCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('start-game', { roomCode }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  callNumber(roomCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('call-number', { roomCode }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  claimPattern(roomCode: string, pattern: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('claim-pattern', { roomCode, pattern }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  endGame(roomCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Not connected');
        return;
      }
      this.socket.emit('end-game', { roomCode }, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  leaveRoom(roomCode: string): void {
    if (this.socket) {
      this.socket.emit('leave-room', { roomCode });
    }
  }
}
