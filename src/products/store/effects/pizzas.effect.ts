import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import * as pizzaActions from '../actions/pizzas.action';
import * as fromRoot from '../../../app/store';

import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as fromServices from '../../services';
import { Pizza } from '../../models/pizza.model';

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
		switchMap((pizza: Pizza) => {
			return this.pizzaService
				.createPizza(pizza)
				.pipe(
					map(createdPizza => new pizzaActions.CreatePizzaSuccess(createdPizza)),
					catchError(error => of(new pizzaActions.CreatePizzaFail(error))),
				);
		}),
	);

	@Effect()
	createPizzaSuccess$ = this.actions$
		.ofType(pizzaActions.CREATE_PIZZA_SUCCESS)
		.pipe(
			map((action: pizzaActions.CreatePizzaSuccess) => action.payload),
			map(pizza => new fromRoot.Go({ path: ['/products', pizza.id] })),
		);

	@Effect()
	updatePizza$ = this.actions$.ofType(pizzaActions.UPDATE_PIZZA).pipe(
		map((action: pizzaActions.UpdatePizza) => action.payload),
		// tslint:disable-next-line:arrow-return-shorthand
		switchMap((pizza: Pizza) => {
			return this.pizzaService
				.updatePizza(pizza)
				.pipe(
					map((updatedPizza: Pizza) => new pizzaActions.UpdatePizzaSuccess(updatedPizza)),
					catchError(error => of(new pizzaActions.UpdatePizzaFail(error))),
				);
		}),
	);

	@Effect()
	removePizza$ = this.actions$.ofType(pizzaActions.REMOVE_PIZZA).pipe(
		map((action: pizzaActions.RemovePizza) => action.payload),
		// tslint:disable-next-line:arrow-return-shorthand
		switchMap((pizza: Pizza) => {
			return this.pizzaService
				.removePizza(pizza)
				.pipe(
					map(() => new pizzaActions.RemovePizzaSuccess(pizza)),
					catchError(error => of(new pizzaActions.RemovePizzaFail(error))),
				);
		}),
	);

	@Effect()
	handlePizzaSuccess$ = this.actions$
		.ofType(pizzaActions.UPDATE_PIZZA_SUCCESS, pizzaActions.REMOVE_PIZZA_SUCCESS)
		.pipe(map(pizza => new fromRoot.Go({ path: ['/products'] })));
}
