// import { Component, Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-output',
//   templateUrl: './output.component.html',
//   styleUrls: ['./output.component.scss']
// })

// @Injectable({ providedIn: 'root' })
// export class OutputComponent {

//   private UserUrl = 'http://localhost:3000';  // URL to web api

//   httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };

//   userFormContacts: FormGroup<any> | undefined;
//   messageService: any;

//   constructor(private http: HttpClient) { }

//   /** GET user from the server */
//   getUser(): Observable<User[]> {
//     this.http.post('http://localhost:3000', this.user)
//       .subscribe((response: any) => {
//         if (response.status) {
//           localStorage.setItem('user', JSON.stringify(response));
//         }
//       }, (error: any) => {
//         console.error(error);
//       });

//     return this.http.get<User[]>(this.UserUrl)
//       .pipe(
//         tap(_ => this.log('fetched user')),
//         catchError(this.handleError<User[]>('getuser', []))
//       );
//   }
//   user(arg0: string, user: any) {
//     throw new Error('Method not implemented.');
//   }

//   /** GET User by id. Return `undefined` when id not found */
//   getUserNo404<Data>(id: number): Observable<User> {
//     const url = `${this.UserUrl}/?id=${id}`;
//     return this.http.get<User[]>(url)
//       .pipe(
//         map(user => user[0]), // returns a {0|1} element array
//         tap(h => {
//           const outcome = h ? 'fetched' : 'did not find';
//           this.log(`${outcome} User id=${id}`);
//         }),
//         catchError(this.handleError<User>(`getUser id=${id}`))
//       );
//   }

//   /** GET User by id. Will 404 if id not found */
//   // getUser(id: number): Observable<User> {
//   //   const url = `${this.UserUrl}/${id}`;
//   //   return this.http.get<User>(url).pipe(
//   //     tap(_ => this.log(`fetched User id=${id}`)),
//   //     catchError(this.handleError<User>(`getUser id=${id}`))
//   //   );
//   // }

//   /* GET user whose name contains search term */
//   searchuser(term: string): Observable<User[]> {
//     if (!term.trim()) {
//       // if not search term, return empty User array.
//       return of([]);
//     }
//     return this.http.get<User[]>(`${this.UserUrl}/?name=${term}`).pipe(
//       tap(x => x.length ?
//         this.log(`found user matching "${term}"`) :
//         this.log(`no user matching "${term}"`)),
//       catchError(this.handleError<User[]>('searchuser', []))
//     );
//   }

//   //////// Save methods //////////

//   /** POST: add a new User to the server */
//   addUser(User: User): Observable<User> {
//     return this.http.post<User>(this.UserUrl, User, this.httpOptions).pipe(
//       tap((newUser: User) => this.log(`added User w/ id=${newUser.id}`)),
//       catchError(this.handleError<User>('addUser'))
//     );
//   }

//   /** DELETE: delete the User from the server */
//   deleteUser(id: number): Observable<User> {
//     const url = `${this.UserUrl}/${id}`;

//     return this.http.delete<User>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`deleted User id=${id}`)),
//       catchError(this.handleError<User>('deleteUser'))
//     );
//   }

//   /** PUT: update the User on the server */
//   updateUser(User: User): Observable<any> {
//     return this.http.put(this.UserUrl, User, this.httpOptions).pipe(
//       tap(_ => this.log(`updated User id=${User.id}`)),
//       catchError(this.handleError<any>('updateUser'))
//     );
//   }

//   /**
//    * Handle Http operation that failed.
//    * Let the app continue.
//    *
//    * @param operation - name of the operation that failed
//    * @param result - optional value to return as the observable result
//    */
//   private handleError<T>(operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {

//       // TODO: send the error to remote logging infrastructure
//       console.error(error); // log to console instead

//       // TODO: better job of transforming error for user consumption
//       this.log(`${operation} failed: ${error.message}`);

//       // Let the app keep running by returning an empty result.
//       return of(result as T);
//     };
//   }

//   /** Log a UserService message with the MessageService */
//   private log(message: string) {
//     this.messageService.add(`UserService: ${message}`);
//   }
// }
