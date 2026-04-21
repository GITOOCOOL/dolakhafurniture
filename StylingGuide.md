# 🏛 Styling Guide: Heritage Atelier

This guide is the **Source of Truth** for the Dolakha Furniture design system. 

> [!IMPORTANT]
> **GOVERNANCE PROTOCOL**: For any UI or layout changes, developers MUST review and adhere to this document. Any new colors, roles, or typographic scales must be added here first before being implemented in the codebase.

---

## 🎨 The 15-Color Semantic Inventory

Every color in the UI is tied to a **Literal Role**. Pick a color by its **Intent**.

### 1. Surfaces (Layout Containers)
| Token | Role | Light Mode | Dark Mode |
| :--- | :--- | :--- | :--- |
| `bg-app` | Main Page Background | Bone (#fdfaf5) | Olive (#1a1c13) |
| `bg-surface` | Card / Secondary background | Clay (#f2ece0) | Dark Olive (#24261b) |
| `bg-invert` | High-contrast backgrounds | Espresso (#1a1c13) | Bone (#fdfaf5) |

### 2. Typography (Content Hierarchy Color)
| Token | Role | Description |
| :--- | :--- | :--- |
| `text-heading` | **Primary Titles** | Used for all `h1`, `h2`, `h3` and bold titles. |
| `text-body` | **Main Content** | The primary reading text for the application. |
| `text-description` | **Secondary Info** | Used for muted descriptions, subtitles, and captions. |
| `text-label` | **Faint Metadata** | For tiny hints, placeholders, and subtle tags. |

### 3. Structural, Accents & Functional
| Token Category | Key Tokens | Description |
| :--- | :--- | :--- |
| **Structural** | `border-divider`, `border-soft` | Structural lines vs subtle card borders. |
| **Accents** | `accent-action`, `accent-warmth` | Terracotta highlights vs Ochre decorative warmth. |
| **Functional** | `accent-success`, `accent-danger` | Status signals, inventory badges, and alerts. |
| **Interaction** | `bg-overlay` | Solid 60% dimming for Sidebars/Modals. |

---

## 🖋 Ultra-Literal Typography Scale

Typographic roles bundle **Family, Size, Weight, and Case** into a single descriptive class. 

| Class | Role | Styling |
| :--- | :--- | :--- |
| `type-hero` | **Display Titles** | Serif, Italic, 6xl-9xl range, tight leading. |
| `type-section` | **Section Headers** | Serif, Italic, 3xl-5xl range. |
| `type-product` | **Product Focus** | Serif, Italic, Bold, lg-2xl range. |
| `type-body` | **Primary Reading** | Sans, Light, font-base/sm. |
| `type-label` | **Bento/Labeling** | Sans, Bold, XS, Uppercase, 0.4em tracking. |
| `type-action` | **Interaction** | Sans, Bold, XS, Uppercase, tracking-widest. |

---

## 🚫 The "Solid" Rule
We have rejected glassmorphism.
1. **No `backdrop-blur`**: All overlays must be solid colors.
2. **No Transparency**: Use solid `bg-app` or `bg-surface` for ribbons and tags.
3. **High Specificity**: Every component transition should be achieved via solid color shifts or border highlights.

---

## 🛠 Usage Example (The "Literal" Way)

```tsx
<div className="bg-surface border border-soft p-10 rounded-[3rem]">
  {/* Color: text-heading | Typo: type-product */}
  <h2 className="text-heading type-product">The Heritage Bed</h2>
  
  {/* Color: text-description | Typo: type-body */}
  <p className="text-description type-body mt-4">
    Built for endurance and soulful comfort.
  </p>
  
  <button className="bg-action text-app type-action px-8 py-4 rounded-full mt-8">
    Order Custom Piece
  </button>
</div>
```
