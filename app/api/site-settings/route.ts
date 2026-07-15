import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { fetchSiteSettings, saveSiteSettings } from "@/services/site-settings.service";
import { siteSettingsSchema } from "@/validators/site-settings";

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON payload";
    throw new ApiError("Invalid JSON payload", 400, { _error: [message] });
  }
}

export async function GET(request: Request) {
  try {
    const settings = await fetchSiteSettings();
    return success("Site settings fetched successfully", { settings });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }
    return serverError("Internal Server Error");
  }
}

export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult) {
      return authResult;
    }

    const body = await readJson(request);
    const payload = validateBody(siteSettingsSchema, body);
    const settings = await saveSiteSettings(payload);

    return success("Site settings saved successfully", { settings });
  } catch (error) {
    if (error instanceof ZodError) {
      return validation("Validation failed", formatZodErrors(error));
    }
    if (error instanceof ApiError) {
      return apiError(error);
    }
    return serverError("Internal Server Error");
  }
}
