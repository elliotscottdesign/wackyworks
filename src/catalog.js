// Add a new project by appending an entry here and dropping images
// into public/catalog/<slug>/. Everything else on the site reads from
// this file — no per-project component to touch.

export const PROJECTS = [
  {
    slug: 'lost-emerald-ruins',
    title: 'The Lost Emerald Ruins',
    tag: 'Immersive adventure golf · 9 holes',
    year: '2026',
    location: 'Client venue',
    status: 'In build',
    cover: '/catalog/lost-emerald-ruins/cover.jpg',
    gallery: [
      '/catalog/lost-emerald-ruins/cover.jpg',
      '/catalog/lost-emerald-ruins/layout.jpg',
      '/catalog/lost-emerald-ruins/hole.jpg',
      '/catalog/lost-emerald-ruins/host-desk.jpg',
      '/catalog/lost-emerald-ruins/exterior.jpg',
    ],
    summary:
      'Nine-hole immersive course themed around a lost jungle temple — gravity-defying loops, balancing challenges, moving targets and hand-painted murals throughout.',
  },
]

export const CONTACT = {
  email: 'elliot@wackyworks.co.uk',
  displayEmail: 'elliot@wackyworks.co.uk',
  address: 'London Fields · Hackney · E8',
  company: 'Wacky Works Ltd',
}
