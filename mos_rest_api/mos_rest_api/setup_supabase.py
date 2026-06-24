import os
import subprocess
import sys

def run_command(command):
    print(f"\n Running: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f" Error executing: {command}")
        sys.exit(1)
    print(" Success!")

if __name__ == "__main__":
    print("--- MOS BURGER: SUPABASE INITIALIZATION SCRIPT ---")
    print("===================================================")
    
    # 1. Create Tables (Django's built-in migration system)
    print("\n--- STEP 1: Creating Database Tables in Supabase ---")
    print("(This uses your Django models to create exact PostgreSQL tables)")
    run_command(f"{sys.executable} manage.py migrate")

    # 2. Populate Data (Using your existing scripts)
    print("\n--- STEP 2: Populating Initial Data ---")
    run_command(f"{sys.executable} wipe_and_recreate_users.py")
    run_command(f"{sys.executable} populate_toppings.py")
    run_command(f"{sys.executable} populate_offers.py")
    run_command(f"{sys.executable} build_riders.py")
    run_command(f"{sys.executable} seed_historical_forecast_data.py")

    print("\n===================================================")
    print(" SUPABASE DATABASE FULLY SETUP AND POPULATED! ")
