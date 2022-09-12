import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  sideMenuClose() {
    if (window.innerWidth <= 768) {
      var width = window.innerWidth;
      if (width <= 320) {
        if ($('body').hasClass('sidebar-open')) {
          $('body').removeClass('sidebar-open');
        } else {
          $('body').addClass('sidebar-open ');
        }
      } else {
        if ($('body').hasClass('sidebar-collapse')) {
          $('body').removeClass('sidebar-collapse');
        } else {
          $('body').addClass('sidebar-collapse ');
        }
      }
    }

  }
}
