// import app from 'app.js'
import Anthropic from '@anthropic-ai/sdk' 
import  express from 'express'

const app = express()

import "dotenv/config.js";

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY 

app.get('/', (req,res) => {
    res.send('Welcome to Checkers')
})

app.get('/ai', async (req,res)=> {

    const anthropic = new Anthropic({
        apiKey: `${API_KEY}`,
      });
  
      const msg =  await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user",type:"text", content: "Hello, Claude" }],
      });
      res.send(msg);

})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})