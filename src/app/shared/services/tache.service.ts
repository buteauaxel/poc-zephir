import {Injectable} from '@angular/core';
import {Nature, Status, Tache} from '../domain/Tache';
import {Context} from '../domain/context';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {GroupeService} from './groupe.service';
import {Code} from '../domain/groupe';
import {t} from '@angular/core/src/render3';
import {UtilisateurService} from './utilisateur.service';
import { Contrat } from '../domain/contrat';
import { Utilisateur, Profil } from '../domain/Utilisateur';


@Injectable()
export class TacheService {

  constructor(private UtilisateurService: UtilisateurService) {

    let length = 0;
    this.tacheSubject.subscribe(data => length = data.length);
    if (length < 1) {
      this.create15Dossiers();
      this.create_100_DossiersClotures();
      /// begin TMP
      const lTache = new Tache(Nature.DOSSIER);
      lTache.ident = 1000019;
      const c = new Contrat(740000,'SOLUTIO');
      c.numero = 'S140580';
      const context = 
      lTache.context = new Context(100019, this.nomApl[0], this.nomInter[0], c);
      lTache.idGroupe = 1;
      lTache.priorite = 5;
      lTache.code = "199_AFN";
      lTache.dateLimite = new Date('06/15/2018');
      lTache.dateCreation = new Date();
      lTache.idUtilisateur = 5; // Rousseau

      this.listTaches.push(lTache);
      this.create3PiecesTMP(lTache);

      /// end TMP



      this.tacheSubject.next(this.listTaches);
    }
  }

  listTaches: Tache[] = [];
  // données en mémoire
  tacheSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([]);

  


  listerTaches(): Observable<Tache[]> {
    return this.tacheSubject;
  }

  /** Permet l'ajout d'une liste a tacheSubject
   * 
   * @param list 
   */
  nextListSubject(list: any){
    this.tacheSubject.next(list)
  }

  addTache(tache: Tache) {
    tache.ident = this.listTaches[(this.listTaches.length - 1)].ident + 1;
    this.listTaches.push(tache);
    this.tacheSubject.next(this.listTaches);
  }

  getTacheById(id: number): Tache {
    return this.listTaches.find(t => t.ident === id);
  }

  /**
   * retourne une pièce en fonction de son id
   * @param id 
   */
  getPieceById(id: number): Tache {
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.PIECE);
  }

  /**
   * Retourne la liste de pièces en fonction de l'ID du dossier (199), trié par priorité.
   * @param idDossier 
   */
  getPiecesByDossier(idDossier: number): Tache[]{
    return this.listTaches.filter(t => t.nature == Nature.PIECE && t.idTacheMere === idDossier).sort(this.trieByPriorite)
  }

  /**
   * Retourne la liste de note en fonction de l'ID du dossier (199)
   * @param idDossier 
   */
  getNotesByDossier(idDossier: number): Tache[]{
    return this.listTaches.filter(t => t.nature == Nature.NOTE && t.idTacheMere === idDossier)
  }

  /**
   * retourne un dossier (199) en fonction de son ID
   * @param id 
   */
  getDossierById(id: number): Tache {
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.DOSSIER);
  }

  /**
   * set la date de cloture de vérification et set l'id de l'utilisateur vérificateur
   * @param {number} idTache
   * @returns {Tache}
   */
  closePieceConforme(idTache: number): Tache {
    const p = this.getPieceById(idTache);
    p.dateVerification  = new Date();
    p.idUtilisateurVerification = p.idUtilisateur;
    
    return p;
  }
  /**
   * le status reste "à vérifier"
   * Ajout de la date de vérification et de cloture
   * @param idTache 
   */
  closePieceNonConforme(idTache: number, motifNonConformite: string) {
    const p = this.getTacheById(idTache);
    p.motifNonConformite = motifNonConformite;
    p.dateCloture = new Date();
    p.dateVerification = p.dateCloture;
  }


  /**
   * Passer le status de "A_VERIFIER" à "A_VALIDER"
   * la pièce est affectée au groupe "Validation"
   * la date de vérification est affecté à la date et heure du jour.
   * l'id Utilisateur est affecté à l'utilisateur de vérification.
   * @param {number} idTache
   */
  toEtapeValidation(idTache: number) {
    const tache = this.getTacheById(idTache);
    //appel web service pour récupérer l'id du groupe validati on
    tache.idGroupe = 2;
    tache.dateVerification = new Date();
    tache.idUtilisateurVerification = tache.idUtilisateur;

    tache.idUtilisateur = null;


  }

  /**
   * 
   * @param idTache 
   * @param motif 
   */
  closeTacheNonConforme(idTache: number, motif: string): Tache {
    const p = this.getTacheById(idTache);
    p.motifNonConformite = motif;
    p.dateCloture = new Date();

    return p;
  }
  /**
   * Fermeture de la Piece après validation 
   * @param idTache 
   */
  closeTacheConforme(idTache: number){
    const tache = this.getPieceById(idTache);
    tache.idUtilisateurCloture = tache.idUtilisateur;
    tache.dateCloture = new Date();
  }

  /**
   * Fermeture du dossier
   */
  closeDossier(idDossier: number){
    let dossier = this.getDossierById(idDossier)
    dossier.dateCloture = new Date()
  }
  
  private create_100_DossiersClotures(){
    for (let i = 500 ; i < 600 ; i++) {
        const lTache = new Tache(Nature.DOSSIER);
        lTache.ident = i;
        const c = new Contrat(450020+i,'SOLUTIO')
        c.numero = 'S140510'+ i;
        lTache.context = new Context(330010+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
        lTache.priorite = (i%10) + 1;
        lTache.code = "199_AFN";
        const date = '05/' + ((i%31) + 1) + '/2018';
        lTache.dateCloture = new Date(date);
        lTache.dateVerification  = new Date('05/21/2018');
        lTache.dateCreation  = new Date('05/01/2018');
        lTache.dateReception = new Date('05/01/2018');
        const idUser = ((Math.floor(Math.random() * (999999 - 100000)) + 100000) % 6 ) + 1;
        
        lTache.idUtilisateurVerification = [1, 4, 6][i % 3];
        lTache.idUtilisateurCloture = [2, 3, 5][i % 3];
        this.listTaches.push(lTache);
    }
  }
  private create15Dossiers() {
    for (let i = 0; i < 15; i++) {
      const lTache = new Tache(Nature.DOSSIER);
      lTache.ident = 1000020+i;
      const c = new Contrat(740001+i,'SOLUTIO');
      c.numero = 'S140581'+ i;
      const context = 
      lTache.context = new Context(100020+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
      lTache.idGroupe = 1;
      lTache.priorite = 5;
      lTache.code = "199_AFN";
      lTache.dateLimite = new Date('06/15/2018');
      lTache.dateCreation = new Date();
      lTache.idUtilisateur = null;

      this.listTaches.push(lTache);
      this.create3Pieces(lTache);
    }
  }
  private create3Pieces(dossier_199: Tache) {
    for (let i = 0; i < 3; i++) {
      const lPiece = new Tache(Nature.PIECE);  
      lPiece.ident = this.listTaches.length + 70000 ;
      lPiece.idTacheMere = dossier_199.ident;
      lPiece.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i];
      lPiece.priorite = [5, 3, 6][i];
      lPiece.urlDocument = ['assets/pdf/CG.pdf','assets/pdf/PDC.pdf','assets/pdf/RI.pdf'][i];
      lPiece.context = dossier_199.context;
      lPiece.dateLimite = dossier_199.dateLimite
      lPiece.dateCreation = new Date();
      lPiece.dateReception = new Date();
      
      this.listTaches.push(lPiece);
    }
  }
  private create3PiecesTMP(dossier_199: Tache) {
    for (let i = 0; i < 3; i++) {
      const lPiece = new Tache(Nature.PIECE);  
      lPiece.ident = this.listTaches.length + 70000 ;
      lPiece.idTacheMere = dossier_199.ident;
      lPiece.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i];
      lPiece.priorite = [5, 3, 6][i];
      lPiece.urlDocument = ['assets/pdf/CG.pdf','assets/pdf/PDC.pdf','assets/pdf/RI.pdf'][i];
      lPiece.context = dossier_199.context;
      lPiece.dateLimite = dossier_199.dateLimite
      lPiece.dateCreation = new Date();
      lPiece.dateReception = new Date();
      lPiece.dateVerification = new Date();
      lPiece.idUtilisateurVerification = dossier_199.idUtilisateur;
      
      this.listTaches.push(lPiece);
    }

  }
  createPiece(code: Code, dossier: Tache) {
    // Appel Web service pour la génération de de l'identifiant
    const lPiece =  new Tache(Nature.PIECE);
    lPiece.code = code;
    lPiece.dateCreation = new Date();
    lPiece.ident =  Math.floor(Math.random() * (999999 - 100000));
    lPiece.idTacheMere = dossier.ident;
    lPiece.context = dossier.context;
    lPiece.dateLimite = dossier.dateLimite
    lPiece.dateCreation = new Date();
    lPiece.priorite = 3;
    this.listTaches.push(lPiece);

    this.tacheSubject.next(this.listTaches);
  }

  private nomInter = [
            'ROUQUETTE FREDERIC'
            ,'ROUQUETTE FREDERIC'
            ,'IQBAL ZAFAR'
            ,'IQBAL ZAFAR'
            ,'IQBAL ZAFAR'
            ,'FOSTER MALCOLM'
            ,'FOSTER MALCOLM'
            ,'FOSTER MALCOLM'
            ,'CETANI MARIO'
            ,'CETANI MARIO'
            ,'CETANI MARIO'
            ,'SCHONDORF DANIEL'
            ,'SCHONDORF DANIEL'
            ,'SCHONDORF DANIEL'
            ,'LAMBERT PIERRETTE'
            ,'LAMBERT PIERRETTE'
            ,'LAMBERT PIERRETTE'
  ]
  private nomApl = [
          'BOYER ET MORVILLIERS',
          'BOYER ET MORVILLIERS',
          'LEADER ASSURANCES',
          'LEADER ASSURANCES',
          'FAAC',
          'FAAC',
          'FAAC',
          'PEREIRE DIRECT',
          'PEREIRE DIRECT',
          'PEREIRE DIRECT',
          'APM ASSURANCES',
          'APM ASSURANCES',
          'APM ASSURANCES',
          'ASSUR INVEST',
          'ASSUR INVEST',
          'ASSUR INVEST',
          'H/ZEPHIR ASSURANCES'
  ]

  private trieByPriorite = (p1,p2) => {
    if ( p1.priorite == p2.priorite )
        return 0;
    else if  (p1.priorite < p2.priorite) 
        return -1;
      else
    return 1;
  }
  /*private getPiecesByContext(context: Context): Tache[]{
    return this.listTaches.filter(piece => piece.context == context && piece.nature == Nature.PIECE)
    .sort(this.trieByPriorite);
  }*/

  public getPiecesByIdContext(idContext: number): Tache[]{
    return this.listTaches.filter(piece => piece.context.ident == idContext && piece.nature == Nature.PIECE)
    .sort(this.trieByPriorite);
  }

  public getDossierByIdContext(idContext: number, userId: number): Tache{
    return this.listTaches.find(dossier => dossier.context.ident == idContext && dossier.nature == Nature.DOSSIER && dossier.idUtilisateur == userId)
  }

  public getDossierTermine(){
    return this.listTaches.filter( t => t.nature === Nature.DOSSIER && t.dateCloture != null)
  }

  public getDossierEncours(){
    return this.listTaches.filter( t => t.nature === Nature.DOSSIER && t.dateCloture == null)
  }

  public getDossierTermineByUser(idUtilisateur: number){
    return this.listTaches.filter( t => t.idUtilisateur == idUtilisateur && t.nature === Nature.DOSSIER && t.dateCloture != null)
  }

  public getDossierEnCoursByUser(idUtilisateur: number){
    return this.listTaches.filter( t => t.idUtilisateur == idUtilisateur && t.nature === Nature.DOSSIER && t.dateCloture == null)
  }

  public getStatutDossier(idDossier: number): Status{
    let lesPieces = this.getPiecesByDossier(idDossier)
    if (lesPieces.length == 0) {
      return Status.EN_ATTENTE
    }  else {
      for (let p of lesPieces) {
        if(p.status === 'En attente' )  {
           return Status.EN_ATTENTE;
        }
      }
      for (let p of lesPieces) {
        if(p.status === 'À vérifier' )  {
          return Status.A_VERIFIER;
        }
      }
      for (let p of lesPieces) {
        if(p.status === 'À valider' )  {
          return Status.A_VALIDER;
        }
      }
    }
      return Status.OK 
  }

  public createNote(tacheMere: Tache, message: string) {
    const lNote = new Tache(Nature.NOTE);
    lNote.idTacheMere = tacheMere.ident;
    lNote.message = message;
    lNote.context = tacheMere.context;
    lNote.dateCreation = new Date();
    lNote.idUtilisateur = tacheMere.idUtilisateur;
    
    this.listTaches.push(lNote);
    this.tacheSubject.next(this.listTaches);
  }
}

