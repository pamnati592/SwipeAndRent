const listeners: (() => void)[] = [];

export const chatBus = {
  notify: () => listeners.forEach(fn => fn()),
  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i !== -1) listeners.splice(i, 1);
    };
  },
};
