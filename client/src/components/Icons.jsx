import React from 'react';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...base}
      {...rest}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconTree({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 3v6" />
      <path d="M12 9c-3.4 0-6 1.7-6 4.4 0 1.5 1 2.6 2.4 2.6 1.1 0 2-.6 2.4-1.4" />
      <path d="M12 9c3.4 0 6 1.7 6 4.4 0 1.5-1 2.6-2.4 2.6-1.1 0-2-.6-2.4-1.4" />
      <path d="M12 15.6V21" />
    </Svg>
  );
}

export function IconSunday({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <rect x="4" y="5" width="16" height="16" rx="2.5" />
      <path d="M4 9.5h16" />
      <path d="M8.5 3v4M15.5 3v4" />
      <path d="M8 15h8" />
    </Svg>
  );
}

export function IconSpeakers({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <rect x="3" y="7.5" width="7" height="7" rx="2" />
      <rect x="14" y="10" width="7" height="7" rx="2" />
      <path d="M10 10.75l4 1.5" />
    </Svg>
  );
}

export function IconTopics({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 5.5C9.6 4 6.2 4 3.5 5.4v13.6c2.7-1.4 6.1-1.4 8.5 0 2.4-1.4 5.8-1.4 8.5 0V5.4C17.8 4 14.4 4 12 5.5Z" />
      <path d="M12 5.5v13.5" />
    </Svg>
  );
}

export function IconHistory({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M4 4.5h16" />
      <path d="M4 9.5h12" />
      <path d="M4 14.5h16" />
      <path d="M4 19.5h9" />
      <circle cx="20" cy="14.5" r="1.6" />
    </Svg>
  );
}

export function IconSun({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19" />
    </Svg>
  );
}

export function IconMoon({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M20 14.3A8 8 0 1 1 9.7 4a6.4 6.4 0 1 0 10.3 10.3Z" />
    </Svg>
  );
}

export function IconPlus({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Svg>
  );
}

export function IconClose({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function IconSave({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M5 3h11.5L20 6.5V21H5z" />
      <path d="M8 3v6.5h8V3" />
      <path d="M8 21v-7.5h8V21" />
    </Svg>
  );
}

export function IconWhatsApp({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-12.8 7.4L3 21l1.6-4.6A8.5 8.5 0 0 1 12 3.5Z" />
      <path d="M9 9.5h6M9 12.5h4" />
    </Svg>
  );
}

export function IconSpark({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8-4.8-1.7 4.8-1.7z" />
      <path d="M18.5 17l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </Svg>
  );
}

export function IconEdit({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" />
      <path d="M14 6l4 4" />
    </Svg>
  );
}

export function IconDelete({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </Svg>
  );
}

export function IconSearch({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.6-4.6" />
    </Svg>
  );
}

export function IconWard({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M12 21s-6-4.4-6-9.8A6 6 0 0 1 18 11.2C18 16.6 12 21 12 21Z" />
      <circle cx="12" cy="11.2" r="2.2" />
    </Svg>
  );
}

export function IconMenu({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </Svg>
  );
}

export function IconCalendar({ size, ...rest }) {
  return (
    <Svg size={size} {...rest}>
      <rect x="4" y="5" width="16" height="16" rx="2.5" />
      <path d="M4 9.5h16" />
      <path d="M8.5 3v4M15.5 3v4" />
    </Svg>
  );
}

export default {
  IconTree,
  IconSunday,
  IconSpeakers,
  IconTopics,
  IconHistory,
  IconSun,
  IconMoon,
  IconPlus,
  IconClose,
  IconSave,
  IconWhatsApp,
  IconSpark,
  IconEdit,
  IconDelete,
  IconSearch,
  IconWard,
  IconMenu,
  IconCalendar,
};