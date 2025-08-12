For development:
!Use docker compose!

Only for production, two steps.

1. Build production image:
   docker build --target=prod -t lazylab/monotemplate:latest -f ./Dockerfile --build-arg APP_NAME=api ../../ --no-cache

2. Run container:
   docker run -p 3100:3001 -e NODE_ENV=development -e DATABASE_URL=someurl -e PORT=3001 <image id/name>
