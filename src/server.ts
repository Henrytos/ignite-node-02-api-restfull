import { app } from './app'

const port: number = 3333

app
  .listen({
    port,
  })
  .then(() => {
    console.log('Server is running on port ' + port)
  })
