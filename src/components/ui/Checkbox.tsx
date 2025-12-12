import React from 'react';

interface Props {
  checked: boolean;
  onChange: () => void;
}

export const Checkbox = React.memo(({ checked, onChange }: Props) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="w-5 h-5 rounded accent-blue-600 dark:accent-blue-400 cursor-pointer"
  />
));