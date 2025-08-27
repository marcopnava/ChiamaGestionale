'use client';

import * as React from 'react';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/components/ui/shadcn-io/calendar';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '@/components/ui/shadcn-io/gantt';

import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/ui/shadcn-io/list';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import groupBy from 'lodash.groupby';
import {
  CalendarIcon,
  ChevronRightIcon,
  EyeIcon,
  GanttChartSquareIcon,
  KanbanSquareIcon,
  LinkIcon,
  ListIcon,
  TableIcon,
  TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Dati deterministici invece di faker
const statuses = [
  { id: 'status-1', name: 'Planned', color: '#6B7280' },
  { id: 'status-2', name: 'In Progress', color: '#F59E0B' },
  { id: 'status-3', name: 'Done', color: '#10B981' },
];

const users = [
  { id: 'user-1', name: 'Mario Rossi', image: 'https://i.pravatar.cc/150?u=1' },
  { id: 'user-2', name: 'Anna Bianchi', image: 'https://i.pravatar.cc/150?u=2' },
  { id: 'user-3', name: 'Luca Verdi', image: 'https://i.pravatar.cc/150?u=3' },
  { id: 'user-4', name: 'Sofia Neri', image: 'https://i.pravatar.cc/150?u=4' },
];

const exampleGroups = [
  { id: 'group-1', name: 'Frontend Development' },
  { id: 'group-2', name: 'Backend Development' },
  { id: 'group-3', name: 'UI/UX Design' },
  { id: 'group-4', name: 'Testing & QA' },
  { id: 'group-5', name: 'DevOps' },
  { id: 'group-6', name: 'Documentation' },
];

const exampleProducts = [
  { id: 'product-1', name: 'Chiama.io Platform' },
  { id: 'product-2', name: 'Mobile App' },
  { id: 'product-3', name: 'Admin Dashboard' },
  { id: 'product-4', name: 'API Gateway' },
];

const exampleInitiatives = [
  { id: 'initiative-1', name: 'Q4 2024 Release' },
  { id: 'initiative-2', name: 'Performance Optimization' },
];

const exampleReleases = [
  { id: 'release-1', name: 'v2.1.0' },
  { id: 'release-2', name: 'v2.2.0' },
  { id: 'release-3', name: 'v2.3.0' },
];

const exampleFeatures = [
  {
    id: 'feature-1',
    name: 'Implementare autenticazione OAuth',
    startAt: new Date('2024-08-26'),
    endAt: new Date('2024-09-03'),
    status: statuses[0],
    owner: users[0],
    group: exampleGroups[0],
    product: exampleProducts[0],
    initiative: exampleInitiatives[0],
    release: exampleReleases[0],
  },
  {
    id: 'feature-2',
    name: 'Ottimizzare performance database',
    startAt: new Date('2024-08-24'),
    endAt: new Date('2024-09-06'),
    status: statuses[1],
    owner: users[1],
    group: exampleGroups[1],
    product: exampleProducts[1],
    initiative: exampleInitiatives[1],
    release: exampleReleases[1],
  },
  {
    id: 'feature-3',
    name: 'Creare dashboard analytics',
    startAt: new Date('2024-08-22'),
    endAt: new Date('2024-09-09'),
    status: statuses[2],
    owner: users[2],
    group: exampleGroups[2],
    product: exampleProducts[2],
    initiative: exampleInitiatives[0],
    release: exampleReleases[0],
  },
  {
    id: 'feature-4',
    name: 'Testare API endpoints',
    startAt: new Date('2024-08-20'),
    endAt: new Date('2024-09-12'),
    status: statuses[0],
    owner: users[3],
    group: exampleGroups[3],
    product: exampleProducts[3],
    initiative: exampleInitiatives[1],
    release: exampleReleases[1],
  },
  {
    id: 'feature-5',
    name: 'Fix bug login mobile',
    startAt: new Date('2024-08-16'),
    endAt: new Date('2024-09-18'),
    status: statuses[2],
    owner: users[1],
    group: exampleGroups[0],
    product: exampleProducts[1],
    initiative: exampleInitiatives[0],
    release: exampleReleases[2],
  },
  {
    id: 'feature-6',
    name: 'Implementare notifiche push',
    startAt: new Date('2024-08-14'),
    endAt: new Date('2024-09-21'),
    status: statuses[0],
    owner: users[2],
    group: exampleGroups[1],
    product: exampleProducts[0],
    initiative: exampleInitiatives[1],
    release: exampleReleases[2],
  },
  {
    id: 'feature-7',
    name: 'Refactoring codice legacy',
    startAt: new Date('2024-08-12'),
    endAt: new Date('2024-09-24'),
    status: statuses[1],
    owner: users[3],
    group: exampleGroups[4],
    product: exampleProducts[2],
    initiative: exampleInitiatives[0],
    release: exampleReleases[0],
  },
  {
    id: 'feature-8',
    name: 'Setup CI/CD pipeline',
    startAt: new Date('2024-08-10'),
    endAt: new Date('2024-09-27'),
    status: statuses[2],
    owner: users[0],
    group: exampleGroups[4],
    product: exampleProducts[3],
    initiative: exampleInitiatives[1],
    release: exampleReleases[1],
  },
  {
    id: 'feature-9',
    name: 'Ottimizzare SEO',
    startAt: new Date('2024-08-08'),
    endAt: new Date('2024-09-30'),
    status: statuses[0],
    owner: users[1],
    group: exampleGroups[2],
    product: exampleProducts[0],
    initiative: exampleInitiatives[0],
    release: exampleReleases[2],
  },
  {
    id: 'feature-10',
    name: 'Testare responsive design',
    startAt: new Date('2024-08-04'),
    endAt: new Date('2024-10-06'),
    status: statuses[2],
    owner: users[2],
    group: exampleGroups[3],
    product: exampleProducts[1],
    initiative: exampleInitiatives[1],
    release: exampleReleases[0],
  },
  {
    id: 'feature-11',
    name: 'Implementare dark mode',
    startAt: new Date('2024-08-06'),
    endAt: new Date('2024-10-03'),
    status: statuses[1],
    owner: users[3],
    group: exampleGroups[0],
    product: exampleProducts[2],
    initiative: exampleInitiatives[0],
    release: exampleReleases[1],
  },
  {
    id: 'feature-12',
    name: 'Aggiornare dipendenze',
    startAt: new Date('2024-08-02'),
    endAt: new Date('2024-10-09'),
    status: statuses[0],
    owner: users[0],
    group: exampleGroups[4],
    product: exampleProducts[3],
    initiative: exampleInitiatives[1],
    release: exampleReleases[2],
  },
  {
    id: 'feature-13',
    name: 'Creare backup automatici',
    startAt: new Date('2024-07-31'),
    endAt: new Date('2024-10-12'),
    status: statuses[1],
    owner: users[1],
    group: exampleGroups[4],
    product: exampleProducts[0],
    initiative: exampleInitiatives[0],
    release: exampleReleases[0],
  },
  {
    id: 'feature-14',
    name: 'Implementare logging',
    startAt: new Date('2024-07-29'),
    endAt: new Date('2024-10-15'),
    status: statuses[2],
    owner: users[2],
    group: exampleGroups[1],
    product: exampleProducts[1],
    initiative: exampleInitiatives[1],
    release: exampleReleases[1],
  },
  {
    id: 'feature-15',
    name: 'Aggiornare documentazione',
    startAt: new Date('2024-08-18'),
    endAt: new Date('2024-09-15'),
    status: statuses[1],
    owner: users[0],
    group: exampleGroups[5],
    product: exampleProducts[2],
    initiative: exampleInitiatives[0],
    release: exampleReleases[2],
  },
];

const exampleMarkers = [
  {
    id: 'marker-1',
    date: new Date('2024-08-15'),
    label: 'Sprint Review',
    className: 'bg-blue-100 text-blue-900',
  },
  {
    id: 'marker-2',
    date: new Date('2024-08-30'),
    label: 'Release v2.1.0',
    className: 'bg-green-100 text-green-900',
  },
  {
    id: 'marker-3',
    date: new Date('2024-09-15'),
    label: 'Sprint Planning',
    className: 'bg-purple-100 text-purple-900',
  },
  {
    id: 'marker-4',
    date: new Date('2024-09-30'),
    label: 'Release v2.2.0',
    className: 'bg-red-100 text-red-900',
  },
  {
    id: 'marker-5',
    date: new Date('2024-10-15'),
    label: 'Q4 Planning',
    className: 'bg-orange-100 text-orange-900',
  },
  {
    id: 'marker-6',
    date: new Date('2024-10-30'),
    label: 'Release v2.3.0',
    className: 'bg-teal-100 text-teal-900',
  },
];

const GanttView = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const groupedFeatures = groupBy(features, 'group.name');
  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewFeature = (id: string) =>
    console.log(`Feature selected: ${id}`);
  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);
  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  const handleRemoveMarker = (id: string) =>
    console.log(`Remove marker: ${id}`);
  const handleCreateMarker = (date: Date) =>
    console.log(`Create marker: ${date.toISOString()}`);
  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      )
    );
    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
  };
  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento Gantt...</div>
      </div>
    );
  }

  return (
    <GanttProvider
      className="rounded-none"
      onAddItem={handleAddFeature}
      range="monthly"
      zoom={100}
    >
      <GanttSidebar>
        {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
          <GanttSidebarGroup key={group} name={group}>
            {features.map((feature) => (
              <GanttSidebarItem
                feature={feature}
                key={feature.id}
                onSelectItem={handleViewFeature}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className="flex" key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        onClick={() => handleViewFeature(feature.id)}
                        type="button"
                      >
                        <GanttFeatureItem
                          feature={feature}
                          onMove={handleMoveFeature}
                        >
                          <p className="flex-1 truncate text-xs">
                            {feature.name}
                          </p>
                          {feature.owner && (
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={feature.owner.image} />
                              <AvatarFallback>
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewFeature(feature.id)}
                      >
                        <EyeIcon className="text-muted-foreground" size={16} />
                        View feature
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(feature.id)}
                      >
                        <LinkIcon className="text-muted-foreground" size={16} />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveFeature(feature.id)}
                      >
                        <TrashIcon size={16} />
                        Remove from roadmap
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        {exampleMarkers.map((marker) => (
          <GanttMarker
            key={marker.id}
            marker={marker}
            onRemove={handleRemoveMarker}
          />
        ))}
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};

const earliestYear =
  exampleFeatures
    .map((feature) => feature.startAt.getFullYear())
    .sort()
    .at(0) ?? new Date().getFullYear();
const latestYear =
  exampleFeatures
    .map((feature) => feature.endAt.getFullYear())
    .sort()
    .at(-1) ?? new Date().getFullYear();

const CalendarView = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento Calendar...</div>
      </div>
    );
  }

  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker end={latestYear} start={earliestYear} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={exampleFeatures}>
        {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
      </CalendarBody>
    </CalendarProvider>
  );
};

const ListView = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const status = statuses.find((status) => status.name === over.id);
    if (!status) {
      return;
    }
    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }
        return feature;
      })
    );
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento List...</div>
      </div>
    );
  }

  return (
    <ListProvider className="overflow-auto" onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <ListGroup id={status.name} key={status.name}>
          <ListHeader color={status.color} name={status.name}>
            <span>{status.name}</span>
          </ListHeader>
          <ListItems>
            {features
              .filter((feature) => feature.status.name === status.name)
              .map((feature, index) => (
                <ListItem
                  id={feature.id}
                  index={index}
                  key={feature.id}
                  name={feature.name}
                  parent={feature.status.name}
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <p className="m-0 flex-1 font-medium text-sm">
                    {feature.name}
                  </p>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </ListItem>
              ))}
          </ListItems>
        </ListGroup>
      ))}
    </ListProvider>
  );
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const KanbanView = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento Kanban...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="flex flex-col w-80 bg-muted/50 rounded-lg border">
            <div className="p-3 border-b font-medium text-sm">{status.name}</div>
            <div className="flex-1 p-2 space-y-2">
              {exampleFeatures
                .filter((feature) => feature.status.name === status.name)
                .map((feature) => (
                  <div
                    key={feature.id}
                    className="p-3 bg-background border rounded-lg shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="m-0 flex-1 font-medium text-sm">
                          {feature.name}
                        </p>
                        <p className="m-0 text-muted-foreground text-xs">
                          {feature.initiative.name}
                        </p>
                      </div>
                      {feature.owner && (
                        <Avatar className="h-4 w-4 shrink-0">
                          <AvatarImage src={feature.owner.image} />
                          <AvatarFallback>
                            {feature.owner.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <p className="m-0 text-muted-foreground text-xs">
                      {shortDateFormatter.format(feature.startAt)} -{' '}
                      {dateFormatter.format(feature.endAt)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableView = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento Table...</div>
      </div>
    );
  }

  return (
    <div className="size-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start At</TableHead>
            <TableHead>End At</TableHead>
            <TableHead>Release</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exampleFeatures.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="size-6">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute right-0 bottom-0 h-2 w-2 rounded-full ring-2 ring-background"
                      style={{
                        backgroundColor: feature.status.color,
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-medium">{feature.name}</span>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <span>{feature.product.name}</span>
                      <ChevronRightIcon size={12} />
                      <span>{feature.group.name}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                }).format(feature.startAt)}
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                }).format(feature.endAt)}
              </TableCell>
              <TableCell>{feature.release.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const RoadmapSection = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const views = [
    {
      id: 'gantt',
      label: 'Gantt',
      icon: GanttChartSquareIcon,
      component: GanttView,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      component: CalendarView,
    },
    {
      id: 'list',
      label: 'List',
      icon: ListIcon,
      component: ListView,
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: KanbanSquareIcon,
      component: KanbanView,
    },
    {
      id: 'table',
      label: 'Table',
      icon: TableIcon,
      component: TableView,
    },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Caricamento Roadmap...</div>
      </div>
    );
  }

  return (
    <Tabs className="not-prose size-full gap-0 divide-y" defaultValue="gantt">
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="font-medium">Roadmap</p>
        <TabsList>
          {views.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              <view.icon size={16} />
              <span className="sr-only">{view.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {views.map((view) => (
        <TabsContent className="overflow-hidden" key={view.id} value={view.id}>
          <view.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RoadmapSection; 