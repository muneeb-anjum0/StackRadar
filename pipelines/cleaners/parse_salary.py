import re


def _money(value: str) -> float:
    cleaned = value.lower().replace(",", "").strip()
    if cleaned.endswith("k"):
        return float(cleaned[:-1]) * 1000
    if "lac" in cleaned or "lakh" in cleaned:
        number = re.search(r"\d+(\.\d+)?", cleaned)
        return float(number.group(0)) * 100000 if number else 0
    return float(re.sub(r"[^\d.]", "", cleaned) or 0)


def parse_salary(raw_salary: str | None) -> dict[str, float | str | None | bool]:
    if not raw_salary:
        return {"salary_min": None, "salary_max": None, "currency": None, "invalid_salary": False}

    text = raw_salary.lower().strip()
    if any(term in text for term in ["competitive", "market", "not disclosed", "negotiable"]):
        return {"salary_min": None, "salary_max": None, "currency": None, "invalid_salary": False}

    currency = "USD" if "$" in text or "usd" in text else "PKR"
    lac_match = re.search(r"\d+(\.\d+)?\s*(lac|lakh)", text)
    if lac_match:
        value = _money(lac_match.group(0))
        return {"salary_min": value, "salary_max": value, "currency": currency, "invalid_salary": False}

    values = re.findall(r"\d+(?:,\d{3})*(?:\.\d+)?\s*k?|\d+(?:\.\d+)?", text)
    if not values:
        return {"salary_min": None, "salary_max": None, "currency": None, "invalid_salary": True}

    parsed = [_money(value) for value in values[:2]]
    if len(parsed) == 1:
        parsed.append(parsed[0])
    return {"salary_min": parsed[0], "salary_max": parsed[1], "currency": currency, "invalid_salary": False}
