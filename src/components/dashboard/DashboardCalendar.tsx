'use client';
import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@/components/ui/shadcn-io/mini-calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

// Mock data per gli eventi/impegni
const generateEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Meeting con Team Marketing',
      date: new Date(),
      time: '09:00',
      duration: '1h',
      attendees: ['Marco', 'Anna', 'Luca'],
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Review Codice',
      date: new Date(),
      time: '14:30',
      duration: '45min',
      attendees: ['Sofia'],
      type: 'review'
    },
    {
      id: 3,
      title: 'Demo Prodotto',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // domani
      time: '11:00',
      duration: '2h',
      attendees: ['Cliente A', 'Cliente B'],
      type: 'demo'
    },
    {
      id: 4,
      title: 'Planning Sprint',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // dopodomani
      time: '10:00',
      duration: '1.5h',
      attendees: ['Team Dev'],
      type: 'planning'
    }
  ];
  return events;
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'review':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'demo':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'planning':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return '👥';
    case 'review':
      return '📝';
    case 'demo':
      return '🎯';
    case 'planning':
      return '📋';
    default:
      return '📅';
  }
};

export default function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const events = generateEvents();

  // Filtra eventi per la data selezionata
  const dayEvents = events.filter(event => isSameDay(event.date, selectedDate));

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mini Calendar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendario</h3>
        <Badge variant="outline" className="text-xs">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
        </Badge>
      </div>

      <MiniCalendar
        value={selectedDate}
        onValueChange={handleDateChange}
        className="w-full"
        days={5}
      >
        <MiniCalendarNavigation direction="prev" />
        <MiniCalendarDays>
          {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
        </MiniCalendarDays>
        <MiniCalendarNavigation direction="next" />
      </MiniCalendar>

      {/* Eventi del giorno */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Impegni del {format(selectedDate, 'EEEE d MMMM', { locale: it })}
        </div>

        {dayEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nessun impegno per oggi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 text-2xl">
                  {getEventTypeIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {event.title}
                    </h4>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time} ({event.duration})
                    </div>
                    
                    {event.attendees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees.length} partecipanti
                      </div>
                    )}
                  </div>
                  
                  {event.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.attendees.map((attendee, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 