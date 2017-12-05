import { ChatService } from './chat.service';
import { Component, AfterViewChecked, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked, AfterViewInit {

  public mensagens: Object[] = [];
  public mensagemInserir: string = '';

  @ViewChild('scrollMe') private scrollContainer: ElementRef;

  constructor(private _chatService: ChatService) {

  }

  ngAfterViewInit() {
    this.checkServerReceiver();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.checkServerReceiver();
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  public enviaMensagem(): void {
    const obj = {
      message: this.mensagemInserir,
      author: this._chatService.nomeUsuario
    };

    this._chatService.server.emit('messages', obj);

    this.mensagemInserir = '';
  }

  public onKeyDown(keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.keyCode === 13 && keyboardEvent.shiftKey === false) {
      console.log(keyboardEvent);
      this.enviaMensagem();
    }
  }

  public onKeyUp(keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.keyCode === 13 && keyboardEvent.shiftKey === false) {
      this.mensagemInserir = '';
    }
  }

  private checkServerReceiver() {
    if (this._chatService.server === null) {
      this.mensagens = [];
    } else if (this._chatService.receivingFromServer === false) {
      this._chatService.server.on('messages', m => this.mensagens.push(m));
      this._chatService.receivingFromServer = true;
    }
  }
}
