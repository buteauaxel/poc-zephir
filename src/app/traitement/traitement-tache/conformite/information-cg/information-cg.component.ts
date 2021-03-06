import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TacheService } from '../../../../shared/services/tache.service';
import { Tache, Nature } from '../../../../shared/domain/Tache';
import { Modification, Donnee } from '../../../../shared/domain/Modification';
import { ModificationService } from '../../../../shared/services/modification.service';

@Component({
  selector: 'app-information-cg',
  templateUrl: './information-cg.component.html',
  styleUrls: ['./information-cg.component.css']
})
export class InformationCgComponent implements OnInit {

  //Champs du Form
  public currentMarque: string
  public currentImmat: string
  public currentModele: string
  public currentMEC: string
  public currentDesignation: string
  public currentMDA: string
  public currentDA: string
  //Liste des modifications
  public lesModifsCG: Modification[] = []

  currentTache: Tache;
  change: boolean = false  
  date = new Date("01/01/2018");// Format anglais : mois/jours/annee 
  
  constructor(private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private toastr: ToastrService) { }

  ngOnInit() {
    // Mise en place de la date max des inputs de type date ---------------------------------------------------
    let today = new Date();
    (<HTMLInputElement>document.getElementById('mec')).setAttribute("max", this.createDate(today));    
    (<HTMLInputElement>document.getElementById('dateAcquisition')).setAttribute("max", this.createDate(today));  
    //---------------------------------------------------------------------------------------------------------
    this.route.params.subscribe(data => {
    this.currentTache = this.tacheService.getTacheById(+data.piece);
    });
    this.lesModifsCG = this.modifService.getModificationByPiece(this.currentTache.ident)
    this.setInputValue();
  }

  /**
   * fonction a chaque perte de focus sur un des inputs et test si il y a un changement
   */
  ifChangement() {
    const marque = (<HTMLInputElement>document.getElementById('marque')).value    
    const immat = (<HTMLInputElement>document.getElementById('immat')).value    
    const modele = (<HTMLInputElement>document.getElementById('modele')).value    
    const mec = (<HTMLInputElement>document.getElementById('mec')).value    
    const designation = (<HTMLInputElement>document.getElementById('designation')).value    
    const mda = (<HTMLInputElement>document.getElementById('mda')).value    
    const da = (<HTMLInputElement>document.getElementById('dateAcquisition')).value    

    if(marque != this.currentMarque || immat != this.currentImmat || modele != this.currentModele || 
       mec != this.currentMEC ||
       designation != this.currentDesignation || mda != this.currentMDA || 
       da != this.currentDA) { // Vérifie si au moins un des champs à été modifié
      
      this.change = true
      if( this.tacheService.getActionMetierByDossier(this.currentTache.idTacheMere).length == 0){
        this.tacheService.createTacheTemporaire("AVT",this.tacheService.getDossierById(this.currentTache.idTacheMere), Nature.TACHE);
      }
      this.DemandeAvt(marque, immat, modele, mec, designation, mda, da)
    }
  }

  /**
   * Créer ou modifie une demande d'avenant en fonction du ou des champs modifiés
   * @param marque 
   * @param immat 
   * @param modele 
   * @param mec 
   * @param designation 
   * @param mda 
   * @param da 
   */
  DemandeAvt(marque : string, immat: string, modele: string, mec: string, designation:string, mda: string, da: string){
    let modifCG;    
    if(marque != this.currentMarque) {
      if (this.modifService.getModifByDonnee(Donnee.MARQUE_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.MARQUE_VEHICULE, this.currentMarque, marque);
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.MARQUE_VEHICULE);
        modifCG.valeurApres = marque;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }      
      this.currentMarque = marque
    } else if (immat != this.currentImmat) {
      if (this.modifService.getModifByDonnee(Donnee.IMMATRICULATION_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.IMMATRICULATION_VEHICULE, this.currentImmat, immat)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.IMMATRICULATION_VEHICULE);
        modifCG.valeurApres = immat;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }          
      this.currentImmat = immat
    } else if (modele != this.currentModele) {      
      if (this.modifService.getModifByDonnee(Donnee.MODELE_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.MODELE_VEHICULE);
        modifCG.valeurApres = modele;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }    
      this.currentModele = modele
    } else if (mec != this.currentMEC) {
      if (this.modifService.getModifByDonnee(Donnee.MEC_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.MEC_VEHICULE, this.currentMEC, mec)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.MEC_VEHICULE);
        modifCG.valeurApres = mec;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }         
      this.currentMEC = mec
    } else if (designation != this.currentDesignation) {
      if (this.modifService.getModifByDonnee(Donnee.DESIGNATION_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.DESIGNATION_VEHICULE, this.currentDesignation, designation)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.DESIGNATION_VEHICULE);
        modifCG.valeurApres = designation;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }  
      this.currentDesignation = designation
    } else if (mda != this.currentMDA) {
      if (this.modifService.getModifByDonnee(Donnee.MA_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.MA_VEHICULE, this.currentMDA, mda)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.MA_VEHICULE);
        modifCG.valeurApres = mda;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
      this.currentMDA = mda
    } else if (da != this.currentDA) {
      if (this.modifService.getModifByDonnee(Donnee.DA_VEHICULE) == null) {
        modifCG = new Modification(this.currentTache.ident,Donnee.DA_VEHICULE, this.currentDA, da)
        this.modifService.ajoutModification(modifCG)
        this.toastr.success('Une demande d\'avenant a été créée')
      } else {
        modifCG = this.modifService.getModifByDonnee(Donnee.DA_VEHICULE);
        modifCG.valeurApres = da;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
      this.currentDA = da
    }
  }

  /**
   * Insère les données de base dans le formulaire
   */
  private setInputValue(){
    this.currentMarque = "BMW";
    this.currentImmat = "AB-123-CP";
    this.currentModele = "SERIE 3";
    this.currentDesignation = "";
    this.currentMDA ="";
    this.currentMEC = this.createDate(this.date);
    this.currentDA = this.createDate(this.date);
    //Changement par les valeurs de modification si existantes
    if(this.lesModifsCG.length > 0){           
      this.lesModifsCG.forEach( m => {
        switch(m.donnee){
          case Donnee.MARQUE_VEHICULE : 
            this.currentMarque = m.valeurApres; 
            break;
          case Donnee.IMMATRICULATION_VEHICULE :
            this.currentImmat = m.valeurApres;
            break;
          case Donnee.MODELE_VEHICULE :
            this.currentModele = m.valeurApres;
            break;
          case Donnee.MEC_VEHICULE :
            this.currentMEC =this.createDate(new Date(m.valeurApres));    
            break;
          case Donnee.DESIGNATION_VEHICULE :
            this.currentDesignation = m.valeurApres;
            break;
          case Donnee.MA_VEHICULE :
            this.currentMDA = m.valeurApres;
            break;
          case Donnee.DA_VEHICULE :
            this.currentDA = this.createDate(new Date(m.valeurApres));
            break;
        } 
      })
    }
  }

  /**
   * Créer la date au format adéquate (mm/jj/aaaa) afin qu'elle s'affiche correctement dans le formulaire
   * @param date 
   */
  private createDate(date: Date): string {
    let dateString = "";
    dateString += date.getFullYear() +"-";
    if((date.getMonth()+1) < 10){
      dateString += "0"+(date.getMonth()+1)+"-"
    } else {
      dateString += (date.getMonth()+1)+"-"
    }
    if(date.getDate() < 10){
      dateString += "0"+date.getDate()
    } else {
      dateString += date.getDate()
    }
    return dateString
  }
}