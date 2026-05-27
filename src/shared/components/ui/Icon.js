const paths = {
  alert: 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  arrowLeft: 'M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18',
  arrowRight: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
  box: 'm21 7.5-9-5-9 5m18 0-9 5m9-5v9l-9 5m0-9-9-5m9 5v9m-9-14v9l9 5',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  chart: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3',
  check: 'm5 13 4 4L19 7',
  delivery: 'M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  dashboard: 'M4 5a1 1 0 0 1 1-1h5v7H4V5Zm10-1h5a1 1 0 0 1 1 1v3h-6V4ZM4 15h6v5H5a1 1 0 0 1-1-1v-4Zm10-3h6v7a1 1 0 0 1-1 1h-5v-8Z',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  filter: 'M4 6h16M7 12h10m-7 6h4',
  key: 'M15.75 5.25a4.5 4.5 0 1 1-1.32 3.18L21 15v3h-3v3h-3l-4.5-4.5',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  logout: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12',
  plus: 'M12 5v14m-7-7h14',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6M9 16h4',
  report: 'M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 17v-4m3 4V9m3 8v-2',
  search: 'm21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
  shield: 'M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z',
  trash: 'M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3',
  user: 'M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 21a8 8 0 0 1 16 0',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75',
}

export default function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name] || paths.check} />
    </svg>
  )
}
