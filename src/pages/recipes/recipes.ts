import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, PopoverController} from 'ionic-angular';
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {Recipe} from "../../models/recipe";
import {RecipesService} from "../../services/recipes";
import {RecipePage} from "../recipe/recipe";
import {DatabaseOptionsPage} from "../database-options/database-options";
import {AuthService} from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(public navCtrl: NavController,
              private recipesService: RecipesService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService) {
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    console.log(recipe);
    console.log(index);
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(myEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(
      data => {
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.slService.fetchList(token).subscribe(
                  (list: Ingredient[]) => {
                    loading.dismiss();
                    if (list) {
                      this.listItems = list;
                    } else {
                      this.listItems = [];
                    }
                  },
                  error => {
                    loading.dismiss();
                    this.handleError(error.json().message);
                  }
                )
              }
            );
        } else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.slService.storeList(token).subscribe(
                  () => loading.dismiss(),
                  error => {
                    loading.dismiss();
                    this.handleError(error.json().message);
                  }
                )
              }
            );
        }
      }
    );
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['ok']
    });
    alert.present();
  }

}
