import time
import logging
import gspread
import requests
from google.oauth2.service_account import Credentials

# =========================================================
# CONFIGURATION
# =========================================================
SERVICE_ACCOUNT_FILE = "keys/school-enquiry-form-d1a4bfaaf6a0.json"
SPREADSHEET_ID = "1rIufJA-mpS71VvHKyNzTJQ8BEbCgUoihv46mO4WyF4Q"

CHECK_INTERVAL = 30  # seconds

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
# LOGGING SETUP
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
    logging.info("Google authentication successful")
    return client.open_by_key(SPREADSHEET_ID).sheet1

# =========================================================
# PROCESS RESPONSES (FIFO QUEUE)
# =========================================================
def process_responses(sheet):
    while True:
        rows = sheet.get_all_records()

        if not rows:
            logging.info("No new responses")
            break

        # Always process the OLDEST response (row 2)
        row = rows[0]

        # -------------------------------------------------
        # CLASS → COURSE MAPPING
        # -------------------------------------------------
        class_name = row.get("Class", "").strip()
        course_id = CLASS_COURSE_MAP.get(class_name)

        if not course_id:
            logging.error(f"Invalid class name: '{class_name}'")
            break

        # -------------------------------------------------
        # BUILD PAYLOAD
        # -------------------------------------------------
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

        # -------------------------------------------------
        # REQUIRED FIELD CHECK
        # -------------------------------------------------
        if not payload["firstname"] or not payload["lastname"]:
            logging.error("Firstname or Lastname missing")
            break

        logging.info("Sending enquiry to backend")
        logging.info("Payload: %s", payload)

        try:
            response = requests.post(
                API_URL,
                json=payload,
                timeout=10
            )

            if response.status_code in (200, 201):
                logging.info("Backend accepted enquiry ✅")
                # DELETE ONLY AFTER SUCCESS
                sheet.delete_rows(2)
            else:
                logging.error(
                    "Backend error (%s): %s",
                    response.status_code,
                    response.text
                )
                break

        except requests.RequestException as e:
            logging.error("API request failed: %s", str(e))
            break

        # Small delay to avoid rate limits
        time.sleep(1)

# =========================================================
# MAIN LOOP
# =========================================================
def main():
    logging.info("Google Form Listener Started")
    logging.info("Waiting for responses...")

    sheet = get_sheet()

    try:
        while True:
            process_responses(sheet)
            time.sleep(CHECK_INTERVAL)

    except KeyboardInterrupt:
        logging.info("Shutdown requested (Ctrl+C)")
        logging.info("Listener stopped gracefully")

# =========================================================
# ENTRY POINT
# =========================================================
if __name__ == "__main__":
    main()
