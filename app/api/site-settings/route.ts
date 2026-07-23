import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { fetchSiteSettings, saveSiteSettings } from "@/services/site-settings.service";
import { siteSettingsSchema } from "@/validators/site-settings";

export async function GET(request: Request) {
  try {
    const settings = await fetchSiteSettings();
    return successResponse({ settings }, "Site settings fetched successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult) {
      return authResult;
    }

    const body = await parseRequestBody(request);
    const payload = validateBody(siteSettingsSchema, body);
    const settings = await saveSiteSettings(payload);

    return successResponse({ settings }, "Site settings saved successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(formatFirstZodError(error), 400);
    }
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse("Internal Server Error", 500);
  }
}

