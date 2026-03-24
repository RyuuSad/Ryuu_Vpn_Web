# Update pnpm-lock.yaml

The Docker build is failing because we added Jest dependencies but the lockfile is out of sync.

## Fix on Server

SSH into your server and run:

```bash
cd /opt/ryuu-vpn
git pull origin master
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update pnpm-lock.yaml for Jest dependencies"
git push origin master
```

Then rebuild:

```bash
docker compose down
docker compose up -d --build
```

## Alternative: Temporary Fix

If you want to deploy immediately without updating lockfile, modify `Dockerfile` line 28:

```dockerfile
# Change from:
RUN pnpm install --frozen-lockfile

# To:
RUN pnpm install --no-frozen-lockfile
```

Then revert this change after the lockfile is updated.
