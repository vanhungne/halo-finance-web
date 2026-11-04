import { useEffect, useState } from "react";
import { adminRecoveryJournal } from "./adminRecoveryJournal";

function read(actor) {
  try { return { actor, locator: actor ? adminRecoveryJournal.read(actor) : null, blocked: !actor, resolution: null }; }
  catch { return { actor, locator: null, blocked: true, resolution: null }; }
}

export function useAdminCommandRecovery(actor) {
  const [state, setState] = useState(() => read(actor));
  useEffect(() => {
    const update = (event) => setState({ ...read(actor), resolution: event?.type === "resolved" && event.locator.actor === actor ? event : null });
    update(); return adminRecoveryJournal.subscribe(update);
  }, [actor]);
  return state.actor === actor ? state : read(actor);
}
