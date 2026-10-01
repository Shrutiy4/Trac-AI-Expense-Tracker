import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`table w-full ${className}`}>{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-warning text-base-100">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children, className = '', ...props }) => (
  <tr
    className={`hover:bg-base-content/10 cursor-pointer transition-all duration-150 ${className}`}
    {...props}
  >
    {children}
  </tr>
);


export const TableHead = ({ children, className = '' }) => (
  <th className={`text-sm font-semibold px-4 py-2 ${className}`}>{children}</th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`text-sm px-4 py-2 ${className}`}>{children}</td>
);
