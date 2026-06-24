import psycopg2

regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1",
    "ap-south-1", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2",
    "sa-east-1", "ca-central-1", "me-south-1", "af-south-1"
]

for r in regions:
    host = f"aws-0-{r}.pooler.supabase.com"
    try:
        conn = psycopg2.connect(
            host=host,
            port=6543,
            dbname="postgres",
            user="postgres.rswkmeyarcuzrnihdcjw",
            password="Mosburger@123",
            connect_timeout=5
        )
        conn.close()
        print(f"CONNECTED! Region: {r}")
        print(f"Use this in .env:")
        print(f"DATABASE_URL=postgresql://postgres.rswkmeyarcuzrnihdcjw:Mosburger%40123@aws-0-{r}.pooler.supabase.com:6543/postgres")
        break
    except Exception as e:
        err = str(e)
        if "ENOTFOUND" in err:
            pass  # wrong region, skip silently
        else:
            print(f"{r}: {err[:80]}")
else:
    print("Could not find region. Trying direct connection with IPv4 forced...")
    try:
        import socket
        ip = socket.getaddrinfo("db.rswkmeyarcuzrnihdcjw.supabase.co", 5432, socket.AF_INET)
        print(f"IPv4 addresses: {ip}")
    except:
        print("No IPv4 address available for direct connection either.")
