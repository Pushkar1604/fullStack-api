const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: "Full Stack API is running!",
    endpoints: {
      GET: "/bfhl",
      POST: "/bfhl"
    },
    usage: "Send POST request to /bfhl with JSON body: { data: [] }"
  });
});


const isNumber = (str) => !isNaN(str) && str.trim() !== '' && !isNaN(parseFloat(str));
const isAlphabet = (char) => /^[a-zA-Z]$/.test(char);
const isSpecialChar = (char) => /[^a-zA-Z0-9\s]/.test(char) && char.length === 1;

function processData(data) {
  const evenNumbers = [];
  const oddNumbers = [];
  const alphabets = [];
  const specialCharacters = [];
  let sum = 0;
  let alphaChars = [];

  data.forEach(item => {
    const strItem = String(item);
    
    if (isNumber(strItem)) {
      const num = parseInt(strItem);
      sum += num;
      if (num % 2 === 0) {
        evenNumbers.push(strItem); 
      } else {
        oddNumbers.push(strItem); 
      }
    } else if (strItem.length === 1 && isAlphabet(strItem)) {
      alphabets.push(strItem.toUpperCase());
      alphaChars.push(strItem);
    } else if (strItem.length === 1 && isSpecialChar(strItem)) {
      specialCharacters.push(strItem);
    } else {
      for (let char of strItem) {
        if (isAlphabet(char)) {
          alphabets.push(char.toUpperCase());
          alphaChars.push(char);
        } else if (isSpecialChar(char)) {
          specialCharacters.push(char);
        } else if (isNumber(char)) {
          const num = parseInt(char);
          sum += num;
          if (num % 2 === 0) {
            evenNumbers.push(char);
          } else {
            oddNumbers.push(char);
          }
        }
      }
    }
  });

  let concatString = '';
  alphaChars.reverse().forEach((char, index) => {
    concatString += index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
  });

  return {
    even_numbers: evenNumbers,
    odd_numbers: oddNumbers,
    alphabets: alphabets,
    special_characters: specialCharacters,
    sum: sum.toString(),
    concat_string: concatString
  };
}


app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input. 'data' must be an array."
      });
    }

    const result = processData(data);
    
    const full_name = "Pushkar Singh"; 
    const dob = "16042004"; 
    
    res.json({
      is_success: true,
      user_id: `${full_name}_${dob}`,
      email: "pushkarishu2004@gmail.com", 
      roll_number: "22BCY10084", 
      ...result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

app.get('/bfhl', (req, res) => {
  res.json({ 
    operation_code: 1
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});