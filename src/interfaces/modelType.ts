// Interfaces
import modelActions from "./modelActions";

type ModelTypeSignature = (value: unknown, row: Record<string, unknown>, parameters?: any) => unknown;
type ModelTypeInterface = Partial<Record<modelActions, ModelTypeSignature> & {type: {type: string, length?: number, }}>;

// deno-lint-ignore no-undef
export default ModelTypeInterface;
