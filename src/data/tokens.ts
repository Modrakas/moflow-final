export const TOKENS = {
  ease: {
    base:   'power3.out',  // used on majority of reveals
    strong: 'power4.out',  // used on headlines and hero
  },
  duration: {
    xs:   0.6,   // fast — capability items
    sm:   0.7,   // work header label
    base: 0.8,   // default — most reveals
    md:   0.9,   // headlines, project cards
    lg:   1.1,   // hero headline — the big entrance
  }
} as const;