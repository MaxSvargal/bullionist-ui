import glamorous from 'glamorous'

export const Container = glamorous.div({
  height: '100vh',
  display: 'grid',
  grid: '1fr / 5rem 1fr',
  gridTemplateAreas: `
    "sidebar main"
  `,
  '@media(max-width: 600px)': {
    grid: 'auto 4rem / 1fr',
    gridTemplateAreas: `
      "main"
      "footer"
    `
  }
})

export const MenuContainer = glamorous.div({
  gridArea: 'sidebar',
  '@media(max-width: 600px)': {
    gridArea: 'footer',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw'
  }
})

export const Main = glamorous.div({
  gridArea: 'main',
  overflow: 'scroll'
})