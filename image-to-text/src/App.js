import { useState} from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [imagePath, setImagePath] = useState(null);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sorted, setSorted] = useState(null);

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
    // Split each line by deciaml
    const regex = /(.*?)(\s+\d+\s+)(\d+\.\d{2})(?!\d)/g;
    let match;
    const items = [];
    const specialLines = { tax: null, tip: null, total: null};

    while ((match = regex.exec(text)) !== null) {
      const [_, itemName, itemId, price] = match;
      const trimmedName = itemName.trim();
      const trimmedId = itemId.trim();
      const parsedPrice = parseFloat(price);
  
      const taxMatch = trimmedName.match(/\b(TAX|SALES TAX)\b(AX)/i) || trimmedId.match(/\b(TAX|SALES TAX)\b(AX)/i);
      const tipMatch = trimmedName.match(/\b(TIP)\b/i) || trimmedId.match(/\b(TIP)\b/i);
      const totalMatch = trimmedName.match(/\b(TOTAL|SUBTOTAL|AMOUNT)\b/i) || trimmedId.match(/\b(TOTAL|SUBTOTAL|AMOUNT)\b/i);

      if (taxMatch) {
        specialLines.tax = parsedPrice;
      } else if (tipMatch) {
        specialLines.tip = parsedPrice;
      } else if (totalMatch) {
        specialLines.total = parsedPrice;
      }
      else {
        items.push({ name: itemName, price: parsedPrice });
      }
    }

    const itemResults = items.map(item => `${item.name}: $${item.price.toFixed(2)}`).join('\n');
    const specialResults = `
      Tax: ${specialLines.tax !== null ? `$${specialLines.tax.toFixed(2)}` : 'Not found'}
      Tip: ${specialLines.tip !== null ? `$${specialLines.tip.toFixed(2)}` : 'Not found'}
      Total: ${specialLines.total !== null ? `$${specialLines.total.toFixed(2)}` : 'Not found'}
    `;

    setSorted(`${itemResults}\n\n${specialResults.trim()}`);
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