
import React from 'react';

export const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

export const BadgeIcon = ({ className = "w-12 h-12 text-yellow-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.688.421l1.838 3.725 4.11.597a.75.75 0 01.416 1.28l-2.974 2.899.702 4.093a.75.75 0 01-1.088.791L10 13.347l-3.693 1.94a.75.75 0 01-1.088-.79l.702-4.093-2.974-2.899a.75.75 0 01.416-1.28l4.11-.597L9.312 2.42A.75.75 0 0110 2zM8.52 9.55a.75.75 0 01.96 0l.073.064L10 10l.447-.386.073-.064a.75.75 0 01.96 1.122l-.064.073L10.96 11l.386.447.064.073a.75.75 0 01-1.122.96l-.073-.064L10 12l-.447.386-.073.064a.75.75 0 01-.96-1.122l.064-.073L9.04 11l-.386-.447-.064-.073a.75.75 0 01.96-1.122l.073.064z" clipRule="evenodd" />
    </svg>
);


export const EpicBadgeIcon = ({ className = "w-14 h-14 text-red-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a.75.75 0 01.75.75v3.438a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM13.232 4.232a.75.75 0 011.06 0l2.439 2.44a.75.75 0 01-1.06 1.06L13.232 5.292a.75.75 0 010-1.06zM4.707 5.293a.75.75 0 010 1.06L2.268 8.793a.75.75 0 01-1.06-1.06L3.646 4.232a.75.75 0 011.06 0zM17.25 10a.75.75 0 010 1.5h-3.438a.75.75 0 010-1.5H17.25zM6.188 10a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5h3.438zM13.232 15.768a.75.75 0 01-1.06 0L9.732 13.33a.75.75 0 011.06-1.06l2.44 2.439a.75.75 0 010 1.06zM4.707 14.707a.75.75 0 010-1.06l2.439-2.44a.75.75 0 011.06 1.06L5.768 15.768a.75.75 0 01-1.06 0zM10 12.25a.75.75 0 01.75.75v3.438a.75.75 0 01-1.5 0v-3.438a.75.75 0 01.75-.75zM10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
);


export const CertificateIcon = ({ className = "w-16 h-16 text-blue-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.75 2.5a.75.75 0 00-1.5 0v.583c-.597.05-1.185.165-1.748.337a.75.75 0 00-.5.698v1.33c0 .356.241.668.583.743a12.92 12.92 0 003.83 0c.342-.075.583-.387.583-.743v-1.33a.75.75 0 00-.5-.698 12.563 12.563 0 00-1.748-.337V2.5z" />
        <path fillRule="evenodd" d="M10 1.5a5.5 5.5 0 00-5.5 5.5v3.354a.75.75 0 00.147.458l3.5 4.5a.75.75 0 001.106.002l3.5-4.5a.75.75 0 00.147-.46V7A5.5 5.5 0 0010 1.5zm-3.5 5.5a3.5 3.5 0 117 0v3.083l-3.232 4.156a.25.25 0 01-.37.001L6.5 10.083V7z" clipRule="evenodd" />
    </svg>
);
