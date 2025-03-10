"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationAlert = void 0;
const notification_model_1 = require("./notification.model");
const createNotificationAlert = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationType = {
        ORDER: 'Your order has been placed successfully',
        ORDER_UPDATED: 'Your order has been updated',
    };
    payload.content = notificationType[payload.type];
    const notification = yield notification_model_1.Notification.create({ createdBy: payload.orderBy, receiver: payload.orderBy, type: 'ORDER', content: payload.content, isSeen: false });
    // const lastFaculty = await ClientOrder.findOne({},{ orderId: 1, _id: 0 })
    //   .sort({
    //     createdAt: -1,
    //   })
    //   .lean();
    return notification;
});
exports.createNotificationAlert = createNotificationAlert;
