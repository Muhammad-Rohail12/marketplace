const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/sellerApplication.validator');
const service = require('../services/sellerApplication.service');

// ---- Applicant ----

const getOrCreateDraft = asyncHandler(async (req, res) => {
  const application = await service.getOrCreateDraft(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application retrieved', data: { application } });
});

const getMyApplication = asyncHandler(async (req, res) => {
  const application = await service.getMyApplication(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application retrieved', data: { application } });
});

const updateDraft = asyncHandler(async (req, res) => {
  const v = validators.validateApplicationInput(req.body, { isSubmit: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const application = await service.updateDraft(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Draft saved', data: { application } });
});

const submitApplication = asyncHandler(async (req, res) => {
  const v = validators.validateApplicationInput(req.body, { isSubmit: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const application = await service.submitApplication(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application submitted', data: { application } });
});

const cancelApplication = asyncHandler(async (req, res) => {
  const application = await service.cancelApplication(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application cancelled', data: { application } });
});

// ---- Admin ----

const listApplications = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listApplications(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Applications retrieved', data: { applications: items }, meta });
});

const getApplication = asyncHandler(async (req, res) => {
  const application = await service.getApplicationById(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application retrieved', data: { application } });
});

const startReview = asyncHandler(async (req, res) => {
  const application = await service.startReview(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application moved to review', data: { application } });
});

const approveApplication = asyncHandler(async (req, res) => {
  const v = validators.validateAdminNotesInput(req.body);
  const application = await service.approveApplication(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application approved', data: { application } });
});

const rejectApplication = asyncHandler(async (req, res) => {
  const v = validators.validateRejectionInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const application = await service.rejectApplication(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Application rejected', data: { application } });
});

const suspendSeller = asyncHandler(async (req, res) => {
  const v = validators.validateAdminNotesInput(req.body);
  const application = await service.suspendSeller(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Seller access suspended', data: { application } });
});

module.exports = {
  getOrCreateDraft, getMyApplication, updateDraft, submitApplication, cancelApplication,
  listApplications, getApplication, startReview, approveApplication, rejectApplication, suspendSeller,
};