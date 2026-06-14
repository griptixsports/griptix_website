from __future__ import annotations

from pydantic_settings import BaseSettings


def _is_placeholder(value: str | None) -> bool:
    """Return True if a config value is still the CHANGE_ME template string."""
    return not value or "CHANGE_ME" in value


class Settings(BaseSettings):
    # ── Application ───────────────────────────────────────────────────────────
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    allowed_origins: str = "http://localhost:3000"

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = ""
    alembic_database_url: str = ""

    # ── Auth / JWT ────────────────────────────────────────────────────────────
    jwt_secret: str = "CHANGE_ME"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # ── Redis ─────────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379"

    # ── Stripe ── TEMPORARY: awaiting production secret (see MAINTENANCE.md) ──
    stripe_secret_key: str = "sk_test_CHANGE_ME"
    stripe_webhook_secret: str = "whsec_CHANGE_ME"
    stripe_currency: str = "usd"

    # ── Razorpay ──────────────────────────────────────────────────────────────
    razorpay_key_id: str = "rzp_test_CHANGE_ME"
    razorpay_key_secret: str = "CHANGE_ME"
    razorpay_webhook_secret: str = "CHANGE_ME"
    razorpay_currency: str = "INR"

    # ── Cloudflare R2 ── TEMPORARY: awaiting credentials (see MAINTENANCE.md) ─
    r2_endpoint_url: str = "https://CHANGE_ME.r2.cloudflarestorage.com"
    r2_access_key_id: str = "CHANGE_ME"
    r2_secret_access_key: str = "CHANGE_ME"
    r2_uploads_bucket: str = "griptix-uploads"
    r2_media_bucket: str = "griptix-media"
    r2_media_public_url: str = "https://media.griptix.in"
    s3_presigned_url_expire_seconds: int = 900

    # ── Brevo (email / SMS) ───────────────────────────────────────────────────
    brevo_api_key: str = "xkeysib-CHANGE_ME"
    brevo_from_email: str = "orders@mail.griptix.in"
    brevo_from_name: str = "Griptix"
    brevo_template_order_confirmation: int = 1
    brevo_template_sizing_verified: int = 2
    brevo_template_shipped: int = 3
    brevo_template_review_request: int = 4

    # ── Sentry ── TEMPORARY: awaiting DSN (see MAINTENANCE.md) ───────────────
    sentry_dsn_backend: str = "https://CHANGE_ME@o0.ingest.sentry.io/CHANGE_ME"
    sentry_traces_sample_rate: float = 1.0
    sentry_environment: str = "development"

    # ── Logtail / Better Stack ── TEMPORARY: awaiting token (see MAINTENANCE.md)
    logtail_source_token: str = "CHANGE_ME"

    # ── Groq LLM ──────────────────────────────────────────────────────────────
    groq_api_key: str = "gsk_CHANGE_ME"
    groq_model: str = "llama-3.3-70b-versatile"

    # ── Hugging Face ──────────────────────────────────────────────────────────
    hf_api_key: str = "hf_CHANGE_ME"
    hf_embedding_model: str = "BAAI/bge-small-en-v1.5"

    # ── Langfuse ──────────────────────────────────────────────────────────────
    langfuse_secret_key: str = "sk-lf-CHANGE_ME"
    langfuse_public_key: str = "pk-lf-CHANGE_ME"
    langfuse_host: str = "https://cloud.langfuse.com"

    # ── Feature Flags ─────────────────────────────────────────────────────────
    feature_whatsapp_enabled: bool = False
    feature_ai_sizing_validation: bool = False
    feature_semantic_search: bool = False

    # ── Readiness checks ─────────────────────────────────────────────────────
    @property
    def stripe_ready(self) -> bool:
        return not _is_placeholder(self.stripe_secret_key)

    @property
    def r2_ready(self) -> bool:
        return not _is_placeholder(self.r2_access_key_id)

    @property
    def sentry_ready(self) -> bool:
        return not _is_placeholder(self.sentry_dsn_backend)

    @property
    def logtail_ready(self) -> bool:
        return not _is_placeholder(self.logtail_source_token)

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    model_config = {"env_file": ".env", "case_sensitive": False, "extra": "ignore"}


settings = Settings()
