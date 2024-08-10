import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

const images = [
  'https://i.imgur.com/96o4eI6.png',
  'https://i.imgur.com/VWwh7ZF.png',
  'https://i.imgur.com/Djd2l1R.png',
  'https://i.imgur.com/WaHn1zD.png',
  'https://i.imgur.com/JRjBASt.png',

]

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
  const { buttonValue, status } = c
  let currentIndex= 0


  const[action, index]= buttonValue ? buttonValue.split(':'):[]
  if(index){
    currentIndex=parseInt(index)
    if (action === 'next'){
      currentIndex = (currentIndex + 1)% images.length
    }else if (action === 'back'){
      currentIndex = (currentIndex - 1 + images.length)%images.length
    }
  }

  return c.res({
    title: "Who We Are",
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            display: 'flex',
            whiteSpace: 'pre-wrap',
          }}
        >
        </div>
        <img src = {images[currentIndex]} alt="Images" style= {{width: '100%'}}/>
      </div>
    ),
    intents: [
      <Button value={`back:${currentIndex}`}>GO BACK</Button>,
      <Button value={`next:${currentIndex}`}>NEXT</Button>
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
