export type Stream = {
  ingestUrl: string;
  hlsManifest: string;
  uniqueness: string;
};

export type MsgFromClient = {
  stream_id: string;
  comment: string;
  reaction: boolean;
  is_connected: boolean;
};

export type MsgFromServer = {
  comments: string[];
  reaction: number;
};
