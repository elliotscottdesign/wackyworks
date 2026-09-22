// Flat key → default value map used as the fallback whenever a
// page_content row is empty. The public site reads it via useContent
// so nothing renders blank; the admin form uses it to pre-fill
// inputs so the founder can see what's on the live site and edit
// from there.
import {
  CONTACT,
  INTRO,
  OBSTACLES,
  FINISHES,
  SERVICES,
  PACKAGES,
  PACKAGE_NOTES,
  PRICING_SHEET,
} from './catalog'

function build() {
  const map = {
    // Header
    'header.wordmark_1': 'WACKY',
    'header.wordmark_2': 'WORKS',
    'header.email': CONTACT.displayEmail,
    'header.nav':
      'Obstacles | #obstacles\nFinishes | #finishes\nServices | #services\nPackages | #packages',

    // Hero
    'hero.eyebrow': 'Adventure Golf · Designed · Built · Themed',
    'hero.headline_1': 'We build worlds',
    'hero.headline_2': 'you play through.',
    'hero.subhead':
      'Wacky Works designs and builds crazy golf courses — modular, shippable, and hand-finished. From the natural finish to fully themed sculpted worlds, every course installs with local labour and stands the test of a busy venue.',
    'hero.cta_label': 'Start a project',

    // Craft
    'craft.eyebrow': INTRO.eyebrow,
    'craft.stat': INTRO.stat,
    'craft.stat_label': INTRO.statLabel,
    'craft.body': INTRO.body,
    'craft.layout_image': INTRO.layout,

    // Obstacles section header
    'obstacles.eyebrow': 'Modular obstacles',
    'obstacles.title': 'The Obstacles',
    'obstacles.intro':
      'Fourteen tried-and-tested pieces. Arrange them any way you like — swap holes in later years, retrofit new theming, keep customers coming back.',

    // Finishes section header
    'finishes.eyebrow': 'Theming & finishing',
    'finishes.title': 'Three Finishes',
    'finishes.intro':
      'Pick a finish for the course. Move up a tier later — every finish sits on the same modular obstacles.',

    // Services section header
    'services.eyebrow': 'Beyond the course',
    'services.title': 'Additional Services',
    'services.intro':
      'From branding a single hole to designing the whole venue — bar, garden, signage and all.',

    // Packages section header + notes + reference sheet
    'packages.eyebrow': '9-hole course · turn-key',
    'packages.title': 'Packages',
    'packages.intro':
      'Three turn-key packages for a 9-hole course. Every line is cherry-pickable — take the whole pack or only the pieces you need.',
    'packages.notes': PACKAGE_NOTES.join('\n'),
    'packages.reference_sheet': PRICING_SHEET,

    // CTA
    'cta.eyebrow': 'Ready when you are',
    'cta.headline_1': 'No project is',
    'cta.headline_2': 'too ambitious.',
    'cta.body':
      "Every course starts with a conversation. Tell us the space, the vibe and the budget — we'll design around it.",

    // Footer
    'footer.address': CONTACT.address,
    'footer.company': CONTACT.company,
  }

  OBSTACLES.forEach((o, i) => {
    const n = i + 1
    map[`obstacles.item_${n}.name`] = o.name
    map[`obstacles.item_${n}.size`] = o.size
    map[`obstacles.item_${n}.image`] = o.img
    map[`obstacles.item_${n}.blurb`] = o.blurb
  })

  FINISHES.forEach((f, i) => {
    const n = i + 1
    map[`finishes.item_${n}.name`] = f.name
    map[`finishes.item_${n}.image`] = f.img
    map[`finishes.item_${n}.tagline`] = f.tagline
    map[`finishes.item_${n}.price`] = f.price
    map[`finishes.item_${n}.includes`] = f.includes.join('\n')
  })

  SERVICES.forEach((s, i) => {
    const n = i + 1
    map[`services.item_${n}.name`] = s.name
    map[`services.item_${n}.image`] = s.img
    map[`services.item_${n}.detail`] = s.detail
  })

  PACKAGES.forEach((p, i) => {
    const n = i + 1
    map[`packages.item_${n}.name`] = p.name
    map[`packages.item_${n}.total`] = p.total
    map[`packages.item_${n}.lines`] = p.lines.map((l) => `${l.item} | ${l.amount}`).join('\n')
  })

  return map
}

export const FALLBACKS = build()

// Helper used by both the public site and the admin form.
export function fallbackFor(key) {
  return FALLBACKS[key] ?? ''
}
