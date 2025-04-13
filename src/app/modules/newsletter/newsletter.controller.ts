import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { newsletterServices } from './newsletter.service';

const subscribeNewsletter = catchAsync(async (req, res) => {
  const data = await newsletterServices.subscribeNewsletter(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscribe newsletter successfully!',
    data: data,
  });
});

export const newsletterController = { subscribeNewsletter };
