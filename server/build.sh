#!/usr/bin/env bash

# Stop immediately if any command fails.
set -o errexit

# Install Python dependencies.
pip install -r requirements.txt

# Collect Django static files.
python manage.py collectstatic --noinput