import { app } from './app'

const port: number = 3333

app
  .listen({
    port,
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('Server is running on port ' + port)
  })
