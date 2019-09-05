import {Component, OnInit, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {AgmMap, MouseEvent, LatLngBounds, LatLngBoundsLiteral} from '@agm/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as firebase from "firebase";
import {PlaceModel} from "../models/place";
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {from, of} from "rxjs/index";
import {ImageUploadService} from "../services/image-upload.service";
import {map, switchMap} from "rxjs/internal/operators";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  latitude = 36.6753312;
  longitude = 7.65431;
  addNewPlace = false;
  placeFrom: FormGroup;
  markers = [];
  geocoder
  googleMap: GoogleMap;
  newMarker;
  myPlaces: PlaceModel[]= [];
  @ViewChild('AgmMap') agmMap: AgmMap;
  imageData
  imageUrl
  placeHasImage = false;
  markerIcon = {
    url: 'assets/marker.png',
    scaledSize: {
      width: 60,
      height: 60
    }
  };
  @HostListener('document:click', ['$event'])
  clickedOutside($event){
  this.fitMapBound();
  }

  constructor(private router: Router, private authService: AuthService, private imgService: ImageUploadService, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.initForm();
    this.getMyPlaces();
  }
  initForm() {
    this.placeFrom = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      comment: new FormControl(''),
      location: new FormControl(null, [Validators.required]),
      geoPoint: new FormControl(null, [Validators.required])
    });
  }

  ngAfterViewInit() {
    console.log(this.agmMap);
    this.agmMap.mapReady.subscribe(map => {
      this.googleMap = map;
      this.fitMapBound();
    });
  }
  fitMapBound(){
    if(this.markers.length !== 0){
      const bounds: LatLngBounds = new google.maps.LatLngBounds();
      for (const mm of this.markers) {
        bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
      }
      this.googleMap.fitBounds(bounds);
    }
  }
  getMyPlaces() {
    this.databaseService.getMyPlaces().subscribe(res => {
      this.myPlaces = res;
      this.initMarkers();
    });
  }
  initMarkers() {
    this.markers = [];
    this.myPlaces.forEach((place: PlaceModel) => {
      this.markers.push({
        lat: place.geoPoint.latitude,
        lng: place.geoPoint.longitude,
        name: place.name,
        image: place.photoURL,
        location: place.location}
      )
    })
    this.fitMapBound();
  }

  focusOnPlace(event, place) {
    this.googleMap.panTo(new google.maps.LatLng(place.geoPoint.latitude , place.geoPoint.longitude));
    setTimeout( () => this.googleMap.setZoom(9), 500);
    if(event){
      event.stopPropagation();
    }
}
  mapClicked($event: MouseEvent) {
    if (this.addNewPlace) {
      this.markers = [];
      this.newMarker = {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: true,
        animation: google.maps.Animation.BOUNCE,
      };
      this.placeFrom.controls['geoPoint'].setValue(new firebase.firestore.GeoPoint(this.newMarker.lat, this.newMarker.lng));
      this.geocoder = new google.maps.Geocoder();
      this.markers.push(this.newMarker);
      this.getAddress(this.newMarker).then(res => {
        console.log('result ', res);
        this.placeFrom.controls['location'].setValue(res || '');
      }).catch(err => {
        alert("Error " + err);
      });
    }
  }

  public getAddress(query: any) {
    console.log(query)
    return new Promise((resolve, reject) => {
      const latlng = {lat: parseFloat(query.lat), lng: parseFloat(query.lng)};
      this.geocoder.geocode({'location': latlng}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve("unkown");
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
          reject(status);
        }
      });

    });
  }

  updatePlace(res) {
    if (this.imageData) {
      return of(res.place.update({photoURL: res.photoURL}));
    } else {
      return of({});
    }
  }
  uploadImage(data ) {
    const placeDocument = data;
    if (!this.imageData) { return from(null); }
    const {changes, percentage, ref } =  this.imgService.uploadImage('images/places', this.imageData);
    percentage.subscribe(res => {  console.log('percentage ', res); });
    return from(changes).pipe(switchMap(() =>  ref.getDownloadURL().pipe(map(res => {return {photoURL: res, place: placeDocument}; } ) ) ));
  }

  async submit(values)  {
    this.addNewPlace = false;
    try {
      from(this.databaseService.addNewPlace(values)).pipe(
        switchMap(( placeData: any) =>  this.uploadImage(placeData) ),
        switchMap((res) => this.updatePlace(res))
      ).subscribe(res => { console.log("done") });
    } catch  (error) {
    }
  }

  newPlaceRequest() {
      this.markers = [];
    if(this.addNewPlace){
      this.placeFrom.reset();
    };
    this.addNewPlace = !this.addNewPlace;
    if(!this.addNewPlace) {
      if(this.newMarker){
        this.initMarkers();
        this.newMarker = null;
      }
    }
  }

  onFileSelect(event) {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    if (!files || files.length === 0 ) { return; }
    const reader = new FileReader();
    reader.onload =  (e: any) => {
      this.imageUrl = e.target.result;
      this.placeHasImage = true;
    };
    reader.readAsDataURL(files[0]);
    this.imageData = files[0];
  }

 async signOut() {
    try{
      await this.authService.signOut();
      this.router.navigateByUrl('login');
    } catch (e) {
      alert(e);
    }
  }
}
