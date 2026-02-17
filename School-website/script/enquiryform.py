import time
import logging
import random
import requests
import gspread

from google.oauth2.service_account import Credentials
from gspread.exceptions import APIError

# =========================================================
# CONFIGURATION
# ========================================================= 
SERVICE_ACCOUNT_FILE = "keys/school-enquiry-form-d1a4bfaaf6a0.json"
SPREADSHEET_ID = "1rIufJA-mpS71VvHKyNzTJQ8BEbCgUoihv46mO4WyF4Q"

CHECK_INTERVAL = 900  # seconds (15 minutes)

API_URL = "https://newtonianlearningsolutions.com/member/admin/add-new-enquiry-form/"
INST_ID = 13

# =========================================================
# CLASS → COURSE ID MAP
# =========================================================
CLASS_COURSE_MAP = {
    "M1": 154,
    "M2": 155,
    "1 Standard": 156,
    "2 Standard": 157,
    "3 Standard": 158,
    "4 Standard": 160,
    "5 Standard": 161,
    "6 Standard": 162,
    "7 Standard": 163,
    "8 Standard": 164,
}

# =========================================================
# LOGGING
# =========================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S"
)

# =========================================================
# GOOGLE AUTH
# =========================================================
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def get_sheet():
    credentials = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES
    )
    client = gspread.authorize(credentials)
    return client.open_by_key(SPREADSHEET_ID).sheet1

# =========================================================
# SAFE GOOGLE READ WITH BACKOFF
# =========================================================
def safe_get_records(sheet, retries=5):
    delay = 5

    for attempt in range(1, retries + 1):
        try:
            if sheet.row_count <= 1:
                return []

            return sheet.get_all_records()

        except APIError as e:
            if "503" in str(e):
                logging.warning(
                    "Google API 503 (attempt %s/%s). Retrying in %ss",
                    attempt, retries, delay
                )
                time.sleep(delay)
                delay = min(delay * 2, 120)
            else:
                raise

    logging.error("Google API unavailable after retries")
    return []

# =========================================================
# PROCESS SINGLE RESPONSE (FIFO + LOCKED)
# =========================================================
def process_responses(sheet):
    rows = safe_get_records(sheet)

    if not rows:
        logging.info("No new responses")
        return

    # Always process OLDEST row (row 2)
    row = rows[0]

    # 🔐 Skip already processed rows
    if row.get("Processed") == "YES":
        logging.info("Row already processed, deleting")
        sheet.delete_rows(2)
        return

    class_name = row.get("Class", "").strip()
    course_id = CLASS_COURSE_MAP.get(class_name)

    if not course_id:
        logging.error("Invalid class name: '%s'", class_name)
        return

    payload = {
        "form_id": None,
        "firstname": row.get("First Name", "").strip(),
        "lastname": row.get("Last Name", "").strip(),
        "email": row.get("Email"),
        "phone_number": (
            str(row.get("Phone Number"))
            if row.get("Phone Number") is not None
            else None
        ),
        "qualification": row.get("Qualification"),
        "address": row.get("Address"),
        "last_inst_attended": row.get("Last Institution Attended"),
        "selected_course": course_id,
        "inst_id": INST_ID
    }

    if not payload["firstname"] or not payload["lastname"]:
        logging.error("Firstname or Lastname missing")
        return

    logging.info(
        "Sending enquiry → %s %s",
        payload["firstname"],
        payload["lastname"]
    )

    try:
        response = requests.post(
            API_URL,
            json=payload,
            timeout=15
        )

        if response.status_code in (200, 201):
            logging.info("Backend accepted enquiry ✅")

            processed_col = sheet.find("Processed").col
            sheet.update_cell(2, processed_col, "YES")
            sheet.delete_rows(2)

        else:
            logging.error(
                "Backend error (%s): %s",
                response.status_code,
                response.text
            )

    except requests.RequestException as e:
        logging.error("Backend request failed: %s", e)

    time.sleep(random.uniform(1, 2))

# =========================================================
# MAIN LOOP
# =========================================================
def main():
    logging.info("Google Form Listener started")

    while True:
        try:
            sheet = get_sheet()
            process_responses(sheet)

        except APIError as e:
            logging.error("Google API error: %s", e)
            time.sleep(60)

        except Exception:
            logging.exception("Unexpected error")
            time.sleep(60)

        time.sleep(CHECK_INTERVAL)

# =========================================================
# ENTRY POINT
# =========================================================
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logging.info("Shutdown requested. Exiting gracefully.")
