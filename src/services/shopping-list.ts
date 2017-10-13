import {Ingredient} from "../models/ingredient";
import {Http, Response} from "@angular/http";
import {AuthService} from "./auth";
import {Injectable} from "@angular/core";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListService {
  private ingredients: Ingredient[] = [];

  constructor(private http: Http,
              private authService: AuthService) {
  }

  addItem(name: string, amount: number) {
    this.ingredients.push(new Ingredient(name, amount));
    console.log(this.ingredients);
  }

  addItems(items: Ingredient[]) {
    this.ingredients.push(...items);
  }

  getItems() {
    return this.ingredients.slice();
  }

  removeItem(index: number) {
    return this.ingredients.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://ionic2-recipebook-56ef7.firebaseio.com/'
      + userId + '/shopping-list.json?auth=' + token , this.ingredients)
      .map((response: Response) => {
          return response.json();
        });

  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://ionic2-recipebook-56ef7.firebaseio.com/'
      + userId + '/shopping-list.json?auth=' + token , this.ingredients)
      .map((response: Response) => {
        return response.json();
      })
      .do((data) => {
        this.ingredients = data;
      });
  }
}