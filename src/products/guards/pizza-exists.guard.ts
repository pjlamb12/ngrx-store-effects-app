import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import * as fromStore from '../store';

import { Pizza } from '../models/pizza.model';

@Injectable()
export class PizzaExistsGuard implements CanActivate {
	constructor(private store: Store<fromStore.ProductsState>) {}

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		return this.checkStore().pipe(
			switchMap(() => {
				const id = parseInt(route.params.pizzaId);
				return this.hasPizza(id);
			}),
		);
	}

	checkStore(): Observable<boolean> {
		return this.store.select(fromStore.getPizzasLoaded).pipe(
			tap(loaded => {
				if (!loaded) {
					this.store.dispatch(new fromStore.LoadPizzas());
				}
			}),
			filter(loaded => loaded),
			take(1),
		);
	}

	hasPizza(id: number): Observable<boolean> {
		return this.store
			.select(fromStore.getPizzasEntities)
			.pipe(map((entities: { [key: number]: Pizza }) => !!entities[id]), take(1));
	}
}
