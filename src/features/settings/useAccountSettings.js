import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { settingsService } from '@/services/modules'

/**
 * Account settings feature hooks.
 */
export function useSettingsPreferences() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SETTINGS.PREFERENCES,
    queryFn: settingsService.getPreferences,
  })
}

export function useUpdatePreferences() {
  return useApiMutation({
    mutationFn: settingsService.updatePreferences,
    invalidateKeys: [QUERY_KEYS.SETTINGS.PREFERENCES],
  })
}

export function useUpdateSetting() {
  return useApiMutation({
    mutationFn: settingsService.updatePreferences,
    invalidateKeys: [QUERY_KEYS.SETTINGS.PREFERENCES],
  })
}
