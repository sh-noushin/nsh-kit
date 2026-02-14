/**
 * Signal descriptions mapping
 * Provides user-friendly descriptions for all component signals
 */

export const SIGNAL_DESCRIPTIONS: Record<string, Record<string, string>> = {
  // Avatar Component
  avatar: {
    alt: 'Alternative text for the avatar image, displayed if the image fails to load',
    ariaLabel: 'Accessible aria-label attribute for screen readers',
    initials: 'Two-letter initials displayed when no image is provided',
    name: 'Full name of the person, used as fallback display text',
    shape: 'Visual shape of the avatar: "circle" or "square"',
    size: 'Size variant: "xs" (extra small), "sm" (small), "md" (medium), "lg" (large), or "xl" (extra large)',
    src: 'URL/path to the avatar image',
    status: 'Status indicator: "online", "offline", "busy", or "away"',
  },

  // Badge Component
  badge: {
    content: 'Text or number to display inside the badge',
    variant: 'Visual style: "primary", "secondary", "success", "warning", "error", or "info"',
  },

  // Button Component
  button: {
    ariaLabel: 'Accessible label announced by screen readers (required for icon-only buttons).',
    color:
      'Color key: "primary", "secondary", "tertiary", "success", "warn", "danger", or "neutral".',
    disabled: 'Whether the button is disabled and cannot be interacted with',
    loading: 'Whether to show a loading state with spinner',
    variant: 'Visual style: "filled", "tonal", "outlined", or "text".',
    size: 'Button size: "sm" (small), "md" (medium), or "lg" (large)',
    leadingIcon:
      'Icon name from the registered icon set shown before the label (for example: "home", "settings", "favorite").',
    trailingIcon:
      'Icon name from the registered icon set shown after the label (for example: "chevron-right", "check").',
  },

  // Card Component
  card: {
    title: 'Card title or header text',
    subtitle: 'Optional subtitle displayed under the title',
    padding: 'Internal spacing: "none", "sm", "md", or "lg"',
    elevation: 'Shadow/elevation level for depth perception',
  },

  // Input Component
  input: {
    type: 'Input type: "text", "email", "password", "number", "date", etc.',
    placeholder: 'Light hint text shown when input is empty',
    value: 'Current input value',
    disabled: 'Whether the input is disabled',
    readonly: 'Whether the input value cannot be changed',
    required: 'Whether a value must be entered',
    inputValue: 'Two-way binding for the input value',
    pattern: 'Regular expression pattern for validation',
  },

  // Textarea Component
  textarea: {
    placeholder: 'Light hint text shown when textarea is empty',
    value: 'Current textarea value',
    disabled: 'Whether the textarea is disabled',
    readonly: 'Whether the value cannot be changed',
    required: 'Whether a value must be entered',
    rows: 'Number of visible rows/lines',
    maxlength: 'Maximum number of characters allowed',
  },

  // Checkbox Component
  checkbox: {
    value: 'The value associated with this checkbox',
    checked: 'Whether the checkbox is currently checked',
    disabled: 'Whether the checkbox cannot be interacted with',
    indeterminate: 'Whether the checkbox shows intermediate/partial state',
  },

  // Radio Component
  radio: {
    value: 'The value associated with this radio button',
    checked: 'Whether this radio button is selected',
    disabled: 'Whether the radio cannot be selected',
    name: 'Name of the radio group for grouping related options',
  },

  // Switch Component
  switch: {
    checked: 'Whether the switch is in the on/enabled state',
    disabled: 'Whether the switch cannot be toggled',
  },

  // Slider Component
  slider: {
    min: 'Minimum value of the slider range',
    max: 'Maximum value of the slider range',
    value: 'Current selected value',
    step: 'Increment/decrement amount per step',
    disabled: 'Whether the slider cannot be adjusted',
  },

  // Select Component
  select: {
    options: 'Array of available options to choose from',
    value: 'Currently selected option value',
    placeholder: 'Hint text shown when no option is selected',
    disabled: 'Whether the select cannot be opened/changed',
    multiple: 'Whether multiple options can be selected at once',
  },

  // Chips Component
  chips: {
    value: 'Array of chip values/items',
    disabled: 'Whether chips cannot be removed',
    removable: 'Whether users can delete individual chips',
  },

  // List Component
  list: {
    items: 'Array of items to display in the list',
    selectable: 'Whether list items can be selected',
    selectedItem: 'Currently selected item',
  },

  // List Item Component
  listItem: {
    value: 'Value associated with this list item',
    selected: 'Whether this item is currently selected',
    disabled: 'Whether this item cannot be selected',
  },

  // Menu Component
  menu: {
    items: 'Array of menu items with labels and actions',
    open: 'Whether the menu is currently visible',
  },

  // Toolbar Component
  toolbar: {
    title: 'Main title/heading displayed in the toolbar',
    subtitle: 'Additional descriptive text below the title',
    actions: 'Array of action buttons or controls in the toolbar',
  },

  // Tabs Component
  tabs: {
    selectedTab: 'Index or identifier of the currently active tab',
    tabs: 'Array of tab definitions with labels and content',
    animated: 'Whether tab changes include animation effects',
  },

  // Table Component
  table: {
    columns: 'Array defining column headers and data properties',
    rows: 'Array of data rows to display in the table',
    sortable: 'Whether columns can be sorted by clicking headers',
    selectable: 'Whether table rows can be selected with checkboxes',
  },

  // Stepper Component
  stepper: {
    steps: 'Array of step definitions with labels and validation',
    activeStep: 'Index of the currently active/displayed step',
    linear: 'Whether steps must be completed in order',
  },

  // Progress Component
  progress: {
    value: 'Current progress value (0-100)',
    max: 'Maximum progress value',
    determinate: 'Whether progress is determined (true) or indeterminate (false)',
  },

  // Spinner Component
  spinner: {
    diameter: 'Size of the spinner in pixels',
    strokeWidth: 'Thickness of the spinner stroke',
  },

  // Skeleton Component
  skeleton: {
    width: 'Width of the skeleton placeholder',
    height: 'Height of the skeleton placeholder',
    variant: 'Shape variant: "circle", "text", "rectangular", or "rounded"',
  },

  // Paginator Component
  paginator: {
    length: 'Total number of items being paginated',
    pageSize: 'Number of items per page',
    pageSizeOptions: 'Array of available page size choices',
    pageIndex: 'Index of the currently displayed page',
  },

  // Breadcrumb Component
  breadcrumb: {
    items: 'Array of breadcrumb items with labels and routes',
    separator: 'Custom separator character between items',
  },

  // Divider Component
  divider: {
    vertical: 'Whether divider displays vertically (true) or horizontally (false)',
    margin: 'Spacing around the divider',
  },

  // Empty State Component
  emptyState: {
    title: 'Main heading for the empty state message',
    message: 'Descriptive text explaining why the state is empty',
    icon: 'Icon name to display in empty state',
    actionText: 'Text for the action/call-to-action button',
  },

  // Sort Directive
  sort: {
    active: 'ID of the currently active sorted column',
    direction: 'Sort direction: "asc" (ascending), "desc" (descending), or ""',
  },

  // Form Field Component
  formField: {
    label: 'Label text displayed above the form field',
    hint: 'Helper text displayed below the form field',
    error: 'Error message displayed when validation fails',
    required: 'Whether this form field is required',
    state: 'Current field state: "valid", "invalid", "error", or "warning"',
  },

  // Autocomplete Component
  autocomplete: {
    options: 'Array of autocomplete suggestion options',
    value: 'Current input value being autocompleted',
    disabled: 'Whether autocomplete is disabled',
    minChars: 'Minimum characters typed before showing suggestions',
    placeholder: 'Hint text for the autocomplete input',
  },

  // Dialog Component
  dialog: {
    isOpen: 'Whether the dialog is currently visible',
    title: 'Title/header text of the dialog',
    message: 'Main content/message displayed in the dialog',
    closeButton: 'Whether to show a close button',
    cancelText: 'Text for the cancel/dismiss button',
    confirmText: 'Text for the confirm/action button',
  },

  // Snackbar Component
  snackbar: {
    message: 'Message text displayed in the snackbar notification',
    duration: 'Auto-hide duration in milliseconds (0 = no auto-hide)',
    action: 'Optional action button text',
    type: 'Type: "default", "success", "error", "warning", or "info"',
  },

  // Tooltip Directive
  tooltip: {
    content: 'Text content displayed when hovering over the element',
    position: 'Tooltip position: "top", "right", "bottom", or "left"',
    delay: 'Delay in milliseconds before showing tooltip',
    disabled: 'Whether the tooltip is disabled',
  },

  // Sidenav Component
  sidenav: {
    opened: 'Whether the sidenav is currently visible',
    mode: 'Display mode: "side", "over", or "push"',
    autosize: 'Whether to automatically adjust width to content',
  },

  // Icon Registry
  icon: {
    name: 'Name of the icon to display',
    library: 'Icon library/set to use',
    size: 'Icon size: "sm", "md", "lg", etc.',
  },
};

const COMMON_SIGNAL_DESCRIPTIONS: Record<string, string> = {
  ariaLabel: 'Accessible label announced by screen readers.',
  alt: 'Alternative text used for accessibility and image fallback.',
  value: 'Current value for this property.',
  disabled: 'Whether the control is disabled and cannot be interacted with.',
  readonly: 'Whether the value is read-only and cannot be edited.',
  required: 'Whether this value is required.',
  placeholder: 'Hint text shown when no value is provided.',
  label: 'Visible label text for the control.',
  id: 'Unique identifier for this element or item.',
  name: 'Name used for display or grouping.',
  color: 'Visual color variant used by the component.',
  size: 'Visual size variant used by the component.',
  variant: 'Visual appearance variant for this component.',
  type: 'Type variant that controls behavior or appearance.',
  open: 'Whether the element is currently open.',
  opened: 'Whether the element is currently opened.',
  position: 'Placement or alignment position.',
};

function toHumanLabel(signalName: string): string {
  return signalName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase();
}

function fallbackDescription(signal: string, kind: 'input' | 'output' | 'model', type?: string): string {
  const label = toHumanLabel(signal);

  if (kind === 'output') {
    return `Event emitted for ${label}.`;
  }

  if (kind === 'model') {
    return type
      ? `Two-way bound model value for ${label}. Type: ${type}.`
      : `Two-way bound model value for ${label}.`;
  }

  return type ? `Input value for ${label}. Type: ${type}.` : `Input value for ${label}.`;
}

/**
 * Get description for a signal
 * @param component Component entry ID
 * @param signal Signal name
 * @returns Description or undefined if not found
 */
export function getSignalDescription(
  component: string,
  signal: string,
  kind: 'input' | 'output' | 'model' = 'input',
  type?: string
): string {
  return (
    SIGNAL_DESCRIPTIONS[component]?.[signal] ??
    COMMON_SIGNAL_DESCRIPTIONS[signal] ??
    fallbackDescription(signal, kind, type)
  );
}
