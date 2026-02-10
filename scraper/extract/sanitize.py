from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

PII_ENTITIES = {
    "PERSON",
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "USERNAME",
    "IP_ADDRESS",
    "CREDIT_CARD",
    "IBAN",
}

_analyzer = AnalyzerEngine()
_anonymizer = AnonymizerEngine()


def sanitize_markdown(text: str) -> str:
    if not text:
        return text

    try:
        results = _analyzer.analyze(
            text=text,
            language="en",
            entities=list(PII_ENTITIES),
        )

        if not results:
            return text

        anonymized = _anonymizer.anonymize(
            text=text,
            analyzer_results=results,
        )

        return anonymized.text

    except Exception:
        return text
