// import Anthropic from '@anthropic-ai/sdk' 
// require('dotenv').config()

// const CLOUD_API_KEY = process.env.CLOUD_API_KEY

// console.log(CLOUD_API_KEY)


// const PORT = process.env.PORT;
// const cors = require('cors')
// const express = require('express')
// const app = express()


// app.use(cors())
// app.use(express.json())

// app.get('/', (req,res) => {
//     res.send('Welcome to Checkers')
// })

// app.get('/ai', (req,res)=> {

//     const anthropic = new Anthropic({
//         apiKey: `${CLOUD_API_KEY}`,
//       });
  
//       const msg =  anthropic.messages.create({
//         model: "claude-3-5-sonnet-20241022",
//         max_tokens: 1024,
//         messages: [{ role: "user", content: "Hello, Claude" }],
//       });
//       console.log(msg);
//       return msg

// })


// app.listen(PORT, () => {
//     console.log(`Listening to PORT: ${PORT}`)
// })

// export default app;