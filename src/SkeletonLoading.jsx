import React from 'react';

const SkeletonLoading = () => {
	return (
	<div className="animate-pulse space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
    <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Title */}
    <div className="h-60 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded" /> 
	<div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
	<div className="h-4 w-1/5 bg-gray-300 dark:bg-gray-700 rounded" /> 
	
    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Ingredients */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Instructions */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" /> {/* Instructions */}
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
    <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>);
  }

export default SkeletonLoading;
