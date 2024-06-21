import { bootstrapApplication } from '@angular/platform-browser';
    import { SidebarHeadlessDemo } from './app/sidebar-headless-demo';
    import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

    bootstrapApplication(SidebarHeadlessDemo, {
    providers: [provideAnimationsAsync()],
    }).catch((err) => console.error(err));