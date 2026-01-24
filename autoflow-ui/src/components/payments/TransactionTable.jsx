import React, { useState } from 'react';
import { ExternalLink, ArrowRight, Download, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { mockPayments } from '../../utils/mockData';
import { formatAmount, formatHash, formatAddress, formatTime } from '../../utils/formatters';

const TransactionTable = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(p => {
    const matchesFilter = filter === 'All' || p.type.includes(filter);
    const matchesSearch = p.hash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilterClass = (f) => {
    const base = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ";
    const active = "bg-primary-500/10 text-primary-400 border border-primary-500/20";
    const inactive = "text-gray-400 hover:text-white hover:bg-dark-800";
    return base + (filter === f ? active : inactive);
  };

  const getTypeClass = (type) => {
    const base = "px-2 py-1 rounded text-xs font-bold ";
    if (type === 'Escrow Lock') return base + 'bg-cyan-900/30 text-cyan-400';
    if (type === 'Payment Release') return base + 'bg-green-900/30 text-green-400';
    return base + 'bg-red-900/30 text-red-400';
  };

  const getStatusClass = (status) => {
    return "text-sm font-medium " + (status === 'Confirmed' ? 'text-green-500' : 'text-yellow-500');
  };

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg flex flex-col">
      <div className="p-6 border-b border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-white">Transaction History</h2>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-dark-800 border border-dark-700 rounded-lg pl-9 p-2 text-sm text-white focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-sm text-gray-300 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-dark-800 flex gap-2 overflow-x-auto">
        {['All', 'Escrow', 'Payment', 'Refund'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={getFilterClass(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-800 text-gray-500 text-xs uppercase tracking-wider bg-dark-800/20">
              <th className="p-4">TX Hash</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">From / To</th>
              <th className="p-4">Status</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {filteredPayments.map((tx) => (
              <tr key={tx.hash} className="hover:bg-dark-800/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary-400">{formatHash(tx.hash)}</span>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity">
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <span className={getTypeClass(tx.type)}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-mono font-medium text-white">{formatAmount(tx.amount)} MON</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                    <span>{formatAddress(tx.from)}</span>
                    <ArrowRight size={12} className="text-gray-600" />
                    <span>{formatAddress(tx.to)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    {tx.status === 'Confirmed' ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-yellow-500 animate-pulse" />
                    )}
                    <span className={getStatusClass(tx.status)}>
                      {tx.status} {tx.status === 'Pending' && "(" + tx.confirmations + "/12)"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {formatTime(tx.timestamp)}
                </td>
                <td className="p-4 text-right">
                  <button className="p-1.5 hover:bg-dark-700 rounded text-gray-400 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
