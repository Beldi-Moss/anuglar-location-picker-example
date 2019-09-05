import { Injectable } from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';
import {AngularFireUploadTask} from '@angular/fire/storage'
import {Observable} from 'rxjs/index';
import {finalize, tap} from 'rxjs/internal/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {UploadTaskSnapshot} from "@angular/fire/storage/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  imageUrl;
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }
  uploadImage(storagePath: string, file: File): {changes: AngularFireUploadTask; percentage: Observable<number>; ref: AngularFireStorageReference } {

    const path = storagePath + '_' + Date.now() + '_' + file.name ;

    const _ref = this.storage.ref(path);

    this.task = this.storage.upload(path, file);

    this.percentage = this.task.percentageChanges();

    this.percentage.subscribe(d => {console.log('perceentge ', d); } );
    return { changes : this.task , percentage: this.percentage, ref: _ref};

  }
}
