def is_na(value):
    return (
        value is None
        or str(value).strip().lower() in {"n/a", "na", ""}
    )