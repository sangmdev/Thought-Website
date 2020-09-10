//import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
//import { Injectable } from "@angular/core";
//import { Router } from "@angular/router";

//import { Observable } from "rxjs";
//import { tap } from "rxjs/operators";

//export class AuthInterceptor implements HttpInterceptor {
//  constructor(private readonly router: Router) { }

//  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//    request.clone({
//      withCredentials: true
//    })

//    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

//    if (!request.headers.has("Authorization")) {
//      const jwt = `Bearer`;
//      request = request.clone({
//        headers: request.headers.set("Authorization", jwt)
//      });
//    }

//    return next.handle(request).pipe(tap(() => { },
//      error => {
//        var respError = error as HttpErrorResponse;
//        if (respError && respError.status === 401 || respError.status === 403) {
//          this.router.navigate(["/unauthorized"]);
//        }
//      }));
//  }
//}
