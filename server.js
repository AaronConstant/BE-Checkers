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
                            "text": `You are an AI checkers moving assistant. Your task is to analyze the given board and determine the best move for the specified player color. Do not provide any explanation or reasoning for your move. Simply output the position you are moving from and the position you are moving to in chess notation.
                            The current board state is represented as follows:<board>{${board}}</board>The color of the player to move is:<player_color>{${playerColor}}</player_color>Analyze the board and determine the best move for the specified player color. Then, provide your move in the following format:[starting position] [ending position]For example, if you want to move a piece from e3 to d4, your output should look like this:e3 d4
                            Remember, do not provide any explanation or additional information. Only output the move within the specified tags.`           
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

app.post('/botmove', async (req, res) => {
    try {
      const { board, playerColor, difficulty } = req.body
    
      const anthropic = new Anthropic({
          apiKey: `${API_KEY}`,
        });
        const msg =  await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [{ role: "user", content:`You are an AI checkers bot. Your task is to make a move given a board state, your color, and a difficulty level. You will receive three inputs:

<board_state>
{${board}}
</board_state>

This represents the current state of the checkers board. It is an 8x8 matrix where:
"" represents an empty square
"r" represents a red piece
"R" represents a red king
"b" represents a black piece
"B" represents a black king

Your color is:
<player_color>
{${playerColor}}
</player_color>

The difficulty level is:
<difficulty>
{${difficulty}}
</difficulty>

The board uses a 0-indexed coordinate system, where [0,0] is the top-left corner and [7,7] is the bottom-right corner. You will stick to one orientation and one oriention only, the BLACK PIECES WILL ALWAYS BE ON THE TOP AND THE RED PIECES WILL ALWAYS BE ON THE BOTTOM of the grid

    // Row 0 (top)     //col 0 1 2 3 4 5 6 7
    // Row 1
    // Row 2
    // Row 3
    // Row 4
    // Row 5
    // Row 6
    // Row 7 (bottom)
];".

Analyze the board state and determine all legal moves for your color. The rules for legal moves are:
1. Regular pieces can only move diagonally forward.
2. Kings can move diagonally in any direction.
3. If a jump is available, it must be taken.
4. Multiple jumps in a single turn are allowed and must be taken if available.

Choose the best move based on your analysis and the given difficulty level:
- For "easy" difficulty, choose a random legal move.
- For "medium" difficulty, prioritize jumps and moves that protect your pieces.
- For "hard" difficulty, use advanced strategies like controlling the center, setting up multiple jumps, and creating king pieces.

Output ONLY the coordinates of your chosen move in the format "start_row,start_col end_row,end_col". Do not provide any explanation or additional text.

For example, if you decide to move a piece from [2,1] to [3,2], your entire output should be:
"2,1 3,2"

Remember, provide ONLY the move coordinates within a space between the two coordinates. No other text or explanation should be included in your response.` }],
        });

        res.send(msg.content[0].text);
  
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})

// app.post('/generate-powerups', async (req, res) => {
//     const { board } = req.body
    
//     if (!board) {
//         return res.status(400).json({ error: 'Missing required board in request body' })
//     }

//     try {
//         const msg = await anthropic.messages.create({
//             model: "claude-3-5-sonnet-20241022",
//             max_tokens: 1000,
//             temperature: 0.8,
//             messages: [
//                 {
//                     "role": "user",
//                     "content": [
//                         {
//                             "type": "text",
//                             "text": `You are tasked with generating 4 random power-up tiles on a game board. Here is the current state of the board:
//                             <board_state>${board}</board_state>
                            
//                             Your task is to place 4 random power-up tiles on empty black tiles of the board. The power-ups should be one of each of the following types:
//                             1. Invincibility: Allows the character to be invincible
//                             2. Temporary King: Creates a temporary king tile
//                             3. Teleport: Teleports a character to another spot
//                             4. Freeze: Freezes a character in position
                            
//                             Follow these steps:
//                             1. Identify all empty black tiles on the board.
//                             2. Randomly select 4 of these empty black tiles.
//                             3. For each selected tile, randomly assign one of the four power-up types (ensuring each type is used exactly once).
                            
//                             Generate your response in the following format:
//                             <power_ups>
//                             1. [Coordinates of tile 1]: [Power-up type 1]
//                             2. [Coordinates of tile 2]: [Power-up type 2]
//                             3. [Coordinates of tile 3]: [Power-up type 3]
//                             4. [Coordinates of tile 4]: [Power-up type 4]
//                             </power_ups>
                            
//                             Coordinates should be given as (row, column), with (0, 0) being the top-left corner of the board.
                            
//                             If there are not enough empty black tiles to place all 4 power-ups, output:
//                             <error>Insufficient empty black tiles to place all power-ups.</error>`
//                         }
//                     ]
//                 }
//             ]
//         });

//         res.json(msg.content[0].text);
//     } catch (error) {
//         console.error('Error generating power-ups:', error);
//         res.status(500).json({ error: 'Failed to generate power-ups' });
//     }
// })
