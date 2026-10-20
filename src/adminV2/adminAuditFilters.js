const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const maxPage = 2147483647;
const hasControlCharacter = (value) => [...value].some((character) => {
  const code = character.charCodeAt(0);
  return code < 32 || code === 127;
});

export function parseAuditPage(value) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maxPage ? parsed : 1;
}

/** Build each generated endpoint's own parameters, never forward the other DTO. */
export function buildAdminAuditFilters(params) {
  const actor = (params.get("actor") ?? "").trim();
  const target = (params.get("target") ?? "").trim();
  const action = (params.get("action") ?? "").trim().toUpperCase();
  const outcome = (params.get("outcome") ?? "").trim().toUpperCase();
  const size = Number(params.get("size") ?? 20);
  const PageSize = Number.isInteger(size) && size >= 1 && size <= 100 ? size : 20;
  const valid = (!actor || uuid.test(actor)) && (!target || uuid.test(target))
    && action.length <= 64 && outcome.length <= 64
    && !hasControlCharacter(action + outcome);
  const common = {
    PageSize,
    ...(actor ? { ActorUserId: actor.toLowerCase() } : {}),
    ...(action ? { Action: action } : {}),
  };
  return {
    valid,
    fields: { actor, target, action, outcome },
    lifecycle: { ...common, PageIndex: parseAuditPage(params.get("page")),
      ...(target ? { TargetUserId: target.toLowerCase() } : {}),
      ...(outcome ? { OutcomeCode: outcome } : {}) },
    commands: { ...common, PageIndex: parseAuditPage(params.get("commandPage")),
      ...(target ? { TargetId: target.toLowerCase() } : {}),
      ...(outcome ? { ResultCode: outcome } : {}) },
  };
}
