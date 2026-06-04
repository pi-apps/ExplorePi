// ============================================================
// ExplorePi Quantum Network — MongoDB seed
// ============================================================
db = db.getSiblingDB('explorepi');

db.createCollection('transactions');
db.transactions.createIndex({ txHash: 1 }, { unique: true });
db.transactions.createIndex({ ledger: -1 });
db.transactions.createIndex({ from: 1 });
db.transactions.createIndex({ to: 1 });

db.transactions.insertMany([
  { txHash: 'tx001', from: 'GDPI_A', to: 'GDPI_B', amount: 100.5, asset: 'PI', ledger: 1000000, memo: 'pioneer payment', ts: new Date() },
  { txHash: 'tx002', from: 'GDPI_C', to: 'GDPI_D', amount: 50.0,  asset: 'PI', ledger: 1000001, memo: '', ts: new Date() }
]);

db.createCollection('wallets');
db.wallets.createIndex({ address: 1 }, { unique: true });
db.wallets.insertMany([
  { address: 'GDPI_A', balance: 9999.5, isValidator: false },
  { address: 'GDPI_B', balance: 200.0,  isValidator: false },
  { address: 'GDPI_V', balance: 500.0,  isValidator: true  }
]);
