import React from 'react';

export const CardSkeleton = () => (
    <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 shadow-lg h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-8 bg-dark-700 rounded-full animate-pulse" />
            <div className="h-4 w-12 bg-dark-700 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-dark-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-16 bg-dark-700 rounded animate-pulse" />
    </div>
);

export const TableRowSkeleton = () => (
    <div className="flex items-center justify-between py-4 border-b border-dark-800">
        <div className="h-4 w-24 bg-dark-700 rounded animate-pulse" />
        <div className="h-4 w-20 bg-dark-700 rounded animate-pulse" />
        <div className="h-4 w-32 bg-dark-700 rounded animate-pulse" />
        <div className="h-4 w-16 bg-dark-700 rounded animate-pulse" />
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 shadow-lg h-80 flex items-center justify-center">
        <div className="w-full h-64 bg-dark-800 rounded animate-pulse" />
    </div>
);
