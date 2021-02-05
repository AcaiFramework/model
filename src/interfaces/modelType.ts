// Interfaces
import modelActions from "./modelActions.ts";

type ModelTypeSignature = (value: unknown, row: Record<string, unknown>, parameters: string[]) => unknown;
type ModelTypeInterface = Partial<Record<modelActions, ModelTypeSignature>>;

// deno-lint-ignore no-undef
export default ModelTypeInterface;
