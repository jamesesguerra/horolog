import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string; 
  theme: string;       
  ripple: boolean;
  menuMode: string;
  scale: number;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  theme = localStorage.getItem('horolog-theme') || 'light';

  private themeMap: { [key: string]: string } = {
    light: 'mdc-light-indigo',
    dark: 'mdc-dark-indigo',
  };

  _config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'overlay',
    colorScheme: this.theme,
    theme: this.themeMap[this.theme],
    scale: 14,
  };


  config = signal<AppConfig>(this._config);
  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: true,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private configUpdate = new Subject<AppConfig>();
  private overlayOpen = new Subject<any>();
  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {
    this.applyThemeFromLocalStorage();

    effect(() => {
      const config = this.config();
      if (this.updateStyle(config)) {
        this.changeTheme();
      }
      this.changeScale(config.scale);
      this.onConfigUpdate();
    });

    this.changeTheme();
  }

  updateStyle(config: AppConfig) {
    return (
      config.theme !== this._config.theme ||
      config.colorScheme !== this._config.colorScheme
    );
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next(null);
    }
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config().menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  applyThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('horolog-theme') || 'light'; // Default to 'light'
    this._config.colorScheme = savedTheme; // Set the color scheme
    this._config.theme = this.themeMap[savedTheme]; // Map to the actual theme ('mdc-light-indigo' or 'mdc-dark-indigo')
    this.config.set(this._config); // Update the signal with the new config

    this.changeTheme();
  }

  changeTheme() {
    const config = this.config();
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    
    if (themeLink) {
      themeLink.setAttribute('href', `assets/layout/styles/theme/${config.theme}/theme.css`);
    }
  }

  replaceThemeLink(href: string) {
    const id = 'theme-css';
    let themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }

  onConfigUpdate() {
    this._config = { ...this.config() };
    this.configUpdate.next(this.config());
  }

  toggleTheme() {
    const newTheme = this._config.colorScheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('horolog-theme', newTheme); // Store the selected theme in localStorage
    this.applyThemeFromLocalStorage(); // Apply the theme immediately
    this.changeTheme(); // Change the theme dynamically
  }
}
