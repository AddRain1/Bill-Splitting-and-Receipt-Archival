import express from 'express';
import bodyParser from 'body-parser';
import imageRouter from './temproutes/image.js';
import expRateRouter from './temproutes/expense_rate.js'
import textRouter from './temproutes/text.js'
import itemRouter from './temproutes/item.js'
import receiptRouter from './temproutes/receipt.js'
import tipRouter from './temproutes/tip.js'
import taxRouter from './temproutes/tax.js'


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/receipts', imageRouter);
app.use('/receipts', expRateRouter);
app.use('/receipts', textRouter);
app.use('/receipts', itemRouter);
app.use('/receipts', receiptRouter);
app.use('/receipts', tipRouter);
app.use('/receipts', taxRouter);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});