import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'star'
  | 'users'
  | 'eye'
  | 'music'
  | 'chat'
  | 'list'
  | 'collection'
  | 'play'
  | 'pause'
  | 'heart'
  | 'heart-filled'
  | 'dots'
  | 'search'
  | 'bell'
  | 'settings'
  | 'menu'
  | 'clock'
  | 'views'
  | 'logo'
  | 'logout'
  | 'chevron-left'
  | 'chevron-right'
  | 'edit'
  | 'microphone'
  | 'upload'
  | 'check'
  | 'help-circle'
  | 'download'
  | 'youtube'
  | 'collaboration';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [class]="'w-' + size + ' h-' + size + ' ' + customClass"
      [attr.fill]="fill"
      [attr.viewBox]="viewBox"
      [attr.stroke]="stroke"
    >
      <ng-container [ngSwitch]="name">
        <!-- Star -->
        <path
          *ngSwitchCase="'star'"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path>

        <!-- Users -->
        <path
          *ngSwitchCase="'users'"
          d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
        ></path>

        <!-- Eye -->
        <g *ngSwitchCase="'eye'">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          ></path>
        </g>

        <!-- Music -->
        <path
          *ngSwitchCase="'music'"
          d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
        ></path>

        <!-- Chat -->
        <g *ngSwitchCase="'chat'">
          <path
            d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
          ></path>
          <path
            d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
          ></path>
        </g>

        <!-- List -->
        <path
          *ngSwitchCase="'list'"
          fill-rule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        ></path>

        <!-- Collection -->
        <path
          *ngSwitchCase="'collection'"
          d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
        ></path>

        <!-- Play -->
        <path
          *ngSwitchCase="'play'"
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        ></path>

        <!-- Pause -->
        <path
          *ngSwitchCase="'pause'"
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        ></path>

        <!-- Heart -->
        <path
          *ngSwitchCase="'heart'"
          fill-rule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clip-rule="evenodd"
        ></path>

        <!-- Heart Filled -->
        <path
          *ngSwitchCase="'heart-filled'"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        ></path>

        <!-- Dots -->
        <path
          *ngSwitchCase="'dots'"
          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
        ></path>

        <!-- Search -->
        <path
          *ngSwitchCase="'search'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>

        <!-- Bell -->
        <path
          *ngSwitchCase="'bell'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        ></path>

        <!-- Settings -->
        <path
          *ngSwitchCase="'settings'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>

        <!-- Menu -->
        <path
          *ngSwitchCase="'menu'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>

        <!-- Clock -->
        <path
          *ngSwitchCase="'clock'"
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        ></path>

        <!-- Views -->
        <g *ngSwitchCase="'views'">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          ></path>
        </g>

        <!-- Logo -->
        <path
          *ngSwitchCase="'logo'"
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
        ></path>

        <!-- Logout -->
        <path
          *ngSwitchCase="'logout'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        ></path>

        <!-- Chevron Left -->
        <path
          *ngSwitchCase="'chevron-left'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>

        <!-- Chevron Right -->
        <path
          *ngSwitchCase="'chevron-right'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>

        <!-- Edit -->
        <path
          *ngSwitchCase="'edit'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        ></path>

        <!-- Microphone -->
        <path
          *ngSwitchCase="'microphone'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        ></path>

        <!-- Upload -->
        <path
          *ngSwitchCase="'upload'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        ></path>

        <!-- Check -->
        <path
          *ngSwitchCase="'check'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        ></path>

        <!-- Help Circle -->
        <g *ngSwitchCase="'help-circle'">
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          ></circle>
          <path
            d="M7.5 10a2.5 2.5 0 015 0"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            fill="none"
          ></path>
          <circle cx="10" cy="14" r="0.5" fill="currentColor"></circle>
        </g>

        <!-- Download -->
        <path
          *ngSwitchCase="'download'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v-3m0 0l-2-2m2 2l2-2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        ></path>

        <!-- YouTube -->
        <path
          *ngSwitchCase="'youtube'"
          d="M 18 5.8 C 17.8 4.92 17.04 4.28 16.16 4.08 C 14.84 3.8 12.4 3.6 9.76 3.6 C 7.12 3.6 4.64 3.8 3.32 4.08 C 2.44 4.28 1.68 4.88 1.52 5.8 C 1.36 6.8 1.2 8.2 1.2 10 C 1.2 11.8 1.36 13.2 1.56 14.2 C 1.72 15.08 2.48 15.72 3.36 15.92 C 4.76 16.2 7.16 16.4 9.8 16.4 C 12.44 16.4 14.84 16.2 16.24 15.92 C 17.12 15.72 17.88 15.12 18.04 14.2 C 18.2 13.2 18.4 11.76 18.44 10 C 18.36 8.2 18.16 6.8 18 5.8 Z M 7.6 12.8 L 7.6 7.2 L 12.48 10 Z"
        ></path>

        <!-- Collaboration -->
        <g *ngSwitchCase="'collaboration'">
          <path
            d="M12 4.5C13.66 4.5 15 5.84 15 7.5C15 9.16 13.66 10.5 12 10.5C10.34 10.5 9 9.16 9 7.5C9 5.84 10.34 4.5 12 4.5Z"
          ></path>
          <path
            d="M6 6C7.1 6 8 6.9 8 8C8 9.1 7.1 10 6 10C4.9 10 4 9.1 4 8C4 6.9 4.9 6 6 6Z"
          ></path>
          <path
            d="M18 6C19.1 6 20 6.9 20 8C20 9.1 19.1 10 18 10C16.9 10 16 9.1 16 8C16 6.9 16.9 6 18 6Z"
          ></path>
          <path
            d="M12 12C15.31 12 18 13.79 18 16V18H6V16C6 13.79 8.69 12 12 12Z"
          ></path>
          <path
            d="M6 12C5.45 12 4.94 12.1 4.47 12.26C3.61 13.27 3 14.58 3 16V18H5V16C5 14.94 5.39 13.96 6 13.14C6 12.76 6 12.38 6 12Z"
          ></path>
          <path
            d="M18 12C18 12.38 18 12.76 18 13.14C18.61 13.96 19 14.94 19 16V18H21V16C21 14.58 20.39 13.27 19.53 12.26C19.06 12.1 18.55 12 18 12Z"
          ></path>
        </g>
      </ng-container>
    </svg>
  `,
})
export class IconComponent {
  @Input() name: IconName = 'star';
  @Input() size = '5';
  @Input() customClass = '';
  @Input() fill = 'currentColor';
  @Input() stroke = 'none';
  @Input() viewBox = '0 0 20 20';
}
