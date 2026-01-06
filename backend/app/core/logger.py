# backend/app/core/logger.py
import logging
import os
import sys

LOG_FORMAT = "[%(asctime)s] %(levelname)s %(name)s: %(message)s"

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=LOG_LEVEL,
    format=LOG_FORMAT,
    handlers=[logging.StreamHandler(sys.stdout)],
)

def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
