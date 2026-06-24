import os
import django
from django.core.management import call_command
from io import StringIO

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mos_rest_api.settings')
os.environ['DATABASE_URL'] = 'postgres://dummy:dummy@localhost:5432/dummy'

django.setup()

# Mock the Postgres connection to prevent connection refused errors
from django.db.backends.postgresql.base import DatabaseWrapper
DatabaseWrapper.ensure_connection = lambda self: None
DatabaseWrapper.pg_version = 130000

# Get all migrations
from django.db.migrations.loader import MigrationLoader
loader = MigrationLoader(None, ignore_no_migrations=True)

# Order of core apps is important to prevent foreign key errors if they execute out of order in a raw script.
# We will just write them in topological order using Django's migration graph
plan = []
for target in loader.graph.leaf_nodes():
    for node in loader.graph.forwards_plan(target):
        if node not in plan:
            plan.append(node)

with open('supabase_schema.sql', 'w', encoding='utf-8') as f:
    f.write("-- MOS BURGER SUPABASE POSTGRESQL SCHEMA\n")
    f.write("-- Generated dynamically from Django Migrations\n\n")
    
    for (app_name, migration_name) in plan:
        out = StringIO()
        try:
            call_command('sqlmigrate', app_name, migration_name, stdout=out, no_color=True)
            sql = out.getvalue()
            
            # Clean up Django's BEGIN/COMMIT wrappers since we just want the raw DDL
            sql = sql.replace("BEGIN;", "").replace("COMMIT;", "").strip()
            
            if sql:
                f.write(f"-- [{app_name}] {migration_name}\n")
                f.write(sql + "\n\n")
        except Exception as e:
            print(f"Error on {app_name} {migration_name}: {e}")

print("SQL Script successfully generated at supabase_schema.sql!")
