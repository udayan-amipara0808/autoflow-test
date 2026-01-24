import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { WalletProvider } from './hooks/useWallet';
import { ToastProvider, useToast } from './hooks/useToast';

// Page Components (composed here for simplicity)
import StatsCards from './components/dashboard/StatsCards';
import ActivityFeed from './components/dashboard/ActivityFeed';
import NetworkStatus from './components/dashboard/NetworkStatus';
import TaskSubmissionForm from './components/tasks/TaskSubmissionForm';
import TaskMonitor from './components/tasks/TaskMonitor';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import NodeHealthDashboard from './components/nodes/NodeHealthDashboard';
import NodeSelectionVisualizer from './components/nodes/NodeSelectionVisualizer';
import PaymentDashboard from './components/payments/PaymentDashboard';
import TransactionTable from './components/payments/TransactionTable';
import EscrowPanel from './components/payments/EscrowPanel';
import AgentProfile from './components/agent/AgentProfile';
import AgentAnalytics from './components/agent/AgentAnalytics';
import OrchestratorDebug from './components/admin/OrchestratorDebug';

// --- Pages ---

const DashboardPage = () => (
  <div className="space-y-6">
    <StatsCards />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivityFeed />
      <NetworkStatus />
    </div>
  </div>
);

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedTask, setSelectedTask] = useState(null);

  const getTabClass = (tabName) => {
    const base = "px-4 py-2 text-sm font-medium border-b-2 transition-colors";
    const active = "border-primary-500 text-white";
    const inactive = "border-transparent text-gray-400 hover:text-gray-300";
    return base + " " + (activeTab === tabName ? active : inactive);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-dark-800 pb-1">
        <button
          onClick={() => setActiveTab('submit')}
          className={getTabClass('submit')}
        >
          Submit New Task
        </button>
        <button
          onClick={() => setActiveTab('monitor')}
          className={getTabClass('monitor')}
        >
          Monitor Active Tasks
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'submit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskSubmissionForm />
            </div>
            <div className="lg:col-span-1">
              {/* Mini monitor or tips could go here */}
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                <h3 className="text-white font-bold mb-2">Quick Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                  <li>Use <strong>GPU</strong> for neural network training tasks.</li>
                  <li>Set priority to <strong>High</strong> for &lt; 30s latency needs.</li>
                  <li>Escrow includes a 10% safety buffer.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <TaskMonitor onTaskClick={setSelectedTask} />
        )}
      </div>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

const NodesPage = () => (
  <div className="space-y-6">
    <NodeHealthDashboard />
    <NodeSelectionVisualizer />
  </div>
);

const PaymentsPage = () => (
  <div className="space-y-8">
    <PaymentDashboard />
    <div className="grid grid-cols-1 gap-6">
      <EscrowPanel />
      <TransactionTable />
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">Agent Analytics</h2>
      <p className="text-gray-400">Performance metrics and financial reporting</p>
    </div>
    <AgentAnalytics />
    <AgentProfile />
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6 p-6 bg-dark-900 border border-dark-700 rounded-xl">
    <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
    <div className="p-4 bg-dark-800 rounded-lg text-gray-400 text-center">
      Settings module loaded. (Placeholder for advanced config)
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="nodes" element={<NodesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<OrchestratorDebug />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
};

export default App;
