export const iconGuide = `# Material Design Icons Reference

Idealyst uses Material Design Icons (@mdi/react) with **7,447 icons** available.

## Icon Usage

### TypeScript Type — CRITICAL

Icon names are typed as \`IconName\`, NOT \`string\`. Use **bare names** like \`'home'\`, \`'check-circle'\` — do NOT add an \`'mdi:'\` prefix.

When you create helper functions that return icon names, you MUST type them as \`IconName\`:

\`\`\`tsx
import type { IconName } from '@idealyst/components';

// CORRECT: return type is IconName
function getStatusIcon(status: string): IconName {
  switch (status) {
    case 'active': return 'check-circle';
    case 'pending': return 'clock-outline';
    default: return 'help-circle';
  }
}

// WRONG: return type 'string' will cause TS2322 error when passed to icon props
// function getStatusIcon(status: string): string { ... }  // ❌

// For icon lookup maps, type the values as IconName:
const FILE_TYPE_ICONS: Record<string, IconName> = {
  'image': 'file-image',
  'video': 'file-video',
  'audio': 'file-music',
  'document': 'file-document',
  'default': 'file',
};

function getFileIcon(type: string): IconName {
  return FILE_TYPE_ICONS[type] ?? FILE_TYPE_ICONS['default'];
}
\`\`\`

### When to Import \`Icon\` vs Use \`IconName\` Type

- Import the \`Icon\` component only when rendering a standalone icon as JSX: \`<Icon name="home" />\`
- For component props like \`leftIcon\` on Button, \`leading\`/\`trailing\` on ListItem — pass bare string names. Do NOT import the \`Icon\` component for this use.
- Import ONLY the \`IconName\` type (not the component) when you need a typed variable for an icon name:

\`\`\`tsx
import type { IconName } from '@idealyst/components';
const myIcon: IconName = 'home';  // Correct: type-only import
\`\`\`

### In Components

\`\`\`tsx
import { Button, Icon, List, Badge } from '@idealyst/components';

// Button with icon (use leftIcon, NOT icon)
<Button leftIcon="check">Save</Button>

// Standalone Icon
<Icon name="home" size="md" color="primary" />

// List with icons
<ListItem label="Settings" leading="cog" trailing="chevron-right" />

// Badge with icon
<Badge icon="star">Featured</Badge>
\`\`\`

### Icon Properties

\`\`\`tsx
<Icon
  name="home"                    // Icon name (required) — type: IconName
  size="xs|sm|md|lg|xl|number"   // Icon size
  color="primary|secondary|..."   // Theme color
/>
\`\`\`

## Common Icons by Category

### Navigation & Actions
- **home** - Home/dashboard
- **menu** - Hamburger menu
- **arrow-left** - Back/previous
- **arrow-right** - Forward/next
- **chevron-left** - Small back arrow
- **chevron-right** - Small forward arrow
- **chevron-up** - Collapse/up
- **chevron-down** - Expand/down
- **close** - Close/dismiss
- **check** - Confirm/success
- **plus** - Add/create
- **minus** - Remove/subtract
- **delete** - Delete/trash
- **dots-vertical** - More options (vertical)
- **dots-horizontal** - More options (horizontal)

### User & Account
- **account** - User profile
- **account-circle** - User avatar
- **account-multiple** - Multiple users/team
- **account-plus** - Add user
- **account-minus** - Remove user
- **account-edit** - Edit profile
- **account-cog** - User settings
- **login** - Login/sign in
- **logout** - Logout/sign out
- **account-key** - Authentication

### Communication
- **email** - Email/mail
- **email-outline** - Email outline variant
- **message** - Message/chat
- **message-text** - Text message
- **message-reply** - Reply to message
- **phone** - Phone/call
- **bell** - Notifications
- **bell-outline** - Notifications outline
- **comment** - Comment/feedback
- **forum** - Discussion/forum

### File & Document
- **file** - Generic file
- **file-document** - Document
- **file-pdf** - PDF file
- **file-image** - Image file
- **folder** - Folder
- **folder-open** - Open folder
- **download** - Download
- **upload** - Upload
- **attachment** - Attach file
- **cloud-upload** - Cloud upload
- **cloud-download** - Cloud download

### Media
- **play** - Play media
- **pause** - Pause media
- **stop** - Stop media
- **skip-next** - Next track
- **skip-previous** - Previous track
- **volume-high** - High volume
- **volume-low** - Low volume
- **volume-off** - Muted
- **image** - Picture/photo
- **camera** - Camera
- **video** - Video

### Edit & Create
- **pencil** - Edit
- **pencil-outline** - Edit outline
- **content-save** - Save
- **content-copy** - Copy
- **content-cut** - Cut
- **content-paste** - Paste
- **undo** - Undo
- **redo** - Redo
- **format-bold** - Bold text
- **format-italic** - Italic text
- **format-underline** - Underline text

### Status & Alerts
- **check-circle** - Success
- **check-circle-outline** - Success outline
- **alert** - Warning
- **alert-circle** - Alert circle
- **alert-octagon** - Critical alert
- **information** - Information
- **information-outline** - Info outline
- **help-circle** - Help/question
- **close-circle** - Error
- **clock** - Time/pending

### UI Elements
- **magnify** - Search
- **filter** - Filter
- **sort** - Sort
- **tune** - Settings/adjust
- **cog** - Settings
- **palette** - Theme/colors
- **eye** - View/visible
- **eye-off** - Hidden
- **heart** - Favorite/like
- **heart-outline** - Like outline
- **star** - Star/rating
- **star-outline** - Star outline
- **bookmark** - Bookmark
- **bookmark-outline** - Bookmark outline

### Shopping & Commerce
- **cart** - Shopping cart
- **cart-outline** - Cart outline
- **cash** - Money/payment
- **credit-card** - Credit card
- **tag** - Tag/label
- **sale** - Sale/discount
- **receipt** - Receipt
- **store** - Store/shop

### Social
- **share** - Share
- **share-variant** - Share variant
- **thumb-up** - Like/upvote
- **thumb-down** - Dislike/downvote
- **emoticon** - Emoji/mood
- **emoticon-happy** - Happy
- **emoticon-sad** - Sad

### Location & Map
- **map** - Map
- **map-marker** - Location pin
- **navigation** - Navigation
- **compass** - Compass
- **earth** - Globe/world

### Calendar & Time
- **calendar** - Calendar
- **calendar-today** - Today
- **calendar-month** - Month view
- **clock-outline** - Clock
- **timer** - Timer

### Device & Hardware
- **laptop** - Laptop
- **cellphone** - Mobile phone
- **tablet** - Tablet
- **desktop-mac** - Desktop
- **monitor** - Monitor
- **printer** - Printer
- **wifi** - WiFi
- **bluetooth** - Bluetooth

### Weather
- **weather-sunny** - Sunny
- **weather-cloudy** - Cloudy
- **weather-rainy** - Rainy
- **weather-snowy** - Snowy
- **weather-night** - Night
- **white-balance-sunny** - Light mode
- **weather-night** - Dark mode

## Finding Icons

### Total Available Icons
**7,447 icons** from Material Design Icons

### Browse All Icons
Visit: https://pictogrammers.com/library/mdi/

### Search Patterns
Icons follow naming patterns:
- Base name: \`home\`, \`account\`, \`file\`
- Variants: \`-outline\`, \`-filled\`, \`-off\`, \`-plus\`, \`-minus\`
- Combinations: \`account-plus\`, \`file-document-outline\`

### Common Suffixes
- **-outline**: Outline version
- **-off**: Disabled/off state
- **-plus**: Add/create
- **-minus**: Remove/subtract
- **-edit**: Edit action
- **-check**: Verified/checked
- **-alert**: Warning state

## Icon Naming Tips

1. **Be Specific**: Use descriptive names
   - ✅ \`account-circle\` for user avatar
   - ❌ \`user\` (not available)

2. **Check Variants**: Try outline versions
   - \`email\` and \`email-outline\`
   - \`heart\` and \`heart-outline\`

3. **Common Prefixes**:
   - \`account-*\`: User-related
   - \`file-*\`: File-related
   - \`folder-*\`: Folder-related
   - \`arrow-*\`: Arrows
   - \`chevron-*\`: Small arrows
   - \`content-*\`: Content actions

4. **Use Hyphens**: Icon names use kebab-case
   - ✅ \`arrow-left\`
   - ❌ \`arrowLeft\` or \`arrow_left\`

## Best Practices

1. **Semantic Meaning**: Choose icons that match their function
2. **Consistency**: Use the same icon for the same action throughout the app
3. **Size Appropriately**: Match icon size to context
4. **Color Purposefully**: Use theme colors for semantic meaning
5. **Accessibility**: Always provide labels/tooltips for icon-only buttons

## Examples

### Button Icons
\`\`\`tsx
<Button leftIcon="content-save">Save</Button>
<Button leftIcon="delete" intent="danger">Delete</Button>
<Button leftIcon="pencil">Edit</Button>
<Button leftIcon="plus">Add New</Button>
\`\`\`
> **Note:** Button uses \`leftIcon\` and \`rightIcon\` — NOT \`icon\`.

### List Icons
\`\`\`tsx
<ListItem label="Dashboard" leading="view-dashboard" />
<ListItem label="Users" leading="account-multiple" />
<ListItem label="Settings" leading="cog" />
<ListItem label="Logout" leading="logout" intent="danger" />
\`\`\`

### Navigation Icons
\`\`\`tsx
<Button leftIcon="arrow-left" type="text">Back</Button>
<Button leftIcon="menu" type="text">Menu</Button>
<Button leftIcon="close" type="text">Close</Button>
\`\`\`

### Status Icons
\`\`\`tsx
<Icon name="check-circle" color="success" />
<Icon name="alert-circle" color="warning" />
<Icon name="close-circle" color="danger" />
<Icon name="information-outline" color="primary" />
\`\`\`
`;
