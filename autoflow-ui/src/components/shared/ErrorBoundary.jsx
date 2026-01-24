import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
                    <div className="bg-dark-900 p-8 rounded-2xl border border-dark-700 shadow-2xl max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">
                            We've been notified and are working on a fix. Error code: #ERR-{Math.random().toString(36).substring(7).toUpperCase()}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw size={18} />
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
