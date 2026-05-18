const http = require('http');
const PORT = process.env.PORT || 3000;

let stockData = null;

const STOCK_INICIAL = {"items":[
  {"id":1,"pallet":1,"mat":"Galvanizada","esp":"0.5mm","med":"1200x2500","tipo":"Entera","qty":7},
  {"id":2,"pallet":1,"mat":"Galvanizada","esp":"0.8mm","med":"1200x1300","tipo":"Recorte","qty":6},
  {"id":3,"pallet":1,"mat":"Galvanizada","esp":"2mm","med":"1200x2500","tipo":"Entera","qty":1},
  {"id":4,"pallet":2,"mat":"Inox 304","esp":"0.5mm","med":"1250x2500","tipo":"Entera","qty":5},
  {"id":5,"pallet":2,"mat":"Inox 304","esp":"1.2mm","med":"1300x1300","tipo":"Recorte","qty":1},
  {"id":6,"pallet":2,"mat":"Inox 304","esp":"1mm","med":"1500","tipo":"—","qty":1},
  {"id":7,"pallet":3,"mat":"Inox 304","esp":"2mm","med":"—","tipo":"Entera","qty":3},
  {"id":8,"pallet":3,"mat":"Inox 304","esp":"2mm","med":"—","tipo":"Recorte grande","qty":1},
  {"id":9,"pallet":3,"mat":"Inox 304","esp":"2.5mm","med":"1500x2300","tipo":"Recorte","qty":1},
  {"id":10,"pallet":3,"mat":"Inox 316","esp":"2mm","med":"950x1500","tipo":"Recorte","qty":1},
  {"id":11,"pallet":3,"mat":"Inox 316","esp":"2mm","med":"1500x1500","tipo":"Recorte","qty":1},
  {"id":12,"pallet":4,"mat":"Inox 304","esp":"1.2mm","med":"—","tipo":"—","qty":3},
  {"id":13,"pallet":5,"mat":"Inox 304","esp":"4mm","med":"1000x1500","tipo":"Recorte","qty":1},
  {"id":14,"pallet":5,"mat":"Inox 304","esp":"5mm","med":"—","tipo":"—","qty":1},
  {"id":15,"pallet":5,"mat":"Inox 304","esp":"6mm","med":"900x1300","tipo":"Recorte","qty":1},
  {"id":16,"pallet":5,"mat":"Inox 304","esp":"10mm","med":"600x1100","tipo":"Recorte","qty":1},
  {"id":17,"pallet":6,"mat":"Acero Carbono","esp":"1.5mm","med":"—","tipo":"—","qty":1},
  {"id":18,"pallet":6,"mat":"Acero Carbono","esp":"2mm","med":"760x1500","tipo":"Recorte","qty":1},
  {"id":19,"pallet":6,"mat":"Acero Carbono","esp":"3mm","med":"1200x1500","tipo":"Recorte","qty":1},
  {"id":20,"pallet":6,"mat":"Acero Carbono","esp":"5mm","med":"1500x1500","tipo":"Recorte","qty":1},
  {"id":21,"pallet":6,"mat":"Acero Carbono","esp":"6mm","med":"200x1500","tipo":"Recorte","qty":1},
  {"id":22,"pallet":6,"mat":"Acero Carbono","esp":"6mm","med":"1100x1500","tipo":"Recorte","qty":1},
  {"id":23,"pallet":7,"mat":"Acero Corten","esp":"2mm","med":"—","tipo":"Entera","qty":1},
  {"id":24,"pallet":7,"mat":"Acero Corten","esp":"2mm","med":"1200x1500","tipo":"Recorte","qty":1},
  {"id":25,"pallet":7,"mat":"Acero Corten","esp":"3mm","med":"—","tipo":"Entera","qty":1},
  {"id":26,"pallet":7,"mat":"Acero Corten","esp":"3mm","med":"1470x1220","tipo":"Recorte","qty":1},
  {"id":27,"pallet":8,"mat":"Acero Carbono","esp":"1.5mm","med":"—","tipo":"Entera","qty":2},
  {"id":28,"pallet":8,"mat":"Acero Carbono","esp":"2mm","med":"—","tipo":"Entera","qty":4},
  {"id":29,"pallet":8,"mat":"Acero Descapado","esp":"1.5mm","med":"—","tipo":"Entera","qty":2},
  {"id":30,"pallet":8,"mat":"Acero Descapado","esp":"2mm","med":"—","tipo":"Entera","qty":2},
  {"id":31,"pallet":8,"mat":"Acero Descapado","esp":"2mm","med":"1000x2000","tipo":"Recorte","qty":1},
  {"id":32,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"—","tipo":"Entera","qty":2},
  {"id":33,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2000x460","tipo":"Recorte","qty":1},
  {"id":34,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1220x1000","tipo":"Recorte","qty":1},
  {"id":35,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1225x920","tipo":"Recorte","qty":1},
  {"id":36,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2070x450","tipo":"Recorte","qty":1},
  {"id":37,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"1220x655","tipo":"Recorte","qty":1},
  {"id":38,"pallet":8,"mat":"Acero Descapado","esp":"3mm","med":"2350x460","tipo":"Recorte","qty":1},
  {"id":39,"pallet":9,"mat":"Acero Carbono","esp":"6mm","med":"1500x1500","tipo":"Entera","qty":1},
  {"id":40,"pallet":9,"mat":"Acero Carbono","esp":"6mm","med":"—","tipo":"Entera","qty":1},
  {"id":41,"pallet":9,"mat":"Acero Carbono","esp":"8mm","med":"—","tipo":"Entera","qty":1},
  {"id":42,"pallet":9,"mat":"Acero Carbono","esp":"10mm","med":"—","tipo":"Entera","qty":1},
  {"id":43,"pallet":9,"mat":"Acero Carbono","esp":"12mm","med":"—","tipo":"Entera","qty":1}
],"nextId":44,"ts":1700000000000};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'GET' && req.url === '/stock') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stockData || STOCK_INICIAL));
    return;
  }
  if (req.method === 'POST' && req.url === '/stock') {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => {
      try {
        stockData = JSON.parse(b);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch(e) { res.writeHead(400); res.end('error'); }
    });
    return;
  }
  res.writeHead(404); res.end('not found');
});

server.listen(PORT, () => {
  console.log('Servidor Stock Chapas corriendo en puerto ' + PORT);
});
