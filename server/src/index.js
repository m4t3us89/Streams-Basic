import http from 'http'
import { Readable, Transform } from 'stream'
import { randomUUID } from 'crypto'
import { setTimeout   } from 'timers/promises'

function* run() {
    
    for(let index = 0; index <= 99; index++) {
      const data = {
        id: randomUUID(),
        name: `Erick-${index}`
      }

      yield data 
    }
  }
  

async function handler(request, response){

    const readable = new Readable({
        async read() {
          for(const data of run()) {
          
            this.push(JSON.stringify(data) + "\n\n\n\n")

          }
          this.push(null)
        }
    })

    const transform = new  Transform({
      async transform(chunk, e, cb){
        const item = JSON.parse(chunk)
        item.transform = true
        await setTimeout(1000)
      

        cb(null, JSON.stringify(item))
      }
    })
    
    readable.pipe(transform).pipe(response)
}


http.createServer(handler).listen(4000)