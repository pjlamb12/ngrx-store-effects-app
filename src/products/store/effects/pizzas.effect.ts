import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import * as pizzaActions from '../actions/pizzas.action';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as fromServices from '../../services';

@Injectable()
export class PizzasEffects {
	constructor(private actions$: Actions, private pizzaService: fromServices.PizzasService) {}

	@Effect()
	loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
		// tslint:disable-next-line:arrow-return-shorthand
		switchMap(() => {
			return this.pizzaService
				.getPizzas()
				.pipe(
					map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
					catchError(error => of(new pizzaActions.LoadPizzasFail(error))),
				);
		}),
	);

	@Effect()
	createPizza$ = this.actions$.ofType(pizzaActions.CREATE_PIZZA).pipe(
		map((action: pizzaActions.CreatePizza) => action.payload),
		// tslint:disable-next-line:arrow-return-shorthand
		switchMap(pizza => {
			return this.pizzaService
				.createPizza(pizza)
				.pipe(
					map(createdPizza => new pizzaActions.CreatePizzaSuccess(createdPizza)),
					catchError(error => of(new pizzaActions.CreatePizzaFail(error))),
				);
		}),
	);
}
