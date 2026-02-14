import type { DocCategory, DocEntry } from './doc-models';

import { avatarExamples } from '../examples/avatar/avatar.examples';
import { badgeExamples } from '../examples/badge/badge.examples';
import { breadcrumbExamples } from '../examples/breadcrumb/breadcrumb.examples';
import { buttonExamples } from '../examples/button/button.examples';
import { cardExamples } from '../examples/card/card.examples';
import { dividerExamples } from '../examples/divider/divider.examples';
import { emptyStateExamples } from '../examples/empty-state/empty-state.examples';
import { listExamples } from '../examples/list/list.examples';
import { menuExamples } from '../examples/menu/menu.examples';
import { menuPanelExamples } from '../examples/menu-panel/menu-panel.examples';
import { paginatorExamples } from '../examples/paginator/paginator.examples';
import { progressExamples } from '../examples/progress/progress.examples';
import { sidenavExamples } from '../examples/sidenav/sidenav.examples';
import { skeletonExamples } from '../examples/skeleton/skeleton.examples';
import { sortExamples } from '../examples/sort/sort.examples';
import { spinnerExamples } from '../examples/spinner/spinner.examples';
import { stepperExamples } from '../examples/stepper/stepper.examples';
import { tableExamples } from '../examples/table/table.examples';
import { tabsExamples } from '../examples/tabs/tabs.examples';
import { toolbarExamples } from '../examples/toolbar/toolbar.examples';

import { autocompleteExamples } from '../examples/autocomplete/autocomplete.examples';
import { autocompletePanelExamples } from '../examples/autocomplete-panel/autocomplete-panel.examples';
import { checkboxExamples } from '../examples/checkbox/checkbox.examples';
import { chipsExamples } from '../examples/chips/chips.examples';
import { formFieldExamples } from '../examples/form-field/form-field.examples';
import { inputExamples } from '../examples/input/input.examples';
import { radioExamples } from '../examples/radio/radio.examples';
import { selectExamples } from '../examples/select/select.examples';
import { selectPanelExamples } from '../examples/select-panel/select-panel.examples';
import { sliderExamples } from '../examples/slider/slider.examples';
import { switchExamples } from '../examples/switch/switch.examples';
import { textareaExamples } from '../examples/textarea/textarea.examples';

import { dialogExamples } from '../examples/dialog/dialog.examples';
import { bottomSheetExamples } from '../examples/bottom-sheet/bottom-sheet.examples';
import { snackbarExamples } from '../examples/snackbar/snackbar.examples';
import { tooltipExamples } from '../examples/tooltip/tooltip.examples';

import {
  foundationThemeExamples,
  foundationTokensExamples,
  foundationTypographyExamples,
  foundationIconsExamples,
} from '../examples/foundations';

export const DOC_CATEGORIES: ReadonlyArray<DocCategory> = [
  { id: 'components', title: 'Components' },
  { id: 'forms', title: 'Forms' },
  { id: 'overlays', title: 'Overlays' },
  { id: 'foundations', title: 'Foundations' },
];

export const DOC_ENTRIES: ReadonlyArray<DocEntry> = [
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'Identity chips for people, teams, and status in compact UI areas.',
    overview: [
      'Avatars help users quickly recognize people or entities in lists, headers, menus, and activity feeds. They are designed to work well even when space is limited.',
      'Use image avatars when you have reliable profile photos. When images are missing or loading, initials provide a consistent fallback that still communicates identity.',
      'Presence status is optional and should be used sparingly to avoid visual noise. Prefer it for real-time collaboration surfaces where online/away/offline context matters.',
    ],
    usage: [
      'Provide a full name so initials and accessibility labels are derived automatically.',
      'Use status for presence and reserve rounded shapes for compact lists or cards.',
      'Prefer real images for people; fall back to initials for system users or groups.',
    ],
    stylingGuide: [
      `/* GLOBAL - Apply to ALL avatars in your app (paste in global styles.scss) */
:root {
  --nsh-avatar-size: 48px;
  --nsh-avatar-radius: 50%;
  --nsh-avatar-bg: #e3f2fd;
  --nsh-avatar-fg: #1976d2;
  --nsh-avatar-font-size: 18px;
  --nsh-avatar-status-size: 12px;
  --nsh-avatar-status-color: #4caf50;
}`,
      `/* SCOPED - Apply to avatars in specific areas (paste in component.scss) */
.team-member-card {
  --nsh-avatar-size: 64px;
  --nsh-avatar-radius: 8px;
  --nsh-avatar-bg: #f3e5f5;
  --nsh-avatar-fg: #7b1fa2;
  --nsh-avatar-font-size: 28px;
}

.user-profile-header {
  --nsh-avatar-size: 120px;
  --nsh-avatar-radius: 12px;
  --nsh-avatar-bg: #fff3e0;
  --nsh-avatar-status-color: #ff9800;
}`,
      `/* HTML USAGE - Use your component with tokens from parent scope */
<div class="team-member-card">
  <nsh-avatar name="John Doe" status="online"></nsh-avatar>
  <!-- Automatically inherits token values from .team-member-card scope -->
</div>

<!-- Or create utility classes for quick styling -->
<style>
.avatar-small { --nsh-avatar-size: 32px; --nsh-avatar-font-size: 14px; }
.avatar-large { --nsh-avatar-size: 80px; --nsh-avatar-font-size: 36px; }
</style>
<nsh-avatar name="Jane Smith" class="avatar-large"></nsh-avatar>`,
    ],
    tokenDescriptions: {
      '--nsh-avatar-size': 'Avatar width and height in pixels (e.g., 32px, 40px, 48px, 64px)',
      '--nsh-avatar-radius': 'Border radius - 50% for circles, px values for rounded squares (e.g., 50%, 8px, 12px)',
      '--nsh-avatar-bg': 'Background for initials (e.g., #e3f2fd light blue, #f3e5f5 light purple, #c8e6c9 light green)',
      '--nsh-avatar-fg': 'Text color for initials (e.g., #1976d2 blue, #7b1fa2 purple, #388e3c green)',
      '--nsh-avatar-font-size': 'Initials text size in pixels (e.g., 14px small, 18px medium, 28px large)',
      '--nsh-avatar-status-size': 'Status indicator diameter (e.g., 10px, 12px, 14px for large avatars)',
      '--nsh-avatar-status-color': 'Status badge color: online=#4caf50 green, away=#ff9800 orange, offline=#999 gray)',
    },
    route: '/showcase/avatar',
    category: 'components',
    exampleProvider: () => avatarExamples,
  },
  {
    id: 'badge',
    title: 'Badge',
    description: 'Counts and status badges for UI elements.',
    overview: [
      'Badges provide compact, glanceable context such as unread counts, item totals, or status indicators. They work best when the meaning is obvious and the numbers are small.',
      'Use badges to complement a primary label or icon, not replace it. If the badge contains important information, ensure the host control still conveys the key meaning without color.',
      'Prefer consistent rules for when to show or hide badges (for example, hide when the count is zero) so users don\'t have to interpret changes in layout.',
    ],
    stylingGuide: [
      `/* GLOBAL - Apply to ALL badges (paste in global styles.scss) */
:root {
  --nsh-badge-bg: #2196f3;
  --nsh-badge-color: #ffffff;
  --nsh-badge-size: 24px;
  --nsh-badge-radius: 50%;
  --nsh-badge-font-size: 12px;
  --nsh-badge-font-weight: 700;
}`,
      `/* SCOPED - Different styles for error vs success (paste in component.scss) */
/* Error notifications */
.notifications nsh-badge {
  --nsh-badge-bg: #ff5252;
  --nsh-badge-color: #ffffff;
  --nsh-badge-size: 28px;
  --nsh-badge-font-size: 13px;
}

/* Success badges */
.success-indicator nsh-badge {
  --nsh-badge-bg: #4caf50;
  --nsh-badge-color: #ffffff;
  --nsh-badge-size: 24px;
}

/* Warning badges */
.warnings nsh-badge {
  --nsh-badge-bg: #ff9800;
  --nsh-badge-color: #ffffff;
  --nsh-badge-radius: 4px;
}`,
      `/* HTML USAGE - Add badge to your component */
<button class="notifications">
  <span>Messages</span>
  <nsh-badge [content]="5"></nsh-badge>
  <!-- Inherits red error style from .notifications scope -->
</button>

<div class="success-indicator">
  <nsh-badge [content]="'✓'"></nsh-badge>
  <!-- Shows green success badge -->
</div>

<!-- Or use inline for quick styling -->
<span [style]="'--nsh-badge-bg: #9c27b0; --nsh-badge-size: 32px;'">
  <nsh-badge [content]="12"></nsh-badge>
</span>`,
    ],
    tokenDescriptions: {
      '--nsh-badge-radius': 'Badge shape: 50% for circles (pill badge), 4px/8px for rounded corners, 0 for squares',
      '--nsh-badge-bg': 'Background color (error=#ff5252 red, success=#4caf50 green, warning=#ff9800 orange, info=#2196f3 blue, default=#999 gray)',
      '--nsh-badge-color': 'Text/number color (typically white #fff on colored badges, or inherit for neutral)',
      '--nsh-badge-size': 'Badge diameter in pixels: 16px (extra-small), 20px (small), 24px (medium), 32px (large)',
      '--nsh-badge-font-size': 'Number/text size (e.g., 10px tiny counts, 12px standard, 14px large badges)',
      '--nsh-badge-font-weight': 'Text weight: 400 normal, 500 medium, 700 bold (use 700 for emphasis)',
    },
    route: '/showcase/badge',
    category: 'components',
    exampleProvider: () => badgeExamples,
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'Navigation breadcrumbs with separators.',
    overview: [
      'Breadcrumbs show where the user is within a hierarchy and provide quick navigation to parent levels. They are most useful in deep information architectures (docs, settings, admin flows).',
      'Use concise labels and avoid overloading the breadcrumb with actions. The current page should be readable and typically not an actionable link.',
      'On narrow screens, consider truncation or collapsing middle segments to keep the current location visible.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default breadcrumb styling (paste in styles.scss) */
:root {
  --nsh-breadcrumb-color: #1976d2;
  --nsh-breadcrumb-current-color: #333;
  --nsh-breadcrumb-separator: '/';
  --nsh-breadcrumb-separator-color: #999;
  --nsh-breadcrumb-font-size: 14px;
  --nsh-breadcrumb-gap: 4px;
}`,
      `/* SCOPED - Customize for different pages (paste in component.scss) */
/* Light/subtle breadcrumbs */
.documentation-nav {
  --nsh-breadcrumb-color: #666;
  --nsh-breadcrumb-separator: '›';
  --nsh-breadcrumb-separator-color: #ccc;
  --nsh-breadcrumb-gap: 8px;
}

/* Admin/dark breadcrumbs */
.admin-panel {
  --nsh-breadcrumb-color: #2196f3;
  --nsh-breadcrumb-current-color: #000;
  --nsh-breadcrumb-separator: '>';
  --nsh-breadcrumb-font-size: 13px;
}`,
      `/* HTML USAGE - Add breadcrumbs to your pages */
<!-- Simple breadcrumb navigation -->
<nav class="documentation-nav">
  <a nsh-breadcrumb href="/docs">Documentation</a>
  <a nsh-breadcrumb href="/docs/guides">Guides</a>
  <span nsh-breadcrumb>Getting Started</span>
  <!-- Last item is plain text (not a link) -->
</nav>

<!-- In admin interfaces -->
<nav class="admin-panel">
  <a nsh-breadcrumb href="/admin">Admin</a>
  <a nsh-breadcrumb href="/admin/users">Users</a>
  <a nsh-breadcrumb href="/admin/users/list">List</a>
  <span nsh-breadcrumb>Edit User</span>
</nav>`,
    ],
    tokenDescriptions: {
      '--nsh-breadcrumb-separator': 'Visual divider: "/" slash, ">" angle, "–" dash, "\\" backslash, "◀" arrow',
      '--nsh-breadcrumb-separator-color': 'Color: #999 medium gray, #ccc light gray, #666 dark gray',
      '--nsh-breadcrumb-color': 'Link text: #1976d2 blue (clickable), #666 gray (neutral)',
      '--nsh-breadcrumb-current-color': 'Current page: #333 dark, #666 gray, #999 muted (not clickable)',
      '--nsh-breadcrumb-font-size': 'Text size: 12px (compact), 13px (small), 14px (standard), 15px (large)',
      '--nsh-breadcrumb-gap': 'Separation: 2px (tight), 4px (standard), 8px (spacious), 12px (loose)',
    },
    route: '/showcase/breadcrumb',
    category: 'components',
    exampleProvider: () => breadcrumbExamples,
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Primary and secondary actions.',
    overview: [
      'Buttons trigger actions. Use them for the most important operations on a page or within a component surface (dialogs, toolbars, forms).',
      'Choose a clear hierarchy: a single primary action, secondary actions for alternatives, and text/quiet buttons for low-emphasis actions. Too many high-emphasis buttons reduces clarity.',
      'Keep labels verb-based ("Save", "Create", "Add member") and ensure disabled/loading states communicate why an action isn\'t available.',
    ],
    stylingGuide: [
      `/* GLOBAL - Button defaults (paste in styles.scss) */
:root {
  --nsh-button-height: 44px;
  --nsh-button-padding-inline: 24px;
  --nsh-button-padding-block: 10px;
  --nsh-button-font-size: 14px;
  --nsh-button-font-weight: 600;
  --nsh-button-radius: 3px;
  --nsh-button-gap: 8px;
}`,
      `/* SCOPED - Different button sizes and styles (paste in component.scss) */
/* Primary action buttons */
.action-bar nsh-button {
  --nsh-button-height: 44px;
  --nsh-button-padding-inline: 24px;
  --nsh-button-font-size: 14px;
  --nsh-button-radius: 4px;
}

/* Hero/large buttons */
.hero-section nsh-button {
  --nsh-button-height: 56px;
  --nsh-button-padding-inline: 32px;
  --nsh-button-font-size: 16px;
  --nsh-button-padding-block: 16px;
  --nsh-button-radius: 8px;
  --nsh-button-font-weight: 700;
}

/* Small/compact buttons */
.toolbar nsh-button {
  --nsh-button-height: 32px;
  --nsh-button-padding-inline: 12px;
  --nsh-button-font-size: 12px;
  --nsh-button-radius: 2px;
}`,
      `/* HTML USAGE - Apply buttons in your components */
<div class="action-bar">
  <button nsh-button type="submit">Save Changes</button>
  <button nsh-button type="button" variant="outline">Cancel</button>
</div>

<section class="hero-section">
  <button nsh-button>
    <mat-icon>add</mat-icon>
    Create New Item
  </button>
</section>

<div class="toolbar">
  <button nsh-button><mat-icon>delete</mat-icon></button>
  <button nsh-button><mat-icon>edit</mat-icon></button>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-button-radius': 'Corner roundness: 0 sharp, 4px subtle rounded, 8px rounded (pill)',
      '--nsh-button-gap': 'Space between icon and text (8px tight, 12px comfortable, 16px spacious)',
      '--nsh-button-padding-inline': 'Left/right padding: 16px (compact), 24px (standard), 32px (spacious)',
      '--nsh-button-padding-block': 'Top/bottom padding: 8px (compact), 10px (standard), 12px (spacious)',
      '--nsh-button-font-size': 'Text size: 12px small, 14px standard, 16px large, 18px extra-large',
      '--nsh-button-font-weight': 'Text weight: 400 normal, 500 medium, 600 semi-bold, 700 bold (use 600+ for primary)',
      '--nsh-button-height': 'Total height: 32px (xs), 40px (sm), 44px (md), 48px (lg), 56px (xl)',
    },
    route: '/showcase/button',
    category: 'components',
    exampleProvider: () => buttonExamples,
  },
  {
    id: 'card',
    title: 'Card',
    description: 'Surface container for grouped content.',
    overview: [
      'Cards group related information and actions into a single, scannable block. They are useful for dashboards, catalog-like layouts, and mixed-content lists.',
      'Use cards when grouping improves comprehension; avoid using cards for everything, since excessive borders and padding can add visual noise.',
      'A good card has a clear title, predictable spacing, and only the actions that belong to the card\'s content.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default card styling (paste in styles.scss) */
:root {
  --nsh-card-padding: 16px;
  --nsh-card-padding-block: 16px;
  --nsh-card-padding-inline: 16px;
  --nsh-card-radius: 8px;
  --nsh-card-bg: #ffffff;
  --nsh-card-border: none;
  --nsh-card-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
      `/* FLAT design cards (modern, minimal borders) */
.dashboard nsh-card {
  --nsh-card-padding: 16px;
  --nsh-card-radius: 8px;
  --nsh-card-border: 1px solid #efefef;
  --nsh-card-shadow: none;
  --nsh-card-bg: #f9f9f9;
}

/* ELEVATED design cards (Material with shadows) */
.feature-highlights nsh-card {
  --nsh-card-padding: 20px;
  --nsh-card-radius: 4px;
  --nsh-card-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1);
  --nsh-card-bg: #ffffff;
}

/* INTERACTIVE cards with hover effects */
.product-grid nsh-card {
  --nsh-card-padding: 18px;
  --nsh-card-radius: 12px;
  --nsh-card-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}
.product-grid nsh-card:hover {
  --nsh-card-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}`,
      `/* HTML USAGE - Apply cards with different designs */
<!-- Flat/modern design (dashboard) -->
<section class="dashboard">
  <nsh-card>
    <h3>Analytics</h3>
    <p>Clean, minimal appearance</p>
  </nsh-card>
</section>

<!-- Elevated design (prominent cards) -->
<section class="feature-highlights">
  <nsh-card>
    <h3>Premium Features</h3>
    <p>Important content with depth</p>
  </nsh-card>
</section>

<!-- Interactive product cards -->
<section class="product-grid">
  <nsh-card *ngFor="let product of products" (click)="viewProduct(product)">
    <img [src]="product.image" alt="">
    <h4>{{product.name}}</h4>
    <p>\${{product.price}}</p>
  </nsh-card>
</section>`,
    ],
    tokenDescriptions: {
      '--nsh-card-bg': 'Background: #fff white, #fafafa off-white, #f5f5f5 light gray, #f0f0f0 medium gray',
      '--nsh-card-border': 'Border definition: 1px solid #e0e0e0 light, 1px solid #ddd medium, 2px solid #ccc dark',
      '--nsh-card-border-color': 'Just the color part if using separate border: #ddd light, #ccc medium, #bbb dark',
      '--nsh-card-radius': 'Corner style: 0 sharp, 4px subtle, 8px rounded, 16px pill-shaped',
      '--nsh-card-shadow': 'Elevation: none flat, 0 2px 4px rgba(0,0,0,0.1) subtle, 0 4px 12px rgba(0,0,0,0.15) prominent',
      '--nsh-card-padding': 'Internal spacing: 12px compact, 16px standard, 20px comfortable, 24px spacious, 32px generous',
    },
    route: '/showcase/card',
    category: 'components',
    exampleProvider: () => cardExamples,
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Lightweight separation between sections.',
    overview: [
      'Dividers separate groups of content when spacing alone is not enough to communicate structure. They are most effective in dense layouts such as menus, lists, and settings pages.',
      'Prefer whitespace first; add a divider only when it prevents misreading or helps scanning.',
      'Use dividers consistently: align them to the same insets as the content they separate.',
    ],
    stylingGuide: [
      'FULL-width: <nsh-divider style="--nsh-divider-color: #e0e0e0; --nsh-divider-thickness: 1px; --nsh-divider-inset: 0px;"></nsh-divider>',
      'INSET from edges: <div class="menu-section"><nsh-divider style="--nsh-divider-color: #ddd; --nsh-divider-inset: 16px; --nsh-divider-thickness: 1px;"></nsh-divider></div>',
      'HTML: Just use <nsh-divider></nsh-divider> and override tokens in parent style or inline - automatically spans width minus inset',
    ],
    tokenDescriptions: {
      '--nsh-divider-color': 'Line color: #ddd light, #e0e0e0 medium, #ccc darker, rgba(0,0,0,0.12) subtle alpha',
      '--nsh-divider-thickness': 'Default height: 0.5px hairline, 1px (standard), 2px (bold), 3px (prominent)',
      '--nsh-divider-thickness-hairline': 'Extra thin: 0.5px (very subtle), 0.75px (barely visible)',
      '--nsh-divider-thickness-md': 'Medium: 1px (standard), 1.5px (slightly bold), 2px (bold)',
      '--nsh-divider-thickness-sm': 'Compact variant: 0.75px, 1px (standard for dense layouts)',
      '--nsh-divider-inset': 'Left/right margin: 0px (full width), 8px (slight), 16px (standard menu), 24px (large), 32px (very inset)',
    },
    route: '/showcase/divider',
    category: 'components',
    exampleProvider: () => dividerExamples,
  },
  {
    id: 'empty-state',
    title: 'Empty state',
    description: 'Guidance when no content is available.',
    overview: [
      'Empty states explain what happened and what to do next when a view has no data. They reduce confusion and help users recover quickly.',
      'Use a short, actionable message and (optionally) a single next-step action such as "Create item" or "Adjust filters". Avoid blaming language.',
      'Empty states are different from errors: if something failed, prefer an error message with retry/support guidance instead of a generic empty state.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default empty state styling (paste in styles.scss) */
:root {
  --nsh-empty-state-padding: 40px;
  --nsh-empty-state-icon-size: 64px;
  --nsh-empty-state-icon-color: #bbb;
  --nsh-empty-state-font-size: 16px;
  --nsh-empty-state-color: #666;
  --nsh-empty-state-gap: 16px;
}`,
      `/* SCOPED - Different empty states (paste in component.scss) */
/* Search results empty state */
.search-results nsh-empty-state {
  --nsh-empty-state-padding: 48px 20px;
  --nsh-empty-state-icon-size: 72px;
  --nsh-empty-state-font-size: 18px;
}

/* Inbox empty state */
.inbox-empty nsh-empty-state {
  --nsh-empty-state-padding: 60px;
  --nsh-empty-state-icon-size: 80px;
  --nsh-empty-state-icon-color: #ddd;
}

/* Error/failed empty state */
.error-state nsh-empty-state {
  --nsh-empty-state-color: #d32f2f;
  --nsh-empty-state-icon-color: #ef5350;
  --nsh-empty-state-padding: 32px;
}`,
      `/* HTML USAGE - Add empty states to your pages */
<!-- Search results empty state -->
<div class="search-results">
  <nsh-empty-state 
    icon="search" 
    title="No results found"
    message="Try different keywords or adjust filters">
  </nsh-empty-state>
</div>

<!-- Inbox empty state -->
<div class="inbox-empty">
  <nsh-empty-state 
    icon="mail"
    title="Your inbox is empty"
    message="You're all caught up!">
  </nsh-empty-state>
</div>

<!-- Error state -->
<div class="error-state">
  <nsh-empty-state 
    icon="error"
    title="Something went wrong"
    message="Please try again or contact support">
  </nsh-empty-state>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-empty-state-color': 'Message text: #666 dark gray, #999 medium, #aaa light (gray tone preferred)',
      '--nsh-empty-state-icon-size': 'Icon size: 48px (compact), 56px, 64px (standard), 80px (large), 96px (xl)',
      '--nsh-empty-state-icon-color': 'Icon tint: #ddd light, #bbb medium, #999 dark (muted colors)',
      '--nsh-empty-state-font-size': 'Message text: 14px (compact), 16px (standard), 18px (large)',
      '--nsh-empty-state-gap': 'Icon to text space: 12px (tight), 16px (standard), 20px (spacious), 24px (loose)',
      '--nsh-empty-state-padding': 'Container space: 24px (compact), 32px (standard), 40px (spacious), 48px (generous)',
    },
    route: '/showcase/empty-state',
    category: 'components',
    exampleProvider: () => emptyStateExamples,
  },
  {
    id: 'list',
    title: 'List',
    description: 'Dense and navigation-ready lists.',
    overview: [
      'Lists present a set of items in a predictable vertical rhythm. They work well for navigation, search results, and entity management screens.',
      'Use consistent leading/trailing content so users can scan quickly (icons/avatars on the left, metadata/actions on the right).',
      'If items are interactive, ensure the tap/click target is large enough and avoid mixing multiple competing click areas without clear affordances.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default list styling (paste in styles.scss) */
:root {
  --nsh-list-item-height: 48px;
  --nsh-list-item-padding: 12px 16px;
  --nsh-list-item-gap: 12px;
  --nsh-list-item-border: 1px solid #eee;
  --nsh-list-font-size: 14px;
  --nsh-list-item-hover-bg: transparent;
}`,
      `/* SCOPED - Compact vs spacious lists (paste in component.scss) */
/* Compact user list */
.user-list nsh-list {
  --nsh-list-item-height: 40px;
  --nsh-list-item-padding: 8px 12px;
  --nsh-list-item-gap: 12px;
  --nsh-list-item-border: 1px solid #eee;
  --nsh-list-font-size: 13px;
}

/* Spacious profile/card list */
.profile-list nsh-list {
  --nsh-list-item-height: 64px;
  --nsh-list-item-padding: 12px 20px;
  --nsh-list-item-gap: 16px;
  --nsh-list-font-size: 15px;
  --nsh-list-item-hover-bg: #f5f5f5;
  --nsh-list-item-border: none;
}

/* Navigation list (seamless) */
.navigation-list nsh-list {
  --nsh-list-item-height: 48px;
  --nsh-list-item-padding: 0 16px;
  --nsh-list-item-border: none;
  --nsh-list-item-hover-bg: #f0f0f0;
}`,
      `/* HTML USAGE - Implement lists in your components */
<!-- Compact user list -->
<nsh-list class="user-list">
  <nsh-list-item *ngFor="let user of users">
    <img [src]="user.avatar" class="user-avatar">
    <div>
      <div class="user-name">{{user.name}}</div>
      <div class="user-status">{{user.status}}</div>
    </div>
  </nsh-list-item>
</nsh-list>

<!-- Spacious profile list -->
<nsh-list class="profile-list">
  <nsh-list-item *ngFor="let profile of profiles" (click)="selectProfile(profile)">
    <img [src]="profile.photo">
    <div>{{profile.name}}</div>
  </nsh-list-item>
</nsh-list>

<!-- Navigation list -->
<nav>
  <nsh-list class="navigation-list">
    <nsh-list-item *ngFor="let nav of navItems" [routerLink]="nav.path">
      <mat-icon>{{nav.icon}}</mat-icon>
      <span>{{nav.label}}</span>
    </nsh-list-item>
  </nsh-list>
</nav>`,
    ],
    tokenDescriptions: {
      '--nsh-list-item-height': 'Row height: 40px (compact), 48px (standard), 56px (comfortable), 64px (spacious), 72px (extra)',
      '--nsh-list-item-padding': 'Left/right space: 8px (compact), 12px (standard), 16px (spacious), 20px (generous)',
      '--nsh-list-item-gap': 'Icon to text space: 8px (tight), 12px (standard), 16px (spacious), 20px (loose)',
      '--nsh-list-item-border': 'Dividers: none (seamless), 1px solid #eee (light), 1px solid #ddd (visible)',
      '--nsh-list-item-hover-bg': 'On hover: transparent (no change), #f5f5f5 light, #f0f0f0 medium, #eeeeee dark',
      '--nsh-list-font-size': 'Primary text: 12px (small), 13px (compact), 14px (standard), 15px (readable), 16px (large)',
    },
    route: '/showcase/list',
    category: 'components',
    exampleProvider: () => listExamples,
  },
  {
    id: 'menu',
    title: 'Menu',
    description: 'Contextual overlay menus.',
    overview: [
      'Menus provide a compact set of related actions. They are best for secondary actions that don\'t need to be visible all the time.',
      'Group actions logically and keep labels short. If you have more than a handful of items, consider a dedicated page or a searchable command surface.',
      'Menus should be keyboard accessible (arrow navigation, escape to close) and should close after an action is selected.',
    ],
    stylingGuide: [
      'CONTEXT menu: .context-menu nsh-menu { --nsh-menu-item-height: 40px; --nsh-menu-item-padding: 12px 16px; --nsh-menu-bg: #fff; --nsh-menu-item-hover-bg: #f5f5f5; --nsh-menu-shadow: 0 2px 8px rgba(0,0,0,0.15); --nsh-menu-item-focus-bg: #eeeeee; }',
      'DROPDOWN menu: .dropdown nsh-menu { --nsh-menu-item-height: 48px; --nsh-menu-item-padding: 16px 20px; --nsh-menu-item-hover-bg: #f0f0f0; --nsh-menu-shadow: 0 4px 16px rgba(0,0,0,0.2); }',
      'HTML: <nsh-menu [trigger]="button" [items]="actions"></nsh-menu> or using <button (click)="openMenu()">Options</button>',
    ],
    tokenDescriptions: {
      '--nsh-menu-item-height': 'Item height: 32px (compact), 40px (standard), 48px (large), 56px (extra-large)',
      '--nsh-menu-item-padding': 'Horizontal space: 10px (tight), 12px (standard), 16px (spacious), 20px (generous)',
      '--nsh-menu-bg': 'Panel color: #fff white, #fafafa off-white, #f5f5f5 with subtle tint',
      '--nsh-menu-shadow': 'Elevation: 0 2px 4px light, 0 2px 8px standard, 0 4px 16px prominent',
      '--nsh-menu-item-hover-bg': 'Hover state: #f5f5f5 light, #f0f0f0 medium, rgba(0,0,0,0.05) subtle',
      '--nsh-menu-item-focus-bg': 'Keyboard focus: #eeeeee light, #ddd medium (different from hover)',
    },
    route: '/showcase/menu',
    category: 'components',
    exampleProvider: () => menuExamples,
  },
  {
    id: 'paginator',
    title: 'Paginator',
    description: 'Pagination controls for lists and tables.',
    overview: [
      'Pagination breaks large datasets into manageable pages and helps avoid long scroll performance issues. It\'s common in admin tables and log/event views.',
      'Choose a page size that balances scanability and performance. If users frequently need to find specific items, consider adding search or filters rather than increasing page size.',
      'Always communicate total results (or an estimate) when possible so users understand how much content exists.',
    ],
    stylingGuide: [
      'LIGHT theme: .results nsh-paginator { --nsh-paginator-height: 56px; --nsh-paginator-bg: #fff; --nsh-paginator-text-color: #666; --nsh-paginator-border: 1px solid #eee; --nsh-paginator-button-size: 32px; --nsh-paginator-gap: 16px; }',
      'DARK theme: .dark-paginator nsh-paginator { --nsh-paginator-bg: #424242; --nsh-paginator-text-color: #fff; --nsh-paginator-border: none; --nsh-paginator-button-size: 40px; --nsh-paginator-gap: 12px; }',
      'HTML: <nsh-paginator [length]="totalItems\" [pageSize]=\"itemsPerPage\" [pageSizeOptions]=\"[10,20,50]\" (page)=\"onPageChange($event)\"></nsh-paginator>',
    ],
    tokenDescriptions: {
      '--nsh-paginator-height': 'Control bar height: 40px (compact), 48px, 56px (standard), 64px (large), 72px (spacious)',
      '--nsh-paginator-button-size': 'Navigation button size: 24px (small), 28px, 32px (standard), 36px, 40px (large)',
      '--nsh-paginator-bg': 'Background: #fff white, #fafafa off-white, #f5f5f5 light gray, #424242 dark gray',
      '--nsh-paginator-text-color': 'Text: #333 dark, #666 medium, #999 light, #fff white for dark background',
      '--nsh-paginator-border': 'Top divider: none (no border), 1px solid #eee light, 1px solid #ddd medium',
      '--nsh-paginator-gap': 'Element spacing: 8px (tight), 12px (standard), 16px (spacious), 20px (loose)',
    },
    route: '/showcase/paginator',
    category: 'components',
    exampleProvider: () => paginatorExamples,
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Linear progress indicators.',
    overview: [
      'Progress indicators communicate that work is happening and that the UI is responsive. Use determinate progress when you can estimate completion, otherwise use indeterminate.',
      'Place progress near the area that is changing (a card, a table, or a page header) to reduce uncertainty.',
      'If an operation is quick, consider a subtle delay before showing progress to avoid flicker.',
    ],
    stylingGuide: [
      'FILE upload: .upload-progress nsh-progress { --nsh-progress-height: 6px; --nsh-progress-color: #2196f3; --nsh-progress-bg: #e3f2fd; --nsh-progress-radius: 3px; [value]="uploadPercent%; }',
      'DOWNLOAD indeterminate: .download nsh-progress { --nsh-progress-height: 4px; --nsh-progress-color: #4caf50; --nsh-progress-animation-duration: 2s; }',
      'HTML determinate: <nsh-progress [value]="percentComplete\"></nsh-progress> | HTML indeterminate: <nsh-progress></nsh-progress> (no value attribute)',
    ],
    tokenDescriptions: {
      '--nsh-progress-height': 'Bar thickness: 2px (subtle), 3px (thin), 4px (standard), 6px (bold), 8px (prominent)',
      '--nsh-progress-bg': 'Empty track: #f0f0f0 light, #e0e0e0 medium, #d0d0d0 dark, rgba(0,0,0,0.12) with alpha',
      '--nsh-progress-color': 'Filled color: #2196f3 blue, #4caf50 green success, #ff9800 orange warning, #f44336 red error',
      '--nsh-progress-radius': 'Corners: 0 sharp, 1px, 2px (subtle), 50% fully rounded; typically matches bar height / 2',
      '--nsh-progress-animation-duration': 'Speed (indeterminate): 1.5s fast, 2s standard, 3s slow for breathing effect',
      '--nsh-progress-animation': 'Indeterminate animation keyframes (uses stripes or fade pattern)',
    },
    route: '/showcase/progress',
    category: 'components',
    exampleProvider: () => progressExamples,
  },
  {
    id: 'sidenav',
    title: 'Sidenav',
    description: 'Layouts with side navigation.',
    overview: [
      'Side navigation is used for top-level sections of an application. It provides persistent access to primary routes and supports larger information architectures.',
      'Use clear grouping and consistent ordering. Highlight the active section and avoid nesting too deeply.',
      'On smaller screens, switch to an overlay or collapsible mode so content remains the focus.',
    ],
    stylingGuide: [
      'LIGHT theme: .app-nav nsh-sidenav { --nsh-sidenav-bg: #fff; --nsh-sidenav-width: 256px; --nsh-sidenav-item-height: 48px; --nsh-sidenav-item-padding: 12px 16px; --nsh-sidenav-item-active-bg: #e3f2fd; --nsh-sidenav-item-active-color: #1976d2; }',
      'DARK theme: .dark-app nsh-sidenav { --nsh-sidenav-bg: #263238; --nsh-sidenav-width: 240px; --nsh-sidenav-item-active-bg: #37474f; --nsh-sidenav-item-active-color: #4dd0e1; --nsh-sidenav-item-padding: 12px 20px; }',
      'HTML: <nsh-sidenav [items]="navItems\" [collapsed]="isCollapsed\"></nsh-sidenav> with content beside it',
    ],
    tokenDescriptions: {
      '--nsh-sidenav-width': 'Sidebar width: 200px (narrow), 240px (compact), 256px (standard), 280px (spacious), 320px (wide)',
      '--nsh-sidenav-bg': 'Background: #fff white, #fafafa off-white, #f5f5f5 light, #263238 dark gray, #1a1a1a very dark',
      '--nsh-sidenav-item-height': 'Item height: 44px (compact), 48px (standard), 52px (comfortable), 56px (spacious)',
      '--nsh-sidenav-item-padding': 'Item padding: 8px 12px (compact), 12px 16px (standard), 12px 20px (spacious), 16px 20px (generous)',
      '--nsh-sidenav-item-active-bg': 'Active highlight: #e3f2fd blue, #f3e5f5 purple, #e8f5e9 green, #37474f dark gray',
      '--nsh-sidenav-item-active-color': 'Active text: #1976d2 blue, #7b1fa2 purple, #388e3c green, #4dd0e1 cyan for dark',
    },
    route: '/showcase/sidenav',
    category: 'components',
    exampleProvider: () => sidenavExamples,
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    description: 'Loading placeholders and shimmer.',
    overview: [
      'Skeletons keep layout stable while content loads, which reduces perceived wait time and prevents layout shifts.',
      'Use skeletons when you know the shape of the incoming content (cards, rows, list items). For unknown shapes, a spinner or progress bar may be clearer.',
      'Match skeleton size and spacing closely to the final content so the transition feels natural.',
    ],
    stylingGuide: [
      'STANDARD loader: .content nsh-skeleton { --nsh-skeleton-bg: #eeeeee; --nsh-skeleton-radius: 4px; --nsh-skeleton-animation-duration: 1.5s; --nsh-skeleton-shimmer-color: rgba(255,255,255,0.3); }',
      'FAST loader: .fast-loader nsh-skeleton { --nsh-skeleton-bg: #f5f5f5; --nsh-skeleton-animation-duration: 0.8s; --nsh-skeleton-shimmer-color: rgba(255,255,255,0.5); }',
      'HTML: <nsh-skeleton variant="circle" size="40px\"></nsh-skeleton> for avatars or <nsh-skeleton count="3\"></nsh-skeleton> for list items',
    ],
    tokenDescriptions: {
      '--nsh-skeleton-bg': 'Base placeholder: #eeeeee light, #e0e0e0 medium, #d0d0d0 dark, #f0f0f0 subtle',
      '--nsh-skeleton-radius': 'Corners: 0 sharp, 2px subtle, 4px rounded, 8px more, 50% circles',
      '--nsh-skeleton-animation': 'Effect type: pulse (fade), shimmer (sweep), wave (directional)',
      '--nsh-skeleton-animation-duration': 'Speed: 0.8s fast, 1s quick, 1.5s standard, 2s slow, 3s very slow',
      '--nsh-skeleton-shimmer-color': 'Highlight: rgba(255,255,255,0.2) subtle, 0.3 standard, 0.5 prominent white shine',
    },
    route: '/showcase/skeleton',
    category: 'components',
    exampleProvider: () => skeletonExamples,
  },
  {
    id: 'sort',
    title: 'Sort',
    description: 'Sorting interactions for tables.',
    overview: [
      'Sorting lets users reorder data by a single key (name, date, status). It\'s most effective when combined with filtering and search for large datasets.',
      'Use clear sort indicators and predictable behavior (ascending/descending). Keep sort state visible so users understand why the order changed.',
      'Avoid sorting on columns where the ordering is ambiguous or changes rapidly (for example, live-updating values) without explanation.',
    ],
    stylingGuide: [
      'Customize sort indicator styling. Example: .table-header nsh-sort { --nsh-sort-icon-size: 16px; --nsh-sort-icon-color: #999; --nsh-sort-icon-active-color: #1976d2; }',
    ],
    tokenDescriptions: {
      '--nsh-sort-icon-size': 'Sort indicator icon size (e.g., 16px, 18px, 20px)',
      '--nsh-sort-icon-color': 'Inactive sort icon color (e.g., #999, #aaa)',
      '--nsh-sort-icon-active-color': 'Active sort icon color (e.g., #1976d2, #2196f3)',
      '--nsh-sort-transition': 'Animation for sort direction change (e.g., 0.2s ease)',
    },
    route: '/showcase/sort',
    category: 'components',
    exampleProvider: () => sortExamples,
  },
  {
    id: 'spinner',
    title: 'Spinner',
    description: 'Indeterminate progress indicator.',
    overview: [
      'Spinners indicate ongoing work when completion time is unknown. They are best for short operations or compact surfaces like buttons and inline loads.',
      'Use spinners sparingly on full pages; a progress bar or skeleton layout often provides more context.',
      'If the operation might take longer, include supporting text so users know what is happening.',
    ],
    stylingGuide: [
      'BUTTON loader: button nsh-spinner { --nsh-spinner-size: 18px; --nsh-spinner-color: currentColor; --nsh-spinner-stroke-width: 2px; --nsh-spinner-animation-duration: 1s; }',
      'PAGE spinner: .loading-overlay nsh-spinner { --nsh-spinner-size: 48px; --nsh-spinner-color: #2196f3; --nsh-spinner-stroke-width: 4px; --nsh-spinner-track-color: rgba(0,0,0,0.1); }',
      'HTML: <button [disabled]=\"isLoading\"><nsh-spinner *ngIf=\"isLoading\" [size]=\"16\"></nsh-spinner> Save</button>',
    ],
    tokenDescriptions: {
      '--nsh-spinner-size': 'Diameter: 16px (tiny button), 18px (small button), 24px (standard), 32px (large), 48px (page), 64px (full-page)',
      '--nsh-spinner-color': 'Ring color: #1976d2 blue, #2196f3 lighter, currentColor inherit from parent, #fff white for dark background',
      '--nsh-spinner-stroke-width': 'Line thickness: 1.5px (subtle), 2px (standard for small), 3px (medium), 4px (large/bold)',
      '--nsh-spinner-animation-duration': 'Speed: 0.8s fast, 1s standard, 1.2s slow, 2s very slow for breathing effect',
      '--nsh-spinner-track-color': 'Background ring: #e0e0e0 visible gray, rgba(0,0,0,0.05) subtle, rgba(0,0,0,0.1) prominent',
    },
    route: '/showcase/spinner',
    category: 'components',
    exampleProvider: () => spinnerExamples,
  },
  {
    id: 'stepper',
    title: 'Stepper',
    description: 'Multi-step flows with status.',
    overview: [
      'Steppers guide users through multi-step tasks such as onboarding, checkout, or configuration. They make progress and remaining work visible.',
      'Keep each step focused and avoid requiring users to jump back and forth frequently. Validate inputs close to where they are entered.',
      'Use clear step labels and communicate completion/error state so users can recover quickly.',
    ],
    stylingGuide: [
      'CHECKOUT flow: .checkout nsh-stepper { --nsh-stepper-index-size: 40px; --nsh-stepper-active-color: #1976d2; --nsh-stepper-completed-bg: #4caf50; --nsh-stepper-index-bg: #e0e0e0; --nsh-stepper-connector-color: #e0e0e0; }',
      'ONBOARDING flow: .setup nsh-stepper { --nsh-stepper-index-size: 32px; --nsh-stepper-active-color: #ff9800; --nsh-stepper-completed-bg: #4caf50; }',
      'HTML: <nsh-stepper [steps]="[...\]\" [(activeStep)]=\"current\"><nsh-step>Step 1 content</nsh-step></nsh-stepper>',
    ],
    tokenDescriptions: {
      '--nsh-stepper-index-size': 'Step circle: 28px (compact), 32px (standard), 40px (large), 48px (extra-large)',
      '--nsh-stepper-index-bg': 'Incomplete step: #e0e0e0 standard, #f0f0f0 light, #d0d0d0 dark gray',
      '--nsh-stepper-index-color': 'Incomplete text: #666 dark, #999 medium, #bbb light gray',
      '--nsh-stepper-completed-bg': 'Done step: #4caf50 green, #2196f3 blue, #ff9800 orange',
      '--nsh-stepper-active-color': 'Current step: #1976d2 blue, #ff9800 orange, #f57c00 deep orange',
      '--nsh-stepper-connector-color': 'Connecting line: #e0e0e0 light, #ddd medium, #ccc dark; completed steps use active-color',
    },
    route: '/showcase/stepper',
    category: 'components',
    exampleProvider: () => stepperExamples,
  },
  {
    id: 'table',
    title: 'Table',
    description: 'Data tables with sorting and pagination.',
    overview: [
      'Tables present structured data for scanning and comparison. They are best when users need to compare many rows across consistent columns.',
      'Choose columns carefully; too many columns reduces readability. Consider responsive patterns like column prioritization or row expansion on small screens.',
      'Combine tables with sorting, filtering, and pagination to help users find what they need efficiently.',
    ],
    stylingGuide: [
      'LIGHT theme: .data-grid nsh-table { --nsh-table-header-bg: #f5f5f5; --nsh-table-header-border: 1px solid #eee; --nsh-table-row-height: 48px; --nsh-table-cell-padding: 16px; --nsh-table-row-border: 1px solid #f0f0f0; --nsh-table-hover-bg: #f9f9f9; }',
      'DENSE table: .dashboard nsh-table { --nsh-table-row-height: 40px; --nsh-table-cell-padding: 12px; --nsh-table-hover-bg: #f5f5f5; }',
      'HTML: <nsh-table [columns]=\"cols] [data]=\"rows\" [stripe]=\"true\"></nsh-table> with sortable headers and pagination',
    ],
    tokenDescriptions: {
      '--nsh-table-header-bg': 'Column header: #f5f5f5 light, #f0f0f0 medium, #e3f2fd blue tint, #424242 dark mode',
      '--nsh-table-header-border': 'Header divider: 1px solid #eee light, 1px solid #ddd medium, none seamless',
      '--nsh-table-row-height': 'Row height: 40px (compact), 44px, 48px (standard), 52px, 56px (spacious)',
      '--nsh-table-cell-padding': 'Cell space: 10px (compact), 12px (standard), 16px (spacious), 20px (generous)',
      '--nsh-table-row-border': 'Row dividers: none (seamless), 1px solid #f0f0f0 (subtle), 1px solid #eee (visible)',
      '--nsh-table-hover-bg': 'On row hover: transparent, #f9f9f9 light, #f5f5f5 medium, rgba(0,0,0,0.03) subtle alpha',
    },
    route: '/showcase/table',
    category: 'components',
    exampleProvider: () => tableExamples,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'Tabbed navigation and content panes.',
    overview: [
      'Tabs switch between related views at the same hierarchy level (for example, "Overview / API / Styling"). They keep content in one place without navigation changes.',
      'Use tabs for a small number of sections. If you have many sections or deep nesting, a side navigation or separate routes may be clearer.',
      'Keep tab labels short and consistent. Avoid placing critical actions inside tab headers.',
    ],
    stylingGuide: [
      'DOCUMENTATION tabs: .docs nsh-tabs { --nsh-tab-height: 48px; --nsh-tab-padding: 16px 20px; --nsh-tab-active-color: #1976d2; --nsh-tab-inactive-color: #666; --nsh-tab-active-border: 2px solid #1976d2; --nsh-tab-border: 1px solid #eee; }',
      'SETTINGS tabs: .settings nsh-tabs { --nsh-tab-height: 56px; --nsh-tab-padding: 16px 24px; --nsh-tab-active-color: #2196f3; --nsh-tab-inactive-color: #999; }',
      'HTML: <nsh-tabs [tabs]="tabs" [activeTab]="selected"><nsh-tab>Tab 1 content</nsh-tab><nsh-tab>Tab 2 content</nsh-tab></nsh-tabs>',
    ],
    tokenDescriptions: {
      '--nsh-tab-height': 'Tab bar height: 40px (compact), 48px (standard), 56px (large), 64px (spacious)',
      '--nsh-tab-padding': 'Per-tab horizontal space: 12px (compact), 16px (standard), 20px (spacious), 24px (generous)',
      '--nsh-tab-border': 'Dividers: none (seamless), 1px solid #eee (light), 1px solid #ddd (visible)',
      '--nsh-tab-active-color': 'Active text: #1976d2 blue, #2196f3 lighter, #f57c00 orange, #4caf50 green',
      '--nsh-tab-active-border': 'Indicator style: 2px solid #1976d2 (bottom border), or background color or underline',
      '--nsh-tab-inactive-color': 'Inactive text: #666 dark, #999 medium, #bbb light gray',
    },
    route: '/showcase/tabs',
    category: 'components',
    exampleProvider: () => tabsExamples,
  },
  {
    id: 'toolbar',
    title: 'Toolbar',
    description: 'Top app bars with slots.',
    overview: [
      'Toolbars provide a consistent place for page-level navigation, titles, and key actions. They help users orient themselves and access common operations quickly.',
      'Keep toolbars uncluttered: one clear title and a small set of actions. Move secondary actions into menus when space is limited.',
      'Ensure actions remain accessible on smaller screens (overflow menu, icon-only buttons with labels).',
    ],
    stylingGuide: [
      'BRANDED header: .app-header nsh-toolbar { --nsh-toolbar-bg: #1976d2; --nsh-toolbar-height: 64px; --nsh-toolbar-title-color: #fff; --nsh-toolbar-border: none; --nsh-toolbar-padding: 16px 20px; --nsh-toolbar-action-gap: 12px; }',
      'DEFAULT light: .page-toolbar nsh-toolbar { --nsh-toolbar-bg: #fff; --nsh-toolbar-height: 56px; --nsh-toolbar-title-color: #333; --nsh-toolbar-border: 1px solid #eee; --nsh-toolbar-padding: 12px 16px; }',
      'HTML: <nsh-toolbar><span>Page Title</span><button nsh-button>Action</button></nsh-toolbar>',
    ],
    tokenDescriptions: {
      '--nsh-toolbar-height': 'Toolbar height: 48px (compact), 56px (standard), 64px (large), 72px (spacious)',
      '--nsh-toolbar-bg': 'Background: #fff white, #f5f5f5 gray, #1976d2 blue, #2196f3 lighter blue for branded',
      '--nsh-toolbar-border': 'Bottom divider: none (no line), 1px solid #eee light, 1px solid #ddd medium, shadow alternative',
      '--nsh-toolbar-padding': 'Horizontal space: 12px (compact), 16px (standard), 20px (spacious), 24px (generous)',
      '--nsh-toolbar-title-color': 'Title text: #000 black, #333 dark, #666 medium, #fff white for dark background',
      '--nsh-toolbar-action-gap': 'Button spacing: 4px (tight), 8px (standard), 12px (spacious), 16px (loose)',
    },
    route: '/showcase/toolbar',
    category: 'components',
    exampleProvider: () => toolbarExamples,
  },
  {
    id: 'input',
    title: 'Input',
    description: 'Text fields with CVA support.',
    overview: [
      'Inputs collect short, free-form text such as names, titles, or identifiers. They should provide clear labeling, feedback, and appropriate keyboard behavior.',
      'Use placeholders as examples, not as the only label. If validation is required, show errors close to the field and explain how to fix them.',
      'Support common interactions like copy/paste, select-all, and proper disabled/readonly states for predictable form behavior.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default input styling (paste in styles.scss) */
:root {
  --nsh-input-height: 40px;
  --nsh-input-padding: 8px 12px;
  --nsh-input-border: 1px solid #ccc;
  --nsh-input-border-color: #ccc;
  --nsh-input-radius: 4px;
  --nsh-input-focus-border-color: #1976d2;
  --nsh-input-focus-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}`,
      `/* SCOPED - Different input styles (paste in component.scss) */
/* Standard form input */
.form-field nsh-input {
  --nsh-input-height: 40px;
  --nsh-input-padding: 8px 12px;
  --nsh-input-border: 1px solid #ccc;
  --nsh-input-radius: 4px;
}

/* Large search box */
.search-box nsh-input {
  --nsh-input-height: 48px;
  --nsh-input-padding: 12px 16px;
  --nsh-input-border-radius: 24px;
  --nsh-input-focus-border-color: #2196f3;
  --nsh-input-focus-shadow: 0 2px 8px rgba(33, 150, 243, 0.25);
}

/* Compact inline input */
.inline-edit nsh-input {
  --nsh-input-height: 32px;
  --nsh-input-padding: 6px 10px;
  --nsh-input-border: 1px solid transparent;
  --nsh-input-focus-border-color: #f57c00;
}`,
      `/* HTML USAGE - Add inputs with different styles */
<!-- Standard form input -->
<div class="form-field">
  <label>Email Address</label>
  <nsh-input type="email" placeholder="user@example.com"></nsh-input>
</div>

<!-- Large search box -->
<div class="search-box">
  <nsh-input type="search" placeholder="Search..."></nsh-input>
</div>

<!-- Inline editable field -->
<div class="inline-edit">
  <span>Name:</span>
  <nsh-input [value]="name" (blur)="saveName()"></nsh-input>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-input-height': 'Height: 32px (compact), 40px (standard), 44px, 48px (large), 56px (extra-large)',
      '--nsh-input-padding': 'Padding: 6px 10px (compact), 8px 12px (standard), 10px 14px, 12px 16px (spacious)',
      '--nsh-input-border': 'Border line: 1px solid #ccc, 2px solid for emphasis',
      '--nsh-input-border-color': 'Color when not focused: #ccc light, #999 medium, #666 dark/expressive',
      '--nsh-input-radius': 'Corners: 0 sharp, 2px subtle, 4px rounded, 6px more rounded, 50% pill',
      '--nsh-input-focus-border-color': 'When typing: #1976d2 blue, #2196f3 lighter blue, #f57c00 orange for custom',
      '--nsh-input-focus-shadow': 'Focus ring: 0 0 0 2px rgba(25,118,210,0.1) subtle, 0 0 0 3px for bold, 0 0 0 4px for very prominent',
    },
    route: '/showcase/input',
    category: 'forms',
    exampleProvider: () => inputExamples,
  },
  {
    id: 'textarea',
    title: 'Textarea',
    description: 'Multi-line text input.',
    overview: [
      'Textareas capture longer free-form content such as notes, descriptions, or comments. They should be easy to read and edit without feeling cramped.',
      'Use auto-resize carefully: it can improve usability for short messages, but it can also cause layout shifts. Provide a reasonable default height.',
      'If there are length limits, show counters and validation feedback early so users aren\'t surprised at submit time.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default textarea styling (paste in styles.scss) */
:root {
  --nsh-textarea-min-height: 100px;
  --nsh-textarea-padding: 12px;
  --nsh-textarea-border: 1px solid #ccc;
  --nsh-textarea-border-color: #ccc;
  --nsh-textarea-radius: 4px;
  --nsh-textarea-line-height: 1.5;
  --nsh-textarea-focus-border-color: #1976d2;
}`,
      `/* SCOPED - Comment box and description textarea (paste in component.scss) */
/* Comment input box */
.comment-box nsh-textarea {
  --nsh-textarea-min-height: 100px;
  --nsh-textarea-padding: 12px;
  --nsh-textarea-border: 1px solid #ccc;
  --nsh-textarea-radius: 4px;
  --nsh-textarea-line-height: 1.5;
  --nsh-textarea-focus-border-color: #1976d2;
}

/* Large description field */
.description nsh-textarea {
  --nsh-textarea-min-height: 200px;
  --nsh-textarea-padding: 16px;
  --nsh-textarea-border: 2px solid #ddd;
  --nsh-textarea-line-height: 1.6;
  --nsh-textarea-focus-border-color: #2196f3;
}

/* Compact feedback textarea */
.feedback nsh-textarea {
  --nsh-textarea-min-height: 60px;
  --nsh-textarea-padding: 10px;
  --nsh-textarea-radius: 8px;
}`,
      `/* HTML USAGE - Add textareas with different sizes */
<!-- Comment input -->
<div class="comment-box">
  <label>Add a comment</label>
  <nsh-textarea placeholder="Write your feedback..." formControl="comment"></nsh-textarea>
</div>

<!-- Description field -->
<div class="description">
  <label>Product Description</label>
  <nsh-textarea placeholder="Describe the product details..." [rows]="8"></nsh-textarea>
</div>

<!-- Quick feedback -->
<div class="feedback">
  <label>Feedback</label>
  <nsh-textarea placeholder="Your thoughts..."></nsh-textarea>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-textarea-min-height': 'Starting height: 60px small, 80px compact, 100px standard, 150px large, 200px spacious',
      '--nsh-textarea-padding': 'Internal space: 10px (compact), 12px (standard), 16px (spacious), 20px (generous)',
      '--nsh-textarea-border': 'Border: 1px solid #ccc light, 1px solid #999 medium, 2px solid #666 bold',
      '--nsh-textarea-border-color': 'Color: #ccc light gray, #999 medium gray, #666 dark gray',
      '--nsh-textarea-radius': 'Corners: 0 sharp, 4px rounded, 6px more rounded, 8px smooth',
      '--nsh-textarea-focus-border-color': 'On focus: #1976d2 blue, #2196f3 lighter, #f57c00 orange',
      '--nsh-textarea-line-height': 'Line spacing: 1.4 tight, 1.5 comfortable, 1.6 spacious, 1.8 very spacious',
    },
    route: '/showcase/textarea',
    category: 'forms',
    exampleProvider: () => textareaExamples,
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    description: 'Binary choice controls.',
    overview: [
      'Checkboxes represent independent on/off choices. Use them when multiple selections can be made at once or when each option is separate.',
      'Labels should clearly describe the outcome of checking the box. Avoid ambiguous labels like "Enable" without context.',
      'For exclusive selection, use radio buttons instead of forcing users to uncheck other boxes manually.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default checkbox styling (paste in styles.scss) */
:root {
  --nsh-checkbox-size: 20px;
  --nsh-checkbox-radius: 3px;
  --nsh-checkbox-border: 2px solid #999;
  --nsh-checkbox-checked-bg: #1976d2;
  --nsh-checkbox-checked-color: #fff;
  --nsh-checkbox-gap: 8px;
}`,
      `/* SCOPED - Different checkbox styles (paste in component.scss) */
/* Standard form checkboxes */
.form nsh-checkbox {
  --nsh-checkbox-size: 20px;
  --nsh-checkbox-radius: 3px;
  --nsh-checkbox-checked-bg: #1976d2;
  --nsh-checkbox-gap: 8px;
}

/* Large terms & conditions */
.terms nsh-checkbox {
  --nsh-checkbox-size: 24px;
  --nsh-checkbox-radius: 4px;
  --nsh-checkbox-checked-bg: #2196f3;
  --nsh-checkbox-gap: 12px;
}

/* Compact list checkboxes */
.bulk-select nsh-checkbox {
  --nsh-checkbox-size: 18px;
  --nsh-checkbox-checked-bg: #4caf50;
}`,
      `/* HTML USAGE - Add checkboxes with labels */
<div class="form">
  <label>
    <nsh-checkbox [checked]="agreeTerms" (change)="updateTerms($event)"></nsh-checkbox>
    I agree to the terms and conditions
  </label>
</div>

<div class="terms">
  <label>
    <nsh-checkbox>
    </nsh-checkbox>
    I have read and accept the legal terms
  </label>
</div>

<div class="bulk-select">
  <label>
    <nsh-checkbox [checked]="selectAll" (change)="toggleSelectAll($event)"></nsh-checkbox>
    Select all items
  </label>
  <label *ngFor="let item of items">
    <nsh-checkbox [value]="item.id" (change)="updateSelection($event)"></nsh-checkbox>
    {{item.name}}
  </label>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-checkbox-size': 'Box dimension: 16px (small), 18px (compact), 20px (standard), 24px (large), 28px (extra-large)',
      '--nsh-checkbox-radius': 'Corners: 0 (sharp square), 2px (subtle), 3px (slightly rounded), 4px (rounded)',
      '--nsh-checkbox-border': 'Unchecked border: 2px solid #999 standard, 2px solid #666 bold, 1.5px solid #ccc light',
      '--nsh-checkbox-bg': 'Unchecked fill: #fff white, #fafafa off-white, transparent for outline only',
      '--nsh-checkbox-checked-bg': 'Checked fill: #1976d2 blue, #2196f3 lighter, #4caf50 green, #f57c00 orange',
      '--nsh-checkbox-checked-color': 'Checkmark: #fff white, #fafafa off-white (usually white on colored background)',
      '--nsh-checkbox-gap': 'Space from label: 6px tight, 8px standard, 10px comfortable, 12px spacious, 16px loose',
    },
    route: '/showcase/checkbox',
    category: 'forms',
    exampleProvider: () => checkboxExamples,
  },
  {
    id: 'radio',
    title: 'Radio',
    description: 'Exclusive selection groups.',
    overview: [
      'Radio groups allow users to pick exactly one option from a set. They\'re ideal when all options should be visible without opening a menu.',
      'Keep option labels parallel and concise. If there are many options, consider a select or autocomplete instead.',
      'Always provide a group label so screen readers can announce the context of the options.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default radio group styling (paste in styles.scss) */
:root {
  --nsh-radio-size: 20px;
  --nsh-radio-border: 2px solid #999;
  --nsh-radio-checked-bg: #1976d2;
  --nsh-radio-dot-size: 8px;
  --nsh-radio-gap: 8px;
  --nsh-radio-group-gap: 16px;
}`,
      `/* SCOPED - Radio button groups (paste in component.scss) */
/* Standard radio options */
.options nsh-radio-group {
  --nsh-radio-size: 20px;
  --nsh-radio-checked-bg: #1976d2;
  --nsh-radio-gap: 8px;
  --nsh-radio-group-gap: 16px;
}

/* Large settings options */
.settings nsh-radio-group {
  --nsh-radio-size: 24px;
  --nsh-radio-dot-size: 10px;
  --nsh-radio-checked-bg: #2196f3;
  --nsh-radio-gap: 10px;
  --nsh-radio-group-gap: 20px;
}

/* Vertical layout options */
.payment-methods nsh-radio-group {
  --nsh-radio-size: 20px;
  --nsh-radio-group-gap: 12px;
  --nsh-radio-checked-bg: #4caf50;
}`,
      `/* HTML USAGE - Create radio button groups */
<fieldset>
  <legend>Choose an option</legend>
  <nsh-radio-group class="options" [value]="selectedOption" (change)="updateOption($event)">
    <label>
      <nsh-radio value="option-a"></nsh-radio>
      Option A
    </label>
    <label>
      <nsh-radio value="option-b"></nsh-radio>
      Option B  
    </label>
    <label>
      <nsh-radio value="option-c"></nsh-radio>
      Option C
    </label>
  </nsh-radio-group>
</fieldset>

<fieldset class="payment-methods">
  <legend>Payment Method</legend>
  <nsh-radio-group [value]="paymentMethod" (change)="updatePayment($event)">
    <label><nsh-radio value="card"></nsh-radio>Credit Card</label>
    <label><nsh-radio value="bank"></nsh-radio>Bank Transfer</label>
    <label><nsh-radio value="wallet"></nsh-radio>Digital Wallet</label>
  </nsh-radio-group>
</fieldset>`,
    ],
    tokenDescriptions: {
      '--nsh-radio-size': 'Circle diameter: 16px (compact), 18px, 20px (standard), 24px (large), 28px (extra-large)',
      '--nsh-radio-border': 'Unselected ring: 2px solid #999 standard, 2px solid #666 bold, 1.5px solid #ccc light',
      '--nsh-radio-bg': 'Unselected fill: #fff white, #fafafa off-white, transparent for ring-only style',
      '--nsh-radio-checked-bg': 'Outer circle when selected: #1976d2 blue, #2196f3 lighter, #4caf50 green',
      '--nsh-radio-dot-size': 'Inner filled dot: 6px small, 8px standard, 10px large, 12px extra-large (rule: ~40% of radio-size)',
      '--nsh-radio-gap': 'Space from label: 6px tight, 8px standard, 10px comfortable, 12px spacious',
      '--nsh-radio-group-gap': 'Vertical space between options: 12px tight, 16px standard, 20px spacious, 24px loose',
    },
    route: '/showcase/radio',
    category: 'forms',
    exampleProvider: () => radioExamples,
  },
  {
    id: 'switch',
    title: 'Switch',
    description: 'Toggle controls with labels.',
    overview: [
      'Switches represent an immediate on/off state, typically taking effect as soon as they\'re changed. Use them for settings that don\'t require form submission.',
      'The label should describe the feature being enabled, not the action (for example, "Email notifications" rather than "Enable").',
      'If changing the setting is risky, consider confirmation or additional context so users understand the impact.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default switch styling (paste in styles.scss) */
:root {
  --nsh-switch-width: 48px;
  --nsh-switch-height: 24px;
  --nsh-switch-thumb-size: 20px;
  --nsh-switch-track-bg: #ccc;
  --nsh-switch-checked-bg: #4caf50;
  --nsh-switch-radius: 12px;
  --nsh-switch-gap: 10px;
}`,
      `/* SCOPED - Different switch uses (paste in component.scss) */
/* Notifications settings */
.notifications nsh-switch {
  --nsh-switch-width: 48px;
  --nsh-switch-height: 24px;
  --nsh-switch-thumb-size: 20px;
  --nsh-switch-checked-bg: #4caf50;
  --nsh-switch-gap: 10px;
}

/* Preferences - larger switches */
.preferences nsh-switch {
  --nsh-switch-width: 52px;
  --nsh-switch-height: 26px;
  --nsh-switch-thumb-size: 22px;
  --nsh-switch-checked-bg: #2196f3;
  --nsh-switch-gap: 12px;
}

/* Feature flags - compact */
.feature-flags nsh-switch {
  --nsh-switch-width: 44px;
  --nsh-switch-height: 22px;
  --nsh-switch-thumb-size: 18px;
}`,
      `/* HTML USAGE - Toggle switches for settings */
<div class="notifications">
  <label>
    <nsh-switch [checked]="emailNotif" (change)="toggleEmailNotifications($event)"></nsh-switch>
    Email Notifications
  </label>
  <label>
    <nsh-switch [checked]="pushNotif" (change)="togglePushNotifications($event)"></nsh-switch>
    Push Notifications
  </label>
</div>

<div class="preferences">
  <label>
    <nsh-switch [checked]="darkMode" (change)="toggleDarkMode($event)"></nsh-switch>
    Dark Mode
  </label>
  <label>
    <nsh-switch [checked]="analytics" (change)="toggleAnalytics($event)"></nsh-switch>
    Share Analytics
  </label>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-switch-width': 'Track width: 40px (small), 44px (compact), 48px (standard), 52px (large), 56px (extra-large)',
      '--nsh-switch-height': 'Track height: 20px (compact), 22px, 24px (standard), 26px (comfortable), 28px (spacious)',
      '--nsh-switch-radius': 'Track corners: usually 50% or ~half of height for pill shape',
      '--nsh-switch-thumb-size': 'Circle diameter: 16px (compact), 18px (standard), 20px, 22px (large), 24px (extra-large)',
      '--nsh-switch-track-bg': 'Off state: #ccc light gray, #bbb darker gray, #999 dark gray',
      '--nsh-switch-checked-bg': 'On state: #4caf50 green success, #2196f3 blue, #ff9800 orange warning',
      '--nsh-switch-gap': 'Space before label: 8px (tight), 10px (standard), 12px (comfortable), 16px (spacious)',
    },
    route: '/showcase/switch',
    category: 'forms',
    exampleProvider: () => switchExamples,
  },
  {
    id: 'slider',
    title: 'Slider',
    description: 'Range input for numeric values.',
    overview: [
      'Sliders are best for choosing a value within a bounded range when precision is not critical (volume, brightness, approximate thresholds).',
      'Provide visible min/max context and consider showing the current value. For exact numeric input, pair with a text input or stepper control.',
      'Ensure the slider is keyboard accessible and that changes announce appropriately for assistive technologies.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default slider styling (paste in styles.scss) */
:root {
  --nsh-slider-track-height: 6px;
  --nsh-slider-track-bg: #e0e0e0;
  --nsh-slider-track-filled-bg: #2196f3;
  --nsh-slider-thumb-size: 20px;
  --nsh-slider-thumb-bg: #2196f3;
  --nsh-slider-thumb-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}`,
      `/* SCOPED - Different slider types (paste in component.scss) */
/* Volume slider */
.volume nsh-slider {
  --nsh-slider-track-height: 6px;
  --nsh-slider-track-filled-bg: #2196f3;
  --nsh-slider-thumb-size: 20px;
  --nsh-slider-thumb-bg: #2196f3;
  --nsh-slider-thumb-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Brightness slider */
.brightness nsh-slider {
  --nsh-slider-track-height: 4px;
  --nsh-slider-track-filled-bg: #ff9800;
  --nsh-slider-thumb-size: 18px;
  --nsh-slider-thumb-bg: #ff9800;
}

/* Price range slider */
.price-range nsh-slider {
  --nsh-slider-track-height: 5px;
  --nsh-slider-track-filled-bg: #4caf50;
  --nsh-slider-thumb-size: 22px;
  --nsh-slider-thumb-bg: #fff;
  --nsh-slider-thumb-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}`,
      `/* HTML USAGE - Add sliders for numeric input */
<label class="volume">
  <span>Volume: {{volume}}%</span>
  <nsh-slider [min]="0" [max]="100" [value]="volume" (change)="updateVolume($event)"></nsh-slider>
</label>

<label class="brightness">
  <span>Brightness</span>
  <nsh-slider [min]="0" [max]="100" [value]="brightness" (change)="updateBrightness($event)"></nsh-slider>
</label>

<div class="price-range">
  <label>Price Range: \${{minPrice}} - \${{maxPrice}}</label>
  <nsh-slider [min]="10" [max]="1000" [value]="minPrice" (change)="updateMinPrice($event)"></nsh-slider>
  <nsh-slider [min]="10" [max]="1000" [value]="maxPrice" (change)="updateMaxPrice($event)"></nsh-slider>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-slider-track-height': 'Line thickness: 2px (thin), 4px (subtle), 6px (standard), 8px (bold), 10px (thick)',
      '--nsh-slider-track-bg': 'Empty portion: #e0e0e0 light, #d0d0d0 medium, #bbb dark gray',
      '--nsh-slider-track-filled-bg': 'Progress color: #2196f3 blue, #4caf50 green, #ff9800 orange, #f44336 red',
      '--nsh-slider-thumb-size': 'Handle size: 14px (small), 16px (compact), 18px, 20px (standard), 24px (large), 28px (extra-large)',
      '--nsh-slider-thumb-bg': 'Handle fill: matches track-filled-bg or use #fff white with shadow for contrast',
      '--nsh-slider-thumb-shadow': 'Handle depth: none flat, 0 1px 2px light, 0 2px 4px medium, 0 4px 8px prominent',
      '--nsh-slider-label-font-size': 'Min/max text: 11px tiny, 12px small, 13px standard, 14px readable',
    },
    route: '/showcase/slider',
    category: 'forms',
    exampleProvider: () => sliderExamples,
  },
  {
    id: 'select',
    title: 'Select',
    description: 'Overlay select with options.',
    overview: [
      'Select controls let users choose one option from a list while keeping the UI compact. They work well when options are short and fairly stable.',
      'Use select when the number of options is manageable. If users need to search or the list is large, prefer autocomplete.',
      'Ensure the selected value is clearly visible and that the control has a descriptive label for accessibility.',
    ],
    stylingGuide: [
      `/* GLOBAL - Default select dropdown styling (paste in styles.scss) */
:root {
  --nsh-select-height: 40px;
  --nsh-select-padding: 8px 12px;
  --nsh-select-border: 1px solid #ccc;
  --nsh-select-radius: 4px;
  --nsh-select-panel-bg: #fff;
  --nsh-select-panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  --nsh-select-option-padding: 12px 16px;
}`,
      `/* SCOPED - Different select styles (paste in component.scss) */
/* Standard form select */
.form-field nsh-select {
  --nsh-select-height: 40px;
  --nsh-select-padding: 8px 12px;
  --nsh-select-border: 1px solid #ccc;
  --nsh-select-radius: 4px;
}

/* Large filter dropdown */
.filter-menu nsh-select {
  --nsh-select-height: 48px;
  --nsh-select-padding: 10px 14px;
  --nsh-select-option-padding: 16px 20px;
  --nsh-select-panel-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Compact inline select */
.toolbar-select nsh-select {
  --nsh-select-height: 32px;
  --nsh-select-padding: 6px 10px;
  --nsh-select-option-padding: 8px 12px;
}`,
      `/* HTML USAGE - Add select dropdowns */
<div class="form-field">
  <label>Choose Category</label>
  <nsh-select [value]="selectedCategory" (change)="updateCategory($event)\">
    <nsh-select-option *ngFor="let cat of categories\" [value]="cat.id\">
      {{cat.name}}
    </nsh-select-option>
  </nsh-select>
</div>

<div class="filter-menu\">
  <label>Filter by Status</label>
  <nsh-select [value]="filter\" (change)="applyFilter($event)\">
    <nsh-select-option value="all\">All Items</nsh-select-option>
    <nsh-select-option value="active\">Active</nsh-select-option>
    <nsh-select-option value="archived\">Archived</nsh-select-option>
  </nsh-select>
</div>

<div class=\"toolbar-select\">
  <nsh-select [value]="sortBy\" (change)=\"updateSort($event)\">\
    <nsh-select-option value="name\">Sort by Name</nsh-select-option>
    <nsh-select-option value="date\">Sort by Date</nsh-select-option>
    <nsh-select-option value="size\">Sort by Size</nsh-select-option>
  </nsh-select>
</div>`,
    ],
    tokenDescriptions: {
      '--nsh-select-height': 'Trigger height: 32px (compact), 40px (standard), 44px, 48px (large), 56px (xl)',
      '--nsh-select-padding': 'Trigger internal space: 6px 10px (compact), 8px 12px (standard), 10px 14px (spacious)',
      '--nsh-select-border': 'Trigger border: 1px solid #ccc light, 1px solid #999 medium, 2px solid #666 bold',
      '--nsh-select-radius': 'Trigger corners: 0 sharp, 2px subtle, 4px rounded, 6px more, 50% pill',
      '--nsh-select-panel-bg': 'Panel fill: #fff white, #fafafa off-white, #f5f5f5 light gray',
      '--nsh-select-panel-shadow': 'Panel depth: none flat, 0 2px 8px subtle, 0 4px 16px medium, 0 8px 24px prominent',
      '--nsh-select-option-padding': 'Each option space: 8px 12px (compact), 12px 16px (standard), 16px 20px (spacious)',
    },
    route: '/showcase/select',
    category: 'forms',
    exampleProvider: () => selectExamples,
  },
  {
    id: 'select-panel',
    title: 'Select panel',
    description: 'Lower-level select list panel.',
    overview: [
      'Select panels are the overlay surface used by Select to render options. They control scrolling, sizing, and selection affordances.',
      'Use the higher-level Select component for typical forms. Use the panel directly only when you need custom composition or advanced behaviors.',
      'Keep option content consistent so users can scan the list quickly and make confident selections.',
    ],
    stylingGuide: [
      'Customize select panel layout. Example: .custom-select nsh-select-panel { --nsh-select-panel-max-height: 320px; --nsh-select-panel-option-height: 40px; --nsh-select-panel-padding: 8px 0; }',
    ],
    tokenDescriptions: {
      '--nsh-select-panel-bg': 'Background color (e.g., #fff)',
      '--nsh-select-panel-shadow': 'Elevation shadow (e.g., 0 2px 8px rgba(0,0,0,0.15))',
      '--nsh-select-panel-border-radius': 'Corner radius (e.g., 4px, 8px)',
      '--nsh-select-panel-max-height': 'Maximum height (e.g., 300px, 400px)',
      '--nsh-select-panel-option-height': 'Option row height (e.g., 40px, 48px)',
      '--nsh-select-panel-option-padding': 'Option padding (e.g., 12px 16px, 16px 20px)',
    },
    route: '/showcase/select-panel',
    category: 'overlays',
    exampleProvider: () => selectPanelExamples,
  },
  {
    id: 'autocomplete',
    title: 'Autocomplete',
    description: 'Typeahead suggestions.',
    overview: [
      'Autocomplete helps users find and select options by typing, which is ideal for large lists (countries, users, products) where scanning is slow.',
      'Provide clear suggestion text and predictable matching. Consider what happens when there are no matches and how to handle free-form input (if allowed).',
      'Ensure keyboard navigation works end-to-end: arrow keys to move, enter to select, escape to close, and proper focus management.',
    ],
    stylingGuide: [
      'SEARCH box: .search-box nsh-autocomplete [nsh-input] { --nsh-autocomplete-panel-bg: #fff; --nsh-autocomplete-option-height: 44px; --nsh-autocomplete-option-padding: 12px 16px; --nsh-autocomplete-highlight-bg: #fff9c4; }',
      'USER picker: .user-search nsh-autocomplete { --nsh-autocomplete-option-height: 48px; --nsh-autocomplete-panel-shadow: 0 4px 16px rgba(0,0,0,0.2); --nsh-autocomplete-separator-color: #eee; }',
      'HTML: <input nsh-input [autocomplete]=\"options\" [filterFn]=\"filter\" (select)=\"onSelected($event)\" />',
    ],
    tokenDescriptions: {
      '--nsh-autocomplete-input-height': 'Input height: 32px, 40px (standard), 44px, 48px (large), 56px (xl)',
      '--nsh-autocomplete-panel-bg': 'Panel fill: #fff white, #fafafa off-white, #f5f5f5 light gray',
      '--nsh-autocomplete-panel-shadow': 'Elevation: 0 2px 8px subtle, 0 4px 16px medium, 0 8px 24px prominent',
      '--nsh-autocomplete-option-padding': 'Option space: 8px 12px tight, 12px 16px standard, 16px 20px spacious',
      '--nsh-autocomplete-option-height': 'Row height: 36px (compact), 40px (standard), 48px (large), 56px (xl with avatar)',
      '--nsh-autocomplete-highlight-bg': 'Search match: #fff9c4 yellow soft, #fff3cd darker, #ffffcc light yellow, #e8f5e9 green',
      '--nsh-autocomplete-separator-color': 'Group dividing line: #eee light, #ddd medium, #ccc dark',
    },
    route: '/showcase/autocomplete',
    category: 'forms',
    exampleProvider: () => autocompleteExamples,
  },
  {
    id: 'autocomplete-panel',
    title: 'Autocomplete panel',
    description: 'Raw panel used by autocomplete.',
    overview: [
      'Autocomplete panels are the overlay surface used to render typeahead options. They handle positioning, scrolling, and interaction boundaries.',
      'Use Autocomplete for standard patterns. Reach for the panel when building custom suggestion UIs or integrating with non-standard inputs.',
      'Keep performance in mind: render only what\'s needed and avoid heavy templates inside large suggestion lists.',
    ],
    stylingGuide: [
      'Customize autcomplete panel hover and dividers. Example: .suggestions nsh-autocomplete-panel { --nsh-autocomplete-option-hover-bg: #f5f5f5; --nsh-autocomplete-panel-max-height: 300px; --nsh-autocomplete-panel-padding: 8px 0; }',
    ],
    tokenDescriptions: {
      '--nsh-autocomplete-panel-bg': 'Background (e.g., #fff)',
      '--nsh-autocomplete-panel-shadow': 'Elevation (e.g., 0 2px 12px rgba(0,0,0,0.15))',
      '--nsh-autocomplete-panel-max-height': 'Maximum height (e.g., 300px)',
      '--nsh-autocomplete-panel-padding': 'Internal padding (e.g., 8px 0px)',
      '--nsh-autocomplete-option-height': 'Row height (e.g., 40px, 48px)',
      '--nsh-autocomplete-option-hover-bg': 'Hover color (e.g., #f5f5f5)',
    },
    route: '/showcase/autocomplete-panel',
    category: 'overlays',
    exampleProvider: () => autocompletePanelExamples,
  },
  {
    id: 'chips',
    title: 'Chips',
    description: 'Selectable chip tokens.',
    overview: [
      'Chips represent small pieces of information such as filters, categories, or selected items. They can be static labels or interactive controls depending on the use case.',
      'Use chips for quick toggles and filters, especially when the selection state should remain visible. For complex selection, consider a list or multi-select control.',
      'Keep chip labels short and ensure the selected/removed state is clear without relying solely on color.',
    ],
    stylingGuide: [
      'FILTER chips: .filters nsh-chip { --nsh-chip-height: 32px; --nsh-chip-padding: 6px 12px; --nsh-chip-radius: 16px; --nsh-chip-bg: #f0f0f0; --nsh-chip-selected-bg: #c8e6c9; --nsh-chip-text-color: #333; --nsh-chip-delete-icon-padding: 4px; }',
      'TAG chips: .tags nsh-chip { --nsh-chip-height: 36px; --nsh-chip-padding: 8px 16px; --nsh-chip-selected-bg: #e3f2fd; --nsh-chip-delete-icon-padding: 6px; --nsh-chip-text-color: #1976d2; }',
      'HTML: <nsh-chip *ngFor="let item of filters" [selected]="item.active" (removed)="removeFilter(item)">{{item.label}} <mat-icon>close</mat-icon></nsh-chip>',
    ],
    tokenDescriptions: {
      '--nsh-chip-height': 'Chip height: 28px (compact), 32px (standard), 36px (large), 40px (extra-large)',
      '--nsh-chip-padding': 'Horizontal padding: 4px 8px (compact), 6px 12px (standard), 8px 16px (spacious), 10px 20px (loose)',
      '--nsh-chip-radius': 'Corners: 4px (rectangular), 8px (slightly rounded), 16px (rounded), 20px (pill-shaped)',
      '--nsh-chip-bg': 'Unselected color: #f0f0f0 light, #e0e0e0 medium, #d0d0d0 dark, #e3f2fd blue-tinted',
      '--nsh-chip-selected-bg': 'Selected color: #c8e6c9 green, #e3f2fd blue, #f3e5f5 purple, #ffe0b2 orange',
      '--nsh-chip-text-color': 'Label text: #333 dark, #666 medium, #999 light (match background contrast)',
      '--nsh-chip-delete-icon-padding': 'Icon spacing: 2px (tight), 4px (standard), 6px (spacious), 8px (loose)',
    },
    route: '/showcase/chips',
    category: 'forms',
    exampleProvider: () => chipsExamples,
  },
  {
    id: 'form-field',
    title: 'Form field',
    description: 'Labels, hints, and validation.',
    overview: [
      'Form fields provide consistent structure around inputs: label, hint text, and validation messages. They help users understand what to enter and why it matters.',
      'Use hints to explain constraints (format, min/max) and show errors only when helpful—either on blur or submit depending on the interaction model.',
      'Keep messaging specific and actionable. Instead of "Invalid", explain the expected format or the allowed range.',
    ],
    stylingGuide: [
      `/* STANDARD form field */
<nsh-form-field>
  <label>Email</label>
  <nsh-input placeholder="user@example.com"></nsh-input>
  <hint>We'll never share this email</hint>
</nsh-form-field>`,
      `/* Error state styling */
.email-field nsh-form-field {
  --nsh-form-field-label-color: #333;
  --nsh-form-field-hint-color: #999;
  --nsh-form-field-error-color: #d32f2f;
  --nsh-form-field-label-font-size: 13px;
}`,
      `/* Conditional state binding */
<nsh-form-field [class]="invalid ? 'has-error' : 'valid'">
  <label>Required Field</label>
  <nsh-input formControl="email"></nsh-input>
  @if (invalid) {
    <hint class="error">Please enter a valid email</hint>
  }
</nsh-form-field>`,
    ],
    tokenDescriptions: {
      '--nsh-form-field-padding': 'Wrapper space: 10px (compact), 12px (standard), 16px (spacious), 20px (generous)',
      '--nsh-form-field-label-font-size': 'Label text: 11px (small), 12px (compact), 13px (standard), 14px (large)',
      '--nsh-form-field-hint-font-size': 'Help text: 10px (tiny), 11px (small), 12px (standard), 13px (readable)',
      '--nsh-form-field-error-color': 'Error message: #d32f2f red standard, #c62828 deeper red, #f44336 bright red',
      '--nsh-form-field-hint-color': 'Helper text: #666 dark gray, #999 medium, #aaa light gray, secondary appearance',
      '--nsh-form-field-label-color': 'Label text: #333 dark, #666 medium, #999 light (usually matches text color)',
    },
    route: '/showcase/form-field',
    category: 'forms',
    exampleProvider: () => formFieldExamples,
  },
  {
    id: 'dialog',
    title: 'Dialog',
    description: 'Service-driven modal dialogs.',
    overview: [
      'Dialogs interrupt the current flow to request confirmation, collect focused input, or present critical information. They should be used only when necessary.',
      'Keep dialogs short and task-focused, with one primary action and a clear way to cancel/close. Avoid complex multi-step flows inside dialogs when possible.',
      'Dialogs must trap focus while open and return focus to the triggering element when closed for accessibility.',
    ],
    stylingGuide: [
      'Customize dialog appearance and backdrop. Example: .modal-dialog nsh-dialog { --nsh-dialog-bg: #fff; --nsh-dialog-shadow: 0 11px 15px -7px rgba(0,0,0,0.2); --nsh-dialog-max-width: 600px; --nsh-dialog-padding: 24px; }',
    ],
    tokenDescriptions: {
      '--nsh-dialog-bg': 'Dialog background (e.g., #fff white, #fafafa)',
      '--nsh-dialog-shadow': 'Elevation shadow (e.g., 0 11px 15px -7px rgba(0,0,0,0.2))',
      '--nsh-dialog-border-radius': 'Corner radius (e.g., 4px, 8px)',
      '--nsh-dialog-max-width': 'Maximum width (e.g., 500px, 600px, 800px)',
      '--nsh-dialog-padding': 'Internal padding (e.g., 20px, 24px, 32px)',
      '--nsh-dialog-title-font-size': 'Title text size (e.g., 18px, 20px, 24px)',
    },
    route: '/showcase/dialog',
    category: 'overlays',
    exampleProvider: () => dialogExamples,
  },
  {
    id: 'bottom-sheet',
    title: 'Bottom Sheet',
    description: 'Mobile-first action sheet anchored to the bottom of the viewport.',
    overview: [
      'Bottom sheets present contextual actions or short supplemental tasks while keeping users in their current screen flow.',
      'They work best for mobile and responsive layouts where a bottom-anchored surface feels natural for thumb reach and quick choice actions.',
      'Choose bottom sheets for lightweight decisions (share, filter, choose destination). Use dialogs when the task is blocking, complex, or form-heavy.',
      'Good bottom sheets are concise, easy to dismiss, keyboard-accessible, and return focus to the trigger after close.',
      'Open with NshBottomSheetService.open(component, config). The call returns NshBottomSheetRef, which you can use to dismiss and observe afterDismissed().',
    ],
    overviewSections: [
      {
        title: 'Bottom Sheet Overview',
        paragraphs: [
          'The NshBottomSheetService opens an action panel from the bottom edge of the viewport. It is most useful on mobile and touch-first layouts where it can replace heavier dialog flows for quick decisions.',
          'Use bottom sheets for contextual choices such as share destinations, sort options, file actions, and compact task shortcuts.',
        ],
      },
      {
        title: 'Opening a bottom sheet',
        paragraphs: [
          'Open a sheet by calling open() with a component and optional config. The service returns NshBottomSheetRef for lifecycle handling and dismissal.',
        ],
        codeBlocks: [
          {
            language: 'ts',
            code: `const bottomSheetRef = this.bottomSheet.open(ShareSheetComponent, {
  ariaLabel: 'Share on social media',
  maxWidth: '720px',
});`,
          },
          {
            language: 'ts',
            code: `bottomSheetRef.afterDismissed().subscribe((result) => {
  console.log('Bottom sheet dismissed with:', result);
});

bottomSheetRef.dismiss();`,
          },
        ],
      },
      {
        title: 'Sharing data with sheet content',
        paragraphs: [
          'Pass data through config.data and inject NSH_BOTTOM_SHEET_DATA inside the sheet component.',
        ],
        codeBlocks: [
          {
            language: 'ts',
            code: `const ref = this.bottomSheet.open(HobbitSheetComponent, {
  data: { names: ['Frodo', 'Bilbo'] },
});`,
          },
          {
            language: 'ts',
            code: `import { Component, inject } from '@angular/core';
import { NSH_BOTTOM_SHEET_DATA } from 'nsh-kit-ui';

@Component({
  selector: 'demo-hobbit-sheet',
  standalone: true,
  template: 'passed in {{ (data as { names: string[] })?.names?.join(', ') }}',
})
export class HobbitSheetComponent {
  readonly data = inject(NSH_BOTTOM_SHEET_DATA, { optional: true });
}`,
          },
        ],
      },
      {
        title: 'Global configuration defaults',
        paragraphs: [
          'Provide NSH_BOTTOM_SHEET_DEFAULT_OPTIONS at app root to define project-wide defaults for behavior and sizing.',
        ],
        codeBlocks: [
          {
            language: 'ts',
            code: `import { ApplicationConfig } from '@angular/core';
import { NSH_BOTTOM_SHEET_DEFAULT_OPTIONS } from 'nsh-kit-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: NSH_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {
        closeOnBackdropClick: false,
        autoFocus: 'first-tabbable',
        maxWidth: '720px',
      },
    },
  ],
};`,
          },
        ],
      },
      {
        title: 'Accessibility',
        paragraphs: [
          'Bottom sheet surfaces are rendered as modal dialogs with role="dialog" and should always be given a meaningful ariaLabel in config.',
          'Escape-to-close is enabled by default. Disabling closeOnEscape should be done only when there is a strong workflow reason and an equally clear alternative dismiss action.',
        ],
      },
      {
        title: 'Focus management',
        paragraphs: [
          'Use autoFocus to control which element receives focus when the sheet opens. Always verify keyboard behavior in your final UI flow.',
        ],
        bullets: [
          'first-tabbable: focuses first tabbable element (default)',
          'first-header: focuses first heading element (h1-h6 or role="heading")',
          'dialog: focuses the root dialog container',
          'Any CSS selector: focuses first matching element',
          'false: disable automatic focus movement',
        ],
        codeBlocks: [
          {
            language: 'ts',
            code: `this.bottomSheet.open(ShareSheetComponent, {
  ariaLabel: 'Share actions',
  autoFocus: 'first-header',
});`,
          },
        ],
      },
      {
        title: 'Focus restoration',
        paragraphs: [
          'After dismiss, focus is restored to the opener when possible. If opener no longer exists (for example a menu item), restore focus manually using afterDismissed().',
        ],
        codeBlocks: [
          {
            language: 'ts',
            code: `const ref = this.bottomSheet.open(FileTypeChooserSheet);
ref.afterDismissed().subscribe(() => {
  this.fallbackButton.nativeElement.focus();
});`,
          },
        ],
      },
    ],
    usage: [
      'Use for short action menus, quick routing choices, and secondary tasks tied to the current page context.',
      'Avoid long forms or multi-step flows; use a dialog or full page when the task requires sustained attention.',
      'Keep one clear primary path and easy dismissal (backdrop, Escape, and explicit close/cancel action).',
      'On desktop, constrain width and height so the sheet reads as a focused surface rather than a full-screen modal.',
      'Use semantic labels (ariaLabel in config) so assistive technologies announce purpose clearly.',
      'Share data with content by setting config.data and injecting NSH_BOTTOM_SHEET_DATA in the sheet component.',
      'Provide NSH_BOTTOM_SHEET_DEFAULT_OPTIONS at app root to define global defaults for close behavior and sizing.',
      'Use afterDismissed() to restore focus manually when the original trigger element no longer exists.',
    ],
    stylingGuide: [
      'GLOBAL baseline: :root { --nsh-bottom-sheet-bg: #ffffff; --nsh-bottom-sheet-fg: #1f2533; --nsh-bottom-sheet-radius: 24px 24px 0 0; --nsh-bottom-sheet-padding: 20px; }',
      'Desktop fit: :root { --nsh-bottom-sheet-max-width: 720px; --nsh-bottom-sheet-max-height: 78vh; --nsh-bottom-sheet-width: 100%; }',
      'Backdrop and elevation: :root { --nsh-bottom-sheet-backdrop-bg: rgba(13, 23, 38, 0.42); --nsh-bottom-sheet-shadow: 0 -8px 32px rgba(13, 23, 38, 0.22); }',
      'Usage: bottomSheet.open(MySheetComponent, { ariaLabel: "Share actions", maxWidth: "720px", maxHeight: "80vh" });',
      'Data: bottomSheet.open(MySheetComponent, { data: { names: ["Frodo", "Bilbo"] } });',
      'Global defaults: { provide: NSH_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { closeOnBackdropClick: false } }',
    ],
    tokenDescriptions: {
      '--nsh-bottom-sheet-bg': 'Sheet surface background (e.g., #fff, #f8fafc, #fdfdff)',
      '--nsh-bottom-sheet-fg': 'Primary text/foreground color (e.g., #1f2533, #2a3040)',
      '--nsh-bottom-sheet-backdrop-bg': 'Backdrop overlay opacity and color (e.g., rgba(13,23,38,.42))',
      '--nsh-bottom-sheet-radius': 'Top corner radius; keep bottom corners at 0 (e.g., 20px 20px 0 0)',
      '--nsh-bottom-sheet-shadow': 'Surface elevation shadow (e.g., 0 -8px 32px rgba(0,0,0,.22))',
      '--nsh-bottom-sheet-padding': 'Internal content spacing (e.g., 16px, 20px, 24px)',
      '--nsh-bottom-sheet-width': 'Explicit width value (commonly 100% for responsive bottom anchoring)',
      '--nsh-bottom-sheet-max-width': 'Maximum width on larger viewports (e.g., 640px, 720px, 840px)',
      '--nsh-bottom-sheet-max-height': 'Height cap before internal scroll appears (e.g., 72vh, 80vh)',
    },
    route: '/showcase/bottom-sheet',
    category: 'overlays',
    exampleProvider: () => bottomSheetExamples,
  },
  {
    id: 'snackbar',
    title: 'Snackbar',
    description: 'Transient notification toasts.',
    overview: [
      'Snackbars provide brief feedback about an operation (saved, copied, sent). They should not block the user and should disappear automatically.',
      'Use snackbars for low- to medium-importance messages. For errors that require action, use inline errors or dialogs depending on severity.',
      'Keep text short. If you include an action, make it clear and ensure the snackbar remains long enough for users to react.',
    ],
    stylingGuide: [
      'SUCCESS notification: .success-toast nsh-snackbar { --nsh-snackbar-bg: #4caf50; --nsh-snackbar-color: #fff; --nsh-snackbar-padding: 12px 16px; --nsh-snackbar-border-radius: 4px; --nsh-snackbar-duration: 3000; }',
      'ERROR notification: .error-toast nsh-snackbar { --nsh-snackbar-bg: #f44336; --nsh-snackbar-color: #fff; --nsh-snackbar-action-color: #ffecb3; --nsh-snackbar-duration: 5000; }',
      'DARK default: .notification nsh-snackbar { --nsh-snackbar-bg: #323232; --nsh-snackbar-color: #fff; --nsh-snackbar-action-color: #ffd54f; }',
    ],
    tokenDescriptions: {
      '--nsh-snackbar-bg': 'Background: #323232 dark default, #1a1a1a very dark, #4caf50 green success, #f44336 red error, #ff9800 orange warning, #2196f3 blue info',
      '--nsh-snackbar-color': 'Text: #fff white, #fafafa off-white (high contrast on dark background)',
      '--nsh-snackbar-padding': 'Internal space: 10px 12px (compact), 12px 16px (standard), 16px 20px (spacious)',
      '--nsh-snackbar-border-radius': 'Corners: 0 sharp, 2px subtle, 4px rounded, 8px pill-like',
      '--nsh-snackbar-font-size': 'Text size: 12px (small), 13px (compact), 14px (standard), 15px (readable)',
      '--nsh-snackbar-duration': 'Display ms: 2000 quick, 3000 standard, 5000 long (requires action or error), 0 never auto-dismiss',
      '--nsh-snackbar-action-color': 'Action button: #ffd54f yellow, #ffecb3 light gold (contrast on dark), white alternative',
    },
    route: '/showcase/snackbar',
    category: 'overlays',
    exampleProvider: () => snackbarExamples,
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    description: 'Non-interactive helper text.',
    overview: [
      'Tooltips provide brief, non-interactive help text for controls and icons. They are best for clarifying meaning, not for delivering essential content.',
      'Keep tooltips short (one or two lines). If the content is important, use inline help text or a dedicated help surface instead.',
      'Tooltips should be accessible via keyboard focus as well as hover, and should not cover the triggering element.',
    ],
    stylingGuide: [
      'DARK tooltip: [nsh-tooltip]="\'Helpful hint\'\" .dark-bg { --nsh-tooltip-bg: #333; --nsh-tooltip-color: #fff; --nsh-tooltip-padding: 8px 12px; --nsh-tooltip-font-size: 12px; }',
      'LIGHT themed: .light-theme [nsh-tooltip]="message\" { --nsh-tooltip-bg: #fff; --nsh-tooltip-color: #333; --nsh-tooltip-border: 1px solid #ddd; --nsh-tooltip-arrow-size: 6px; }',
      'HTML: <button [nsh-tooltip]=\"\'Click to save\'\" [tooltipPosition]=\"right\">Save</button> or <icon [nsh-tooltip]=\"helpText\"></icon>',
    ],
    tokenDescriptions: {
      '--nsh-tooltip-bg': 'Background: #333 dark standard, #424242 lighter dark, #1a1a1a very dark, #fff white for light theme',
      '--nsh-tooltip-color': 'Text: #fff white, #fafafa off-white (dark bg), #333 dark, #666 medium (light bg)',
      '--nsh-tooltip-padding': 'Internal space: 6px 10px (compact), 8px 12px (standard), 10px 14px (spacious)',
      '--nsh-tooltip-border-radius': 'Corners: 2px subtle, 3px standard, 4px rounded, 6px more (usually subtle)',
      '--nsh-tooltip-font-size': 'Text size: 11px (small), 12px (standard), 13px (readable), 14px (large)',
      '--nsh-tooltip-max-width': 'Line wrap: 200px very short, 280px standard, 300px spacious, 400px for longer hints',
      '--nsh-tooltip-arrow-size': 'Pointer: 4px small, 5px standard, 6px prominent (triangle dimension)',
    },
    route: '/showcase/tooltip',
    category: 'overlays',
    exampleProvider: () => tooltipExamples,
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'CSS variable theming surfaces.',
    overview: [
      'Themes define the visual language of the UI (colors, typography, spacing, radius, motion). In this kit, themes are expressed primarily through CSS variables.',
      'Use theme tokens instead of hard-coded values so components stay consistent and can adapt across light/dark modes and brand customizations.',
      'When customizing, adjust tokens at the theme level first before overriding individual components to keep maintenance predictable.',
    ],
    stylingGuide: [
      'Define semantic color tokens in :root. Example: :root { --nsh-primary: #2196f3; --nsh-secondary: #ff9800; --nsh-error: #d32f2f; --nsh-success: #4caf50; }',
    ],
    tokenDescriptions: {
      '--nsh-primary': 'Primary brand color (e.g., #2196f3, #1976d2)',
      '--nsh-primary-dark': 'Darker shade (e.g., #1565c0, #0d47a1)',
      '--nsh-secondary': 'Secondary accent (e.g., #ff9800, #f57c00)',
      '--nsh-surface': 'Background surfaces (e.g., #fff, #f5f5f5)',
      '--nsh-on-surface': 'Text on surfaces (e.g., #212121, #333)',
      '--nsh-error': 'Error state (e.g., #d32f2f, #c62828)',
      '--nsh-success': 'Success state (e.g., #388e3c, #2e7d32)',
    },
    route: '/showcase/theme',
    category: 'foundations',
    exampleProvider: () => foundationThemeExamples,
  },
  {
    id: 'tokens',
    title: 'Tokens',
    description: 'Design tokens and scales.',
    overview: [
      'Tokens are named values for design decisions like colors, spacing, radius, elevation, and typography. They enable consistency across components and applications.',
      'Use tokens in component styling so the UI remains coherent when the theme changes. Tokens also make it easier to audit and update design decisions centrally.',
      'Prefer semantic tokens (meaning-based) over raw values. This keeps intent clear and reduces accidental inconsistencies.',
    ],
    stylingGuide: [
      'Define spacing scale in :root. Example: :root { --nsh-spacing-xs: 4px; --nsh-spacing-sm: 8px; --nsh-spacing-md: 16px; --nsh-spacing-lg: 24px; }',
    ],
    tokenDescriptions: {
      '--nsh-spacing-xs': 'Extra-small spacing (e.g., 4px)',
      '--nsh-spacing-sm': 'Small spacing (e.g., 8px)',
      '--nsh-spacing-md': 'Medium spacing (e.g., 16px)',
      '--nsh-spacing-lg': 'Large spacing (e.g., 24px)',
      '--nsh-radius-sm': 'Small radius (e.g., 4px)',
      '--nsh-radius-md': 'Medium radius (e.g., 8px)',
      '--nsh-shadow-sm': 'Small elevation (e.g., 0 1px 3px rgba(0,0,0,0.12))',
    },
    route: '/showcase/tokens',
    category: 'foundations',
    exampleProvider: () => foundationTokensExamples,
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Type styles and hierarchy.',
    overview: [
      'Typography establishes hierarchy and readability across the UI. Consistent type scales help users scan quickly and understand what is most important.',
      'Use a small set of type roles (titles, headings, body, captions) rather than custom sizes everywhere. This improves consistency and makes redesigns easier.',
      'Ensure adequate contrast and line-height for long-form content and for dense UI surfaces like tables and forms.',
    ],
    stylingGuide: [
      'Define typography scale. Example: :root { --nsh-font-family: system-ui, -apple-system; --nsh-font-size-body: 14px; --nsh-font-size-heading: 24px; --nsh-line-height-body: 1.5; }',
    ],
    tokenDescriptions: {
      '--nsh-font-family': 'System font stack (e.g., system-ui, -apple-system)',
      '--nsh-font-size-body': 'Body text size (e.g., 14px, 16px)',
      '--nsh-font-size-heading': 'Heading size (e.g., 24px, 32px)',
      '--nsh-font-size-caption': 'Small/caption size (e.g., 12px, 13px)',
      '--nsh-line-height-body': 'Body line height (e.g., 1.5, 1.6)',
      '--nsh-font-weight-regular': 'Regular weight (400)',
      '--nsh-font-weight-bold': 'Bold weight (600, 700)',
    },
    route: '/showcase/typography',
    category: 'foundations',
    exampleProvider: () => foundationTypographyExamples,
  },
  {
    id: 'icons',
    title: 'Icon registry',
    description: 'Icon registration and usage.',
    overview: [
      'The icon registry provides a centralized way to register and reference icons across the application. This ensures consistent sizing, alignment, and reuse.',
      'Use icons to support meaning, not replace it. For important actions, pair icons with labels or provide accessible labels for icon-only buttons.',
      'Prefer a small, consistent set of icons. Too many styles or metaphors makes the UI harder to learn.',
    ],
    stylingGuide: [
      'Customize icon size variants. Example: .icons { --nsh-icon-size-sm: 16px; --nsh-icon-size-md: 24px; --nsh-icon-size-lg: 32px; --nsh-icon-color: currentColor; }',
    ],
    tokenDescriptions: {
      '--nsh-icon-size-sm': 'Small icon (e.g., 16px, 18px)',
      '--nsh-icon-size-md': 'Medium icon (e.g., 24px)',
      '--nsh-icon-size-lg': 'Large icon (e.g., 32px, 40px)',
      '--nsh-icon-color': 'Default icon color (e.g., currentColor, inherit)',
      '--nsh-icon-disabled-opacity': 'Disabled opacity (e.g., 0.4, 0.5)',
      '--nsh-icon-stroke-width': 'Stroke weight for outline icons (e.g., 1.5, 2)',
    },
    route: '/showcase/icons',
    category: 'foundations',
    exampleProvider: () => foundationIconsExamples,
  },
];

export interface DocSection {
  category: DocCategory;
  entries: ReadonlyArray<DocEntry>;
}

export const DOC_SECTIONS: ReadonlyArray<DocSection> = DOC_CATEGORIES.map((category) => ({
  category,
  entries: DOC_ENTRIES.filter((entry) => entry.category === category.id),
}));

export function getDocEntry(id: string | null): DocEntry | null {
  if (!id) {
    return null;
  }
  return DOC_ENTRIES.find((entry) => entry.id === id) ?? null;
}
