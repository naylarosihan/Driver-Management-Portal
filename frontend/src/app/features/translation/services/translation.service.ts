// translation.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'; 
@Injectable({
  providedIn: 'root',
})

export class TranslationService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:2688'); // Use io() to create the socket connection
  }

  translate(text: string, targetLanguage: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.emit('translate', { text, targetLanguage });

      this.socket.on('translated', (translatedText: string) => {
        resolve(translatedText);
      });

      this.socket.on('error', (errorMessage: string) => {
        reject(errorMessage);
      });
    });
  }
}
