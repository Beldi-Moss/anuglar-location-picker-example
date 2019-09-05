export interface PlaceModel  {
  name: string;
  comment?: string;
  location: number;
  photoURL?: string;
  geoPoint: firebase.firestore.GeoPoint;
}
