import { z } from 'zod';
import type { License, LicenseLimits } from '@atlashub/license-validator';

// Re-export types from license-validator
export type { License, LicenseLimits };

// Legacy key format (deprecated, kept for backwards compatibility)
export const LegacyLicenseKeySchema = z.string().regex(
  /^CGFW-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  'Invalid legacy license key format. Expected: CGFW-XXXX-XXXX-XXXX'
);

// JWT license key (new format)
export const JwtLicenseKeySchema = z.string().regex(
  /^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
  'Invalid JWT license key format'
);

// Combined license key schema (accepts both formats)
export const LicenseKeySchema = z.string().refine(
  (key) => {
    return LegacyLicenseKeySchema.safeParse(key).success ||
           JwtLicenseKeySchema.safeParse(key).success;
  },
  'Invalid license key format'
);

export const LicensePlanSchema = z.enum(['starter', 'professional', 'enterprise', 'trial', 'pro', 'team']);

export const LicenseResponseSchema = z.object({
  valid: z.boolean(),
  plan: LicensePlanSchema.optional(),
  edition: z.string().optional(),
  expiresAt: z.string().optional(),
  features: z.array(z.string()).optional(),
  company: z.string().optional(),
  daysRemaining: z.number().optional(),
  error: z.string().optional(),
});

export const StoredLicenseSchema = z.object({
  key: z.string(),
  type: z.enum(['jwt', 'legacy']).default('jwt'),
  plan: z.string(),
  edition: z.string().optional(),
  company: z.string().optional(),
  features: z.array(z.string()).optional(),
  expiresAt: z.string(),
  validatedAt: z.string(),
  machineId: z.string(),
});

export type LicenseKey = z.infer<typeof LicenseKeySchema>;
export type LicensePlan = z.infer<typeof LicensePlanSchema>;
export type LicenseResponse = z.infer<typeof LicenseResponseSchema>;
export type StoredLicense = z.infer<typeof StoredLicenseSchema>;

// Feature definitions for this product
export const PRODUCT_FEATURES = {
  gitflow: 'gitflow',
  apex: 'apex',
  efcore: 'efcore',
  prompts: 'prompts',
  businessAnalyse: 'business-analyse',
} as const;

export type ProductFeature = typeof PRODUCT_FEATURES[keyof typeof PRODUCT_FEATURES];
