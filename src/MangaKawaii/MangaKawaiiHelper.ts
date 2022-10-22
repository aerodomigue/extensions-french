import { LanguageCode, SourceStateManager } from "paperback-extensions-common";

export const getLanguages = async (stateManager: SourceStateManager): Promise<string[]> => {
    return (await stateManager.retrieve('languages') as string[]) ?? LanguageCode.FRENCH;
  }