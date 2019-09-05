import { Injectable } from '@angular/core';
import {PlaceModel} from '../models/place';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, DocumentReference} from '@angular/fire/firestore';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  placesCollection: AngularFirestoreCollection<PlaceModel>;

  constructor(private fstore: AngularFirestore) {
    this.placesCollection = this.fstore.collection('places');
  }
    getMyPlaces(): Observable<PlaceModel[]> {
    return this.placesCollection.valueChanges();
    }

    addNewPlace(data: PlaceModel): Promise<DocumentReference> {
      return this.placesCollection.add(data);
    }

}
