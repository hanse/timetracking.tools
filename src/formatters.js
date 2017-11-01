// @flow

const pad = value => (value < 10 ? `0${value}` : value);

export function formatTime(ms: number): string {
  const time = Math.floor(ms / 1000);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  const parts = [];
  if (hours > 0) {
    parts.push(pad(hours));
  }

  parts.push(pad(minutes));
  parts.push(pad(seconds));

  return parts.join(':');
}

export const formatExact = (ms: number): string => (ms / 1000).toFixed(0);

export const formatHalfHours = (ms: number): string =>
  String(Math.ceil(ms / (3600 * 1000) * 2) / 2);

const isJiraTask = task => /^\d+$/.test(task);

export const formatName = (task: string) =>
  task ? (isJiraTask(task) ? `CS-${task}` : task) : 'nothing';
