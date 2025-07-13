import { serialize as convertToFormData, Options } from "object-to-formdata";

export function serialize<T>(
  object: T,
  options?: Partial<Options>,
  existingFormData?: FormData,
  keyPrefix?: string
): FormData {
  return convertToFormData(
    object,
    {
      noAttributesWithArrayNotation: true,
      ...options,
    },
    existingFormData,
    keyPrefix
  );
}
