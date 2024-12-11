import Anthropic from '@anthropic-ai/sdk' 
import  express from 'express'
import cors from    'cors'  


const app = express()
app.use(express.json())
app.use(cors())
import "dotenv/config.js";


const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY 

if (!API_KEY) {
    console.error("API_KEY is missing. Please set it in your .env file.");
    process.exit(1);
  }

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
        messages: [{ role: "user", content: "Hello, Claude" }],
      });
      res.send(msg);

})


const anthropic = new Anthropic({
  apiKey: `${API_KEY}`,
});

app.post('/bestmove', async (req, res) => {
    const {board, playerColor} = req.body
    
    if (!board || !playerColor) {
        return res.status(400).json({ error: 'Missing required board or playerColor in request body' })
    }

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            temperature: 0,
            messages: [
                {
                    "role": "user", 
                    "content": [
                        {
                            "type": "text",
                            "text": `You are an AI checkers moving assistant. Your task is to analyze the given board and determine the best move for the specified player color. Do not provide any explanation or reasoning for your move. Simply output the position you are moving from and the position you are moving to in chess notation.The current board state is represented as follows:<board>{${board}}</board>The color of the player to move is<player_color>{${playerColor}}</player_color>Analyze the board and determine the best move for the specified player color. Then, provide your move in the following format<move[starting position] [ending position</moveFor example, if you want to move a piece from e3 to d4, your output should look like this e3 d4 Remember, do not provide any explanation or additional information. Only output the move within the specified tags.`           
                        }
                    ]
                }
            ]
        });

        res.json(msg.content[0].text);
    } catch (error) {
        console.error('Error processing move:', error);
        res.status(500).json({ error: 'Failed to process move request' });
    }
})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})