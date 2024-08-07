import { useState} from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [imagePath, setImagePath] = useState(null);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sorted, setSorted] = useState("");

  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = async () => {
    if (!imagePath) return;

    setLoading(true);
  try {
    const result = await Tesseract.recognize( 
      imagePath, 'eng',
      { 
        logger: m => console.log(m),
        tessedit_char_whitelist: '0123456789.', 
      }
    );

    const extractedText = result.data.text;
    setText(extractedText);
    sortText(extractedText);
    } catch (error) {
      console.error(error);
      setText("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const sortText = (text) => {
  
    // What words to look for
    const wordPattern = /\b(TAX|TOTAL|SUBTOTAL|AMOUNT|TIP)\b/gi;
    const numberPattern = /\d+\.\d+/g;

    // Find matches
    const foundwords = text.match(wordPattern);
    const foundnumbers = text.match(numberPattern);

    // Results
    const wordsResult = foundwords ? foundwords.join(', ') : 'No matching words found';
    const numbersResult = foundnumbers ? foundnumbers.join(', ') : 'No matching numbers found';

    // Combine results
    const combinedResults = `Words: ${wordsResult}\nNumbers: ${numbersResult}`;
    setSorted(combinedResults);
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        {imagePath && <img src={imagePath} className="App-image" alt="uploaded" />}
        <h3>Extracted text</h3>
        <div className="text-box">
          {loading ? <p>Loading...</p> : <p>{text}</p>}
        </div>
        <div>
          <p> {sorted} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}>Convert to Text</button>
      </main>
    </div>
  );
}

export default App;