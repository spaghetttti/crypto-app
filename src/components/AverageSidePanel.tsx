import { useState, useEffect } from 'react';

interface AverageSidePanelProps {
  title: string;
}


export default function AverageSidePanel({ title }: AverageSidePanelProps) {
  return (
    <div className="flex-1 bg-white p-4 m-2 shadow-md">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}
