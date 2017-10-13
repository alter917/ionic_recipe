import { Component,ViewChild } from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TabsPage} from "../pages/tabs/tabs";
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";

import firebase from "firebase";
import {AuthService} from "../services/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  signinPage = SigninPage;
  signupPage = SignupPage;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              private authService: AuthService) {
    firebase.initializeApp({
      apiKey: 'AIzaSyBmFoP7N47QL3exr2l0jfB-vQbAt0v0Bic',
      authDomain: 'ionic2-recipebook-56ef7.firebaseapp.com',
    });
    firebase.auth().onAuthStateChanged(user =>{
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = TabsPage;
      } else {
        this.isAuthenticated = false;
        this.rootPage = SigninPage;
      }
    });
    console.log("test:" + this.isAuthenticated);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }
}

