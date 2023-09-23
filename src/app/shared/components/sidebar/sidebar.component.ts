import { Component} from '@angular/core';
import { GifsService } from 'src/app/gifs/services/gifs.service';
import {  Gif } from '../../../gifs/interfaces/gifs.interfaces';


@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public tag: Gif[] = [];

  constructor(private gifsService: GifsService) { }

  get tags(): string[] {
    return this.gifsService.tagsHistory;
  }

  searchTag(tag: string): void {
    this.gifsService.searchTag(tag);
  }
}
