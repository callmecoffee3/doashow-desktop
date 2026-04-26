import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Command {
  input: string;
  output: string;
  timestamp: string;
}

export default function TerminalApp() {
  const [commands, setCommands] = useState<Command[]>([
    {
      input: 'help',
      output: 'Available commands: ls, cd, pwd, echo, clear, whoami, date, mkdir, rm, cat',
      timestamp: '10:23 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    let output = '';
    const command = cmd.toLowerCase().trim();

    switch (command) {
      case 'help':
        output = 'Available commands: ls, cd, pwd, echo, clear, whoami, date, mkdir, rm, cat';
        break;
      case 'ls':
        output = 'Desktop  Documents  Downloads  Music  Pictures  Videos';
        break;
      case 'pwd':
        output = '/home/user';
        break;
      case 'whoami':
        output = 'user';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'clear':
        setCommands([]);
        setInput('');
        return;
      default:
        if (command.startsWith('echo ')) {
          output = command.substring(5);
        } else if (command.startsWith('mkdir ')) {
          output = `Created directory: ${command.substring(6)}`;
        } else if (command.startsWith('rm ')) {
          output = `Removed: ${command.substring(3)}`;
        } else {
          output = `Command not found: ${command}`;
        }
    }

    setCommands([
      ...commands,
      {
        input: cmd,
        output,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setHistory([...history, cmd]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-green-400/30 p-3 bg-black/80">
        <h2 className="text-sm font-bold">Terminal</h2>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        <div className="text-green-400/60">
          Welcome to DoaShow Terminal v1.0
        </div>
        <div className="text-green-400/60">
          Type 'help' for available commands
        </div>

        {commands.map((cmd, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <span>{cmd.input}</span>
              <span className="text-green-400/50 text-xs ml-auto">{cmd.timestamp}</span>
            </div>
            {cmd.output && (
              <div className="pl-4 text-green-300">
                {cmd.output}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-green-400/30 p-3 bg-black/80">
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-400/40"
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => handleCommand(input)}
            className="bg-green-600 hover:bg-green-700 text-black"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
