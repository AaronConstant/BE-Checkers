// import app frwom 'app.js'
import Anthropic from '@anthropic-ai/sdk' 
import "dotenv/config.js";



(async() => {
    const API_KEY = process.env.API_KEY
    
    const anthropic = new Anthropic({
        apiKey: `${API_KEY}`,
    });

    const msg =  await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello, Claude" }],
    });

    res.send(msg)
})
