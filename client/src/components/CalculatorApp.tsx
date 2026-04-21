import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setWaitingForNewValue(false);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return prev / current;
      case '%':
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay((value * -1).toString());
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const buttons = [
    ['C', 'DEL', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['+/-', '0', '.', '='],
  ];

  const getButtonClass = (btn: string) => {
    if (btn === '=') return 'bg-accent text-accent-foreground hover:bg-accent/90';
    if (['C', 'DEL', '%', '/', '*', '-', '+'].includes(btn)) return 'bg-secondary hover:bg-secondary/80';
    return 'bg-card hover:bg-card/80';
  };

  const handleButtonClick = (btn: string) => {
    switch (btn) {
      case 'C':
        handleClear();
        break;
      case 'DEL':
        handleBackspace();
        break;
      case '%':
        handlePercentage();
        break;
      case '=':
        handleEquals();
        break;
      case '+/-':
        handleToggleSign();
        break;
      case '.':
        handleDecimal();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        handleOperation(btn);
        break;
      default:
        handleNumber(btn);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-4">
      {/* Display */}
      <div className="bg-secondary rounded-lg p-6 mb-4">
        <div className="text-right">
          <div className="text-foreground/60 text-sm mb-2 h-5">
            {operation && previousValue !== null ? `${previousValue} ${operation}` : ''}
          </div>
          <div className="text-5xl font-bold text-foreground break-words">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid gap-2">
        {buttons.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-4 gap-2">
            {row.map((btn) => (
              <Button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`text-lg font-semibold ${getButtonClass(btn)}`}
              >
                {btn}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
