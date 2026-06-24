import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <button class="menu-toggle" (click)="toggleSidebar()" aria-label="Menú">
        <i class="pi pi-bars"></i>
      </button>
      <div class="sidebar-backdrop" *ngIf="isSidebarOpen && isMobile" (click)="closeSidebar()"></div>
      <app-sidebar [open]="isSidebarOpen" [mobile]="isMobile"></app-sidebar>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      position: relative;
    }
    .menu-toggle {
      display: none;
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 1001;
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      color: var(--text-color);
      font-size: 1.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .menu-toggle:hover {
      background: var(--surface-hover);
    }
    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 999;
    }
    .main-content {
      margin-left: 250px;
      padding: 2rem;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
    }
    @media (max-width: 767px) {
      .menu-toggle {
        display: block;
      }
      .main-content {
        margin-left: 0;
        padding: 1rem;
        padding-top: 4rem;
      }
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly sub = new Subscription();

  isMobile = window.innerWidth < 768;
  isSidebarOpen = !this.isMobile;

  @HostListener('window:resize')
  onResize() {
    const mobile = window.innerWidth < 768;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      if (!mobile) {
        this.isSidebarOpen = true;
      } else {
        this.isSidebarOpen = false;
      }
    }
  }

  ngOnInit() {
    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          if (this.isMobile) this.isSidebarOpen = false;
        })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
