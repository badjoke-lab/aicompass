import type { LeaderboardModel, V4ModelComputed } from "./types";

export function toLeaderboardModel(model: V4ModelComputed): LeaderboardModel {
  return {
    ...model,
    a30d: model.delta30d.total,
  } satisfies LeaderboardModel;
}
