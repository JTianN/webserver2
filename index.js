const express = require('express');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello, World! เข้าได้เเล้วน้ะจร้า');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
