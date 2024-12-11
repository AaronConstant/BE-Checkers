import Anthropic from '@anthropic-ai/sdk' 
import  express from 'express'


const app = express()

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

app.get('/',async (req,res)=> {
    const updatedBoard = []
    
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
                "text": "You are an AI assistant tasked with recommending the best move in a game of checkers. You will be given the current board state, your player color, and the opponent's recent moves. Your goal is to analyze the situation and suggest the most strategic move.\n\nFirst, here is the current board state:\n<board_state>\n{{BOARD_STATE}}\n</board_state>\n\nYou are playing as the {{PLAYER_COLOR}} pieces.\n\nThe opponent's recent moves have been:\n<opponent_moves>\n{{OPPONENT_MOVES}}\n</opponent_moves>\n\nBefore making your recommendation, please keep in mind the following rules and objectives of checkers:\n1. Regular pieces can only move diagonally forward.\n2. Kings can move diagonally both forward and backward.\n3. Captures are mandatory if available.\n4. Multiple captures in a single turn are allowed and mandatory if possible.\n5. The goal is to capture all of the opponent's pieces or block them so they cannot move.\n\nNow, please analyze the board state carefully. Consider the following:\n1. Available moves for your pieces\n2. Potential captures\n3. Defensive positions to protect your pieces\n4. Opportunities to create kings\n5. The opponent's possible counter-moves\n\nAfter your analysis, provide your reasoning for the best move in a <reasoning> tag. Include why you believe this move is the most strategic option, considering both offensive and defensive aspects.\n\nFinally, recommend the best move in a <move> tag. Use standard checkers notation to describe the move (e.g., \"11-15\" for moving a piece from square 11 to square 15).\n\nRemember to consider all possible moves and their potential consequences before making your final recommendation."
            }
            ]
        }
        ]
    });

    res.send(updatedBoard.push(msg[0].text))
    console.log(updatedBoard);
})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})