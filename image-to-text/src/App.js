import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);

  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = () => {
    if (!image) return;

    Tesseract.recognize(
      image, 'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .then(result => {
      setText(result.data.text);
    })
    .catch(err => {
      console.error(err);
      setText("An error occurred while processing the image.");
    });
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        {image && <img src={image} className="App-image" alt="uploaded" />}
        
        <h3>Extracted text</h3>
        <div className="text-box">
          <p>{text}</p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}>Convert to Text</button>
      </main>
    </div>
  );
}

export default App;
