'use client';

import { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

// Mock data since faker is not available
const generateId = (index: number) => `task-${index.toString().padStart(3, '0')}`;

const columns = [
  { id: 'planned', name: 'Planned', color: '#6B7280' },
  { id: 'in-progress', name: 'In Progress', color: '#F59E0B' },
  { id: 'done', name: 'Done', color: '#10B981' },
];

const users = [
  { id: 'user1', name: 'Marco Rossi', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 'user2', name: 'Anna Bianchi', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 'user3', name: 'Luca Verdi', image: 'https://i.pravatar.cc/150?u=3' },
  { id: 'user4', name: 'Sofia Neri', image: 'https://i.pravatar.cc/150?u=4' },
];

const realisticTasks = [
  { name: 'Implementare autenticazione OAuth', column: 'planned', user: users[0] },
  { name: 'Ottimizzare performance database', column: 'in-progress', user: users[1] },
  { name: 'Creare dashboard analytics', column: 'done', user: users[2] },
  { name: 'Testare API endpoints', column: 'planned', user: users[3] },
  { name: 'Aggiornare documentazione', column: 'in-progress', user: users[0] },
  { name: 'Fix bug login mobile', column: 'done', user: users[1] },
  { name: 'Implementare notifiche push', column: 'planned', user: users[2] },
  { name: 'Refactoring codice legacy', column: 'in-progress', user: users[3] },
  { name: 'Setup CI/CD pipeline', column: 'done', user: users[0] },
  { name: 'Ottimizzare SEO', column: 'planned', user: users[1] },
  { name: 'Implementare dark mode', column: 'in-progress', user: users[2] },
  { name: 'Testare responsive design', column: 'done', user: users[3] },
  { name: 'Aggiornare dipendenze', column: 'planned', user: users[0] },
  { name: 'Creare backup automatici', column: 'in-progress', user: users[1] },
  { name: 'Implementare logging', column: 'done', user: users[2] },
];

const exampleFeatures = realisticTasks.map((task, index) => ({
  id: generateId(index),
  name: task.name,
  startAt: new Date(Date.now() - (index * 2 + 1) * 24 * 60 * 60 * 1000), // Date fisse basate sull'indice
  endAt: new Date(Date.now() + (index * 3 + 7) * 24 * 60 * 60 * 1000), // Date fisse basate sull'indice
  column: task.column,
  owner: task.user,
}));

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('it-IT', {
  month: 'short',
  day: 'numeric',
});

function AddTaskForm({ onAdd, onCancel, currentCount }: { onAdd: (task: any) => void; onCancel: () => void; currentCount: number }) {
  const [taskName, setTaskName] = useState('');
  const [selectedUser, setSelectedUser] = useState(users[0].id);
  const [selectedColumn, setSelectedColumn] = useState('planned');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskName.trim()) {
      const newTask = {
        id: generateId(currentCount), // Usa il count passato come parametro
        name: taskName.trim(),
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        column: selectedColumn,
        owner: users.find(u => u.id === selectedUser)!,
      };
      onAdd(newTask);
      setTaskName('');
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg bg-muted/30">
      <Input
        placeholder="Nome del task..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        autoFocus
      />
      <div className="flex gap-2">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Assegna a..." />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Aggiungi Task
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export default function TodoList() {
  const [features, setFeatures] = useState(exampleFeatures);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = (newTask: any) => {
    setFeatures(prev => [...prev, newTask]);
  };

  const handleDataChange = (newData: any[]) => {
    setFeatures(newData);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Todo List</h2>
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuovo Task
        </Button>
      </div>

      {showAddForm && (
        <AddTaskForm 
          onAdd={handleAddTask} 
          onCancel={() => setShowAddForm(false)}
          currentCount={features.length}
        />
      )}

      <KanbanProvider
        columns={columns}
        data={features}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span className="font-medium">{column.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({features.filter(f => f.column === column.id).length})
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(feature: any) => (
                <KanbanCard
                  column={column.id}
                  id={feature.id}
                  key={feature.id}
                  name={feature.name}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 font-medium text-sm">
                        {feature.name}
                      </p>
                    </div>
                    {feature.owner && (
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={feature.owner.image} />
                        <AvatarFallback>
                          {feature.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <p className="m-0 text-muted-foreground text-xs mt-2">
                    {shortDateFormatter.format(feature.startAt)} -{' '}
                    {dateFormatter.format(feature.endAt)}
                  </p>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
} 