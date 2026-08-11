// Fallback rate used only if a state has no configured row yet —
// intentionally 0, never a guessed nonzero value, so an unconfigured
// state is visibly $0 tax (auditable/obviously-wrong) rather than a
// silently incorrect nonzero number.
const FALLBACK_RATE = 0;

// States with genuinely no state-level sales tax — seeded as 0 by
// design, not "missing configuration."
const NO_SALES_TAX_STATES = ['DE', 'MT', 'NH', 'OR', 'AK'];
// Note: AK has no state sales tax but allows local taxes — this
// phase is state-level only (documented limitation), so AK is
// correctly 0 here even though some AK localities do charge tax.

module.exports = { FALLBACK_RATE, NO_SALES_TAX_STATES };