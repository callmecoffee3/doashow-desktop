import { useState } from 'react';
import { Phone, DollarSign, Zap, MapPin, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Plan {
  id: string;
  name: string;
  price: number;
  data: string;
  talk: string;
  text: string;
  features: string[];
  popular?: boolean;
}

interface Account {
  id: string;
  phoneNumber: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  renewalDate: string;
  balance: number;
}

export default function MintMobileApp() {
  const [activeTab, setActiveTab] = useState<'plans' | 'accounts' | 'coverage'>('plans');
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('doashow_mint_accounts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 15,
      data: '2GB',
      talk: 'Unlimited',
      text: 'Unlimited',
      features: ['2G/3G/4G LTE', 'No contract', 'Cancel anytime'],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 25,
      data: '10GB',
      talk: 'Unlimited',
      text: 'Unlimited',
      features: ['4G LTE', 'Mobile hotspot', 'No contract', 'International calling'],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 35,
      data: '15GB',
      talk: 'Unlimited',
      text: 'Unlimited',
      features: ['5G ready', 'Mobile hotspot', 'Priority support', 'International calling'],
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 45,
      data: 'Unlimited',
      talk: 'Unlimited',
      text: 'Unlimited',
      features: ['5G ready', 'Unlimited hotspot', '24/7 support', 'International calling'],
    },
  ];

  const addAccount = () => {
    if (newPhone && selectedPlan) {
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        phoneNumber: newPhone,
        plan: selectedPlan,
        status: 'active',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        balance: 0,
      };

      const updated = [...accounts, newAccount];
      setAccounts(updated);
      localStorage.setItem('doashow_mint_accounts', JSON.stringify(updated));
      setNewPhone('');
      setSelectedPlan('');
      setShowAddAccount(false);
    }
  };

  const removeAccount = (id: string) => {
    if (confirm('Remove this account?')) {
      const updated = accounts.filter(a => a.id !== id);
      setAccounts(updated);
      localStorage.setItem('doashow_mint_accounts', JSON.stringify(updated));
    }
  };

  const getPlanDetails = (planId: string) => {
    return plans.find(p => p.id === planId);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-gradient-to-r from-green-600/20 to-green-500/10 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="text-2xl font-bold text-green-600">Mint Mobile</h2>
              <p className="text-sm text-foreground/60">Wireless that actually makes sense</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-foreground/60">Accounts</div>
            <div className="text-2xl font-bold text-green-600">{accounts.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-2 px-6 py-3 bg-secondary sticky top-16 z-10">
        <Button
          onClick={() => setActiveTab('plans')}
          variant={activeTab === 'plans' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          Plans
        </Button>
        <Button
          onClick={() => setActiveTab('accounts')}
          variant={activeTab === 'accounts' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <Phone className="w-4 h-4" />
          My Accounts
        </Button>
        <Button
          onClick={() => setActiveTab('coverage')}
          variant={activeTab === 'coverage' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <MapPin className="w-4 h-4" />
          Coverage
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 transition-all ${
                      plan.popular
                        ? 'border-green-500 bg-green-500/5 ring-2 ring-green-500/20'
                        : 'border-border hover:border-green-500/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-xs font-bold text-green-600 mb-2 uppercase">
                        Most Popular
                      </div>
                    )}
                    <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                    <div className="text-3xl font-bold text-green-600 mb-4">
                      ${plan.price}
                      <span className="text-sm text-foreground/60">/month</span>
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Data:</span>
                        <span className="font-semibold">{plan.data}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Talk:</span>
                        <span className="font-semibold">{plan.talk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Text:</span>
                        <span className="font-semibold">{plan.text}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setShowAddAccount(true);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Choose Plan
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">My Accounts</h3>
              <Button
                onClick={() => setShowAddAccount(true)}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </Button>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60 mb-4">No accounts yet</p>
                <Button
                  onClick={() => setShowAddAccount(true)}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Account
                </Button>
              </div>
            ) : (
              accounts.map(account => {
                const plan = getPlanDetails(account.plan);
                return (
                  <div key={account.id} className="border border-border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold">{account.phoneNumber}</h4>
                        <p className="text-sm text-foreground/60">{plan?.name} Plan - ${plan?.price}/month</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            account.status === 'active'
                              ? 'bg-green-500/20 text-green-600'
                              : account.status === 'inactive'
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}
                        >
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </span>
                        <Button
                          onClick={() => removeAccount(account.id)}
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-foreground/60">Data</div>
                        <div className="font-semibold">{plan?.data}</div>
                      </div>
                      <div>
                        <div className="text-foreground/60">Renewal Date</div>
                        <div className="font-semibold">{account.renewalDate}</div>
                      </div>
                      <div>
                        <div className="text-foreground/60">Balance</div>
                        <div className="font-semibold text-green-600">${account.balance.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Coverage Tab */}
        {activeTab === 'coverage' && (
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold mb-4">Network Coverage</h3>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-6 bg-card">
                <h4 className="font-bold mb-2">🌐 Nationwide Coverage</h4>
                <p className="text-sm text-foreground/60 mb-4">
                  Mint Mobile uses T-Mobile's nationwide 4G LTE and 5G network, providing coverage to over 99% of Americans.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card">
                <h4 className="font-bold mb-2">📡 Network Technology</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>• 4G LTE: Fast data speeds for browsing and streaming</li>
                  <li>• 5G: Ultra-fast speeds where available</li>
                  <li>• International roaming in 200+ destinations</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card">
                <h4 className="font-bold mb-2">💡 Coverage Tips</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>• Check coverage maps on T-Mobile's website</li>
                  <li>• Download the T-Mobile coverage map app</li>
                  <li>• 30-day money-back guarantee if not satisfied</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add New Account</h3>
              <Button
                onClick={() => setShowAddAccount(false)}
                variant="ghost"
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Select Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Choose a plan...</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/month
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addAccount}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Add Account
                </Button>
                <Button
                  onClick={() => setShowAddAccount(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
