import { useState } from 'react';
import { Send, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function BankApp() {
  const [balance, setBalance] = useState(5234.56);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      description: 'Salary Deposit',
      amount: 3500,
      date: 'Apr 25, 2026',
      category: 'Income',
    },
    {
      id: '2',
      type: 'expense',
      description: 'Grocery Store',
      amount: 125.50,
      date: 'Apr 24, 2026',
      category: 'Shopping',
    },
    {
      id: '3',
      type: 'expense',
      description: 'Electric Bill',
      amount: 89.99,
      date: 'Apr 23, 2026',
      category: 'Utilities',
    },
    {
      id: '4',
      type: 'income',
      description: 'Freelance Project',
      amount: 750,
      date: 'Apr 22, 2026',
      category: 'Income',
    },
    {
      id: '5',
      type: 'expense',
      description: 'Restaurant',
      amount: 45.30,
      date: 'Apr 21, 2026',
      category: 'Dining',
    },
  ]);

  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');

  const handleTransfer = () => {
    if (!transferAmount || !transferRecipient || parseFloat(transferAmount) > balance) return;

    const amount = parseFloat(transferAmount);
    setBalance(balance - amount);
    setTransactions([
      {
        id: Date.now().toString(),
        type: 'expense',
        description: `Transfer to ${transferRecipient}`,
        amount,
        date: new Date().toLocaleDateString(),
        category: 'Transfer',
      },
      ...transactions,
    ]);
    setTransferAmount('');
    setTransferRecipient('');
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-900 to-blue-800">
      {/* Header */}
      <div className="p-6 text-white space-y-6">
        <h2 className="text-2xl font-bold">🏦 Bank</h2>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 space-y-2">
          <p className="text-white/80 text-sm">Total Balance</p>
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold">
              {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-white/60 text-sm">Account: •••• •••• •••• 4829</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-300 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Income</span>
            </div>
            <p className="text-lg font-bold text-white">${income.toFixed(2)}</p>
          </div>
          <div className="bg-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-300 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Expenses</span>
            </div>
            <p className="text-lg font-bold text-white">${expenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background rounded-t-3xl p-6 space-y-6">
        {/* Transfer Section */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-sm">Quick Transfer</h3>
          <input
            type="text"
            placeholder="Recipient name"
            value={transferRecipient}
            onChange={(e) => setTransferRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleTransfer}
            disabled={!transferAmount || !transferRecipient || parseFloat(transferAmount) > balance}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Money
          </Button>
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          <h3 className="font-bold">Recent Transactions</h3>
          <div className="space-y-2">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${transaction.type === 'income' ? '📈' : '📉'}`}>
                    {transaction.type === 'income' ? '📈' : '📉'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{transaction.description}</p>
                    <p className="text-xs text-foreground/60">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
