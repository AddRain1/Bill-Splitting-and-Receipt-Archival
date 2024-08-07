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
    // Split each line
    const lines = text.split('\n');
    const items = [];
    const specialLines = { tax: null, tip: null, total: null};

    lines.forEach(line => {
      const itemMatch = line.match(/(.*)\s+(\d+\.\d{2})$/);
      const taxMatch = line.match(/\b(TAX|SALES TAX)\b/i);
      const tipMatch = line.match(/\b(TIP)\b/i);
      const totalMatch = line.match(/\b(TOTAL|SUBTOTAL|AMOUNT)\b/i);

      if (itemMatch) {
        items.push({ name: itemMatch[1].trim(), price: parseFloat(itemMatch[2]) });
      } else if (taxMatch) {
        const taxValue = line.match(/\d+\.\d{2}/);
        if (taxValue) specialLines.tax = parseFloat(taxValue[0]);
      } else if (tipMatch) {
        const tipValue = line.match(/\d+\.\d{2}/);
        if (tipValue) specialLines.tip = parseFloat(tipValue[0]);
      } else if (totalMatch) {
        const totalValue = line.match(/\d+\.\d{2}/);
        if (totalValue) specialLines.total = parseFloat(totalValue[0]);
      }
    });

    const itemResults = items.map(item => `${item.name}: $${item.price.toFixed(2)}`).join('\n');
    const specialResults = `
      Tax: ${specialLines.tax !== null ? `$${specialLines.tax.toFixed(2)}` : 'Not found'}
      Tip: ${specialLines.tip !== null ? `$${specialLines.tip.toFixed(2)}` : 'Not found'}
      Total: ${specialLines.total !== null ? `$${specialLines.total.toFixed(2)}` : 'Not found'}
    `;

    setSorted(`${itemResults}\n\n${specialResults}`);
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