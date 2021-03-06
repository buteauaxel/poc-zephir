import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TitreService {

  private titreSubject: BehaviorSubject<string> = new BehaviorSubject('Tableau de bord');
  constructor() {
  }

  getTitre(): BehaviorSubject<string> {
    return this.titreSubject;
  }
  updateTitre(titre: string) {
    this.titreSubject.next(titre);
  }

}
