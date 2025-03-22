import { Model } from "mongoose";

export type INotificationShared = Pick<
  INotification,
  "createdBy" | "receiver" | "type"
>;
export type INotification = {
  createdBy: string;
  receiver: string;
  listenerUsername: string | null;
  content: string;
  type: string;
  isSeen: boolean;
  adminAcknowledgement: boolean;
};

export type NotificationModel = Model<INotification, Record<string, unknown>>;

export type INotificationFilters = {
  searchTerm?: string;
};
